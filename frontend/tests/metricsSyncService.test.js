const test = require('node:test');
const assert = require('node:assert/strict');

const { createMetricsApiClient } = require('../src/services/metricsApiClient');
const { createMetricsSyncService } = require('../src/services/metricsSyncService');
const { createWorkerIdentityStore } = require('../src/services/workerIdentityStore');

test('metrics api client posts ingest payloads and reads summaries', async () => {
  const calls = [];
  const fetchImpl = async (url, options = {}) => {
    calls.push({ url, options });
    return {
      ok: true,
      async json() {
        if (url.includes('/metrics/daily-summaries')) {
          return [{ local_date: '2026-04-26' }];
        }

        return { ingested_count: 1 };
      },
    };
  };

  const client = createMetricsApiClient({
    baseUrl: 'http://localhost:8000',
    fetchImpl,
  });

  await client.ingestSummaries([{ worker_id: 'worker-1', local_date: '2026-04-26' }]);
  const summaries = await client.getDailySummaries('worker-1', '2026-04-20', '2026-04-26');

  assert.equal(calls.length, 2);
  assert.match(calls[0].url, /\/metrics\/ingest$/);
  assert.match(calls[1].url, /worker_id=worker-1/);
  assert.equal(summaries[0].local_date, '2026-04-26');
});

test('metrics sync service uses recent date window and returns canonical summaries', async () => {
  const healthIngestionService = {
    async fetchDailySummaries(workerId, startDate, endDate) {
      assert.equal(workerId, 'worker-sync');
      assert.equal(startDate, '2026-04-20');
      assert.equal(endDate, '2026-04-26');
      return [{ worker_id: workerId, local_date: endDate }];
    },
  };
  const metricsApiClient = {
    async ingestSummaries(summaries) {
      assert.equal(summaries.length, 1);
      return { ingested_count: 1 };
    },
    async getDailySummaries(workerId, startDate, endDate) {
      return [{ worker_id: workerId, local_date: startDate }, { worker_id: workerId, local_date: endDate }];
    },
  };

  const service = createMetricsSyncService({
    healthIngestionService,
    metricsApiClient,
  });

  const result = await service.syncRecentDays('worker-sync', 7, new Date('2026-04-26T12:00:00Z'));

  assert.equal(result.startDate, '2026-04-20');
  assert.equal(result.endDate, '2026-04-26');
  assert.equal(result.canonicalSummaries.length, 2);
});

test('worker identity store persists through injected secure store', async () => {
  let storedValue = null;
  const secureStore = {
    async getItemAsync() {
      return storedValue;
    },
    async setItemAsync(_key, value) {
      storedValue = value;
    },
    async deleteItemAsync() {
      storedValue = null;
    },
  };

  const store = createWorkerIdentityStore({ secureStore });
  await store.setWorkerId('worker-local');
  assert.equal(await store.getWorkerId(), 'worker-local');
  await store.clearWorkerId();
  assert.equal(await store.getWorkerId(), null);
});
