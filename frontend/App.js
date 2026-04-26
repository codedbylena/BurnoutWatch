import { useEffect, useMemo, useState } from 'react';
import {
  ActivityIndicator,
  Platform,
  Pressable,
  SafeAreaView,
  ScrollView,
  StatusBar,
  StyleSheet,
  Text,
  TextInput,
  View,
} from 'react-native';

const { createHealthIngestionService } = require('./src/metrics/healthIngestionService');
const { createMetricsApiClient } = require('./src/services/metricsApiClient');
const { createMetricsSyncService } = require('./src/services/metricsSyncService');
const { createWorkerIdentityStore } = require('./src/services/workerIdentityStore');

const workerIdentityStore = createWorkerIdentityStore();

function MetricRow({ label, value }) {
  return (
    <View style={styles.metricRow}>
      <Text style={styles.metricLabel}>{label}</Text>
      <Text style={styles.metricValue}>{value}</Text>
    </View>
  );
}

export default function App() {
  const [workerId, setWorkerId] = useState('');
  const [availability, setAvailability] = useState(null);
  const [permissions, setPermissions] = useState(null);
  const [statusMessage, setStatusMessage] = useState('Load a development build, set a worker ID, then sync.');
  const [syncState, setSyncState] = useState({ loading: true, syncing: false, requesting: false });
  const [canonicalSummaries, setCanonicalSummaries] = useState([]);

  const healthIngestionService = useMemo(() => createHealthIngestionService(), []);
  const metricsApiClient = useMemo(() => createMetricsApiClient({ platform: Platform.OS }), []);
  const metricsSyncService = useMemo(
    () =>
      createMetricsSyncService({
        healthIngestionService,
        metricsApiClient,
      }),
    [healthIngestionService, metricsApiClient]
  );

  useEffect(() => {
    let isMounted = true;

    async function bootstrap() {
      try {
        const [storedWorkerId, providerAvailability] = await Promise.all([
          workerIdentityStore.getWorkerId(),
          healthIngestionService.getAvailability(),
        ]);

        if (!isMounted) {
          return;
        }

        setWorkerId(storedWorkerId ?? '');
        setAvailability(providerAvailability);
        setStatusMessage(
          providerAvailability.providerAvailable
            ? `Health connector available on ${Platform.OS}.`
            : `Health connector unavailable on ${Platform.OS}. Use a development build with native permissions enabled.`
        );
      } catch (error) {
        if (isMounted) {
          setStatusMessage(error.message);
        }
      } finally {
        if (isMounted) {
          setSyncState((current) => ({ ...current, loading: false }));
        }
      }
    }

    bootstrap();

    return () => {
      isMounted = false;
    };
  }, [healthIngestionService]);

  async function persistWorkerId(nextWorkerId) {
    const trimmed = nextWorkerId.trim();
    setWorkerId(nextWorkerId);

    if (trimmed) {
      await workerIdentityStore.setWorkerId(trimmed);
      return trimmed;
    }

    await workerIdentityStore.clearWorkerId();
    return '';
  }

  async function handleRequestPermissions() {
    setSyncState((current) => ({ ...current, requesting: true }));

    try {
      const grantedPermissions = await healthIngestionService.requestPermissions();
      setPermissions(grantedPermissions);
      setStatusMessage('Permissions requested. Review per-metric results below.');
    } catch (error) {
      setStatusMessage(`Permission request failed: ${error.message}`);
    } finally {
      setSyncState((current) => ({ ...current, requesting: false }));
    }
  }

  async function handleSync() {
    const persistedWorkerId = await persistWorkerId(workerId);
    if (!persistedWorkerId) {
      setStatusMessage('Enter a worker ID before syncing.');
      return;
    }

    setSyncState((current) => ({ ...current, syncing: true }));

    try {
      const syncResult = await metricsSyncService.syncRecentDays(persistedWorkerId, 7);
      setCanonicalSummaries(syncResult.canonicalSummaries);
      setStatusMessage(
        `Synced ${syncResult.ingestResponse.ingested_count} summaries from ${syncResult.startDate} to ${syncResult.endDate} using ${metricsApiClient.baseUrl}.`
      );
    } catch (error) {
      setStatusMessage(`Sync failed: ${error.message}`);
    } finally {
      setSyncState((current) => ({ ...current, syncing: false }));
    }
  }

  const availabilityRows = availability?.metrics
    ? Object.entries(availability.metrics).map(([metric, value]) => (
        <MetricRow key={`availability-${metric}`} label={metric} value={value} />
      ))
    : null;

  const permissionRows = permissions
    ? Object.entries(permissions).map(([metric, value]) => (
        <MetricRow key={`permission-${metric}`} label={metric} value={value} />
      ))
    : null;

  return (
    <SafeAreaView style={styles.safeArea}>
      <StatusBar barStyle="dark-content" />
      <ScrollView contentContainerStyle={styles.content}>
        <Text style={styles.eyebrow}>BurnoutWatch</Text>
        <Text style={styles.title}>Device Metric Sync</Text>
        <Text style={styles.subtitle}>
          Reads HealthKit on iPhone or Health Connect on Android, then uploads canonical daily summaries for the scoring pipeline.
        </Text>

        <View style={styles.card}>
          <Text style={styles.sectionTitle}>Worker Identity</Text>
          <TextInput
            autoCapitalize="none"
            autoCorrect={false}
            onChangeText={setWorkerId}
            placeholder="worker-123"
            placeholderTextColor="#64748b"
            style={styles.input}
            value={workerId}
          />
          <Text style={styles.helper}>Stored locally on-device until real authentication exists.</Text>
        </View>

        <View style={styles.buttonRow}>
          <Pressable
            disabled={syncState.requesting || syncState.loading}
            onPress={handleRequestPermissions}
            style={({ pressed }) => [
              styles.button,
              styles.secondaryButton,
              pressed && styles.buttonPressed,
            ]}
          >
            <Text style={styles.secondaryButtonText}>
              {syncState.requesting ? 'Requesting...' : 'Request Permissions'}
            </Text>
          </Pressable>

          <Pressable
            disabled={syncState.syncing || syncState.loading}
            onPress={handleSync}
            style={({ pressed }) => [styles.button, pressed && styles.buttonPressed]}
          >
            <Text style={styles.buttonText}>{syncState.syncing ? 'Syncing...' : 'Sync Last 7 Days'}</Text>
          </Pressable>
        </View>

        <View style={styles.statusCard}>
          {syncState.loading ? <ActivityIndicator color="#0f766e" /> : null}
          <Text style={styles.statusText}>{statusMessage}</Text>
          <Text style={styles.helper}>API base URL: {metricsApiClient.baseUrl}</Text>
        </View>

        <View style={styles.card}>
          <Text style={styles.sectionTitle}>Connector Availability</Text>
          {availabilityRows}
        </View>

        <View style={styles.card}>
          <Text style={styles.sectionTitle}>Permission Results</Text>
          {permissionRows ?? <Text style={styles.helper}>Request permissions to populate per-metric status.</Text>}
        </View>

        <View style={styles.card}>
          <Text style={styles.sectionTitle}>Latest Canonical Summaries</Text>
          {canonicalSummaries.length ? (
            canonicalSummaries.map((summary) => (
              <View key={`${summary.worker_id}-${summary.local_date}`} style={styles.summaryCard}>
                <Text style={styles.summaryTitle}>
                  {summary.local_date} · {summary.source_platform}
                </Text>
                <MetricRow label="sleep_duration_hours" value={String(summary.sleep_duration_hours ?? 'null')} />
                <MetricRow label="sleep_quality_proxy" value={String(summary.sleep_quality_proxy ?? 'null')} />
                <MetricRow label="step_count" value={String(summary.step_count ?? 'null')} />
                <MetricRow
                  label="resting_heart_rate_bpm"
                  value={String(summary.resting_heart_rate_bpm ?? 'null')}
                />
                <MetricRow
                  label="heart_rate_variability_ms"
                  value={String(summary.heart_rate_variability_ms ?? 'null')}
                />
                <MetricRow label="activity_minutes" value={String(summary.activity_minutes ?? 'null')} />
                <MetricRow label="workout_count" value={String(summary.workout_count ?? 'null')} />
              </View>
            ))
          ) : (
            <Text style={styles.helper}>No synced summaries yet.</Text>
          )}
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    backgroundColor: '#f8fafc',
    flex: 1,
  },
  content: {
    padding: 20,
    paddingBottom: 40,
  },
  eyebrow: {
    color: '#0f766e',
    fontSize: 13,
    fontWeight: '700',
    letterSpacing: 1.2,
    textTransform: 'uppercase',
  },
  title: {
    color: '#0f172a',
    fontSize: 34,
    fontWeight: '800',
    marginTop: 6,
  },
  subtitle: {
    color: '#334155',
    fontSize: 16,
    lineHeight: 24,
    marginTop: 12,
  },
  card: {
    backgroundColor: '#ffffff',
    borderColor: '#dbe4ee',
    borderRadius: 20,
    borderWidth: 1,
    marginTop: 18,
    padding: 18,
    shadowColor: '#0f172a',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.04,
    shadowRadius: 18,
  },
  statusCard: {
    alignItems: 'flex-start',
    backgroundColor: '#ecfeff',
    borderColor: '#99f6e4',
    borderRadius: 18,
    borderWidth: 1,
    marginTop: 18,
    padding: 16,
  },
  sectionTitle: {
    color: '#0f172a',
    fontSize: 18,
    fontWeight: '700',
    marginBottom: 12,
  },
  input: {
    backgroundColor: '#f8fafc',
    borderColor: '#cbd5e1',
    borderRadius: 14,
    borderWidth: 1,
    color: '#0f172a',
    fontSize: 16,
    paddingHorizontal: 14,
    paddingVertical: 13,
  },
  helper: {
    color: '#475569',
    fontSize: 13,
    lineHeight: 20,
    marginTop: 10,
  },
  buttonRow: {
    flexDirection: 'row',
    gap: 12,
    marginTop: 18,
  },
  button: {
    alignItems: 'center',
    backgroundColor: '#0f766e',
    borderRadius: 16,
    flex: 1,
    paddingVertical: 15,
  },
  secondaryButton: {
    backgroundColor: '#e2e8f0',
  },
  buttonPressed: {
    opacity: 0.86,
  },
  buttonText: {
    color: '#f8fafc',
    fontSize: 15,
    fontWeight: '700',
  },
  secondaryButtonText: {
    color: '#0f172a',
    fontSize: 15,
    fontWeight: '700',
  },
  statusText: {
    color: '#0f172a',
    fontSize: 15,
    lineHeight: 22,
    marginTop: 4,
  },
  metricRow: {
    borderTopColor: '#e2e8f0',
    borderTopWidth: StyleSheet.hairlineWidth,
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingVertical: 9,
  },
  metricLabel: {
    color: '#334155',
    flex: 1,
    fontSize: 13,
    paddingRight: 16,
  },
  metricValue: {
    color: '#0f172a',
    fontSize: 13,
    fontWeight: '700',
  },
  summaryCard: {
    backgroundColor: '#f8fafc',
    borderColor: '#dbe4ee',
    borderRadius: 14,
    borderWidth: 1,
    marginTop: 12,
    padding: 12,
  },
  summaryTitle: {
    color: '#0f172a',
    fontSize: 14,
    fontWeight: '700',
    marginBottom: 8,
  },
});
