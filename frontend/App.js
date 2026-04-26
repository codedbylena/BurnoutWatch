import { useEffect, useMemo, useState } from 'react';
import { Platform, SafeAreaView, StatusBar, StyleSheet, View } from 'react-native';

const { createHealthIngestionService } = require('./src/metrics/healthIngestionService');
const { createMetricsApiClient } = require('./src/services/metricsApiClient');
const { createMetricsSyncService } = require('./src/services/metricsSyncService');
const { createWorkerIdentityStore } = require('./src/services/workerIdentityStore');
const { DeviceMetricOverviewScreen } = require('./src/screens/DeviceMetricOverviewScreen');
const { DeviceMetricReadinessScreen } = require('./src/screens/DeviceMetricReadinessScreen');
const { DeviceMetricManualScreen } = require('./src/screens/DeviceMetricManualScreen');
const {
  DeviceMetricManualEntryScreen,
  createDefaultManualForm,
} = require('./src/screens/DeviceMetricManualEntryScreen');
const {
  BurnoutCheckInPrepScreen,
  BurnoutCheckInScreen,
  BurnoutDashboardScreen,
  BurnoutLoginScreen,
  BurnoutStatusCheckScreen,
} = require('./src/screens/BurnoutFlowScreens');
const { buildManualSummary } = require('./src/metrics/manualEntry');

const workerIdentityStore = createWorkerIdentityStore();
const SCREEN_TABS = [
  { label: 'Dashboard', value: 'dashboard' },
  { label: 'Overview', value: 'overview' },
  { label: 'Readiness', value: 'readiness' },
  { label: 'Manual', value: 'manual' },
];

export default function App() {
  const [workerId, setWorkerId] = useState('');
  const [availability, setAvailability] = useState(null);
  const [permissions, setPermissions] = useState(null);
  const [statusMessage, setStatusMessage] = useState('Load a development build, set a worker ID, then sync.');
  const [syncState, setSyncState] = useState({ loading: true, syncing: false, requesting: false });
  const [manualSubmitState, setManualSubmitState] = useState({ submitting: false, error: null });
  const [canonicalSummaries, setCanonicalSummaries] = useState([]);
  const [activeTab, setActiveTab] = useState('overview');
  const [appRoute, setAppRoute] = useState('login');
  const [manualForm, setManualForm] = useState(createDefaultManualForm());

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
      setActiveTab('readiness');
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
      setActiveTab('overview');
    } catch (error) {
      setStatusMessage(`Sync failed: ${error.message}`);
    } finally {
      setSyncState((current) => ({ ...current, syncing: false }));
    }
  }

  async function handleSubmitManualEntry(manualInput) {
    const persistedWorkerId = await persistWorkerId(workerId);
    if (!persistedWorkerId) {
      setManualSubmitState({ submitting: false, error: 'Enter a worker ID before saving manual metrics.' });
      return;
    }

    setManualSubmitState({ submitting: true, error: null });

    try {
      const summary = buildManualSummary(
        persistedWorkerId,
        manualForm.localDate,
        manualInput,
        new Date().toISOString()
      );
      const ingestResponse = await metricsApiClient.ingestSummaries([summary]);
      const canonicalForDay = await metricsApiClient.getDailySummaries(
        persistedWorkerId,
        manualForm.localDate,
        manualForm.localDate
      );

      setCanonicalSummaries((current) => {
        const withoutUpdatedDay = current.filter((item) => item.local_date !== manualForm.localDate);
        return [...canonicalForDay, ...withoutUpdatedDay].sort((a, b) =>
          b.local_date.localeCompare(a.local_date)
        );
      });
      setStatusMessage(
        `Saved ${ingestResponse.ingested_count} manual summary for ${manualForm.localDate}.`
      );
      setManualForm(createDefaultManualForm());
      setAppRoute('deviceMetrics');
      setActiveTab('manual');
    } catch (error) {
      setManualSubmitState({ submitting: false, error: `Manual save failed: ${error.message}` });
      return;
    }

    setManualSubmitState({ submitting: false, error: null });
  }

  function handleTabChange(nextTab) {
    if (nextTab === 'dashboard') {
      setAppRoute('dashboard');
      return;
    }

    setAppRoute('deviceMetrics');
    setActiveTab(nextTab);
  }

  const sharedProps = {
    workerId,
    onWorkerIdChange: setWorkerId,
    onRequestPermissions: handleRequestPermissions,
    onSync: handleSync,
    syncState,
    metricsApiClient,
    statusMessage,
    availability,
    permissions,
    canonicalSummaries,
    manualSubmitState,
    tabs: SCREEN_TABS,
    activeTab: activeTab === 'manualEntry' ? 'manual' : activeTab,
    onTabChange: handleTabChange,
  };

  let screen;
  if (appRoute === 'login') {
    screen = <BurnoutLoginScreen onLogin={() => setAppRoute('dashboard')} />;
  } else if (appRoute === 'dashboard') {
    screen = (
      <BurnoutDashboardScreen
        onOpenDeviceSync={() => {
          setActiveTab('overview');
          setAppRoute('deviceMetrics');
        }}
        onStartCheckIn={() => setAppRoute('checkInPrep')}
      />
    );
  } else if (appRoute === 'checkInPrep') {
    screen = <BurnoutCheckInPrepScreen onComplete={() => setAppRoute('checkIn')} />;
  } else if (appRoute === 'checkIn') {
    screen = (
      <BurnoutCheckInScreen
        onBack={() => setAppRoute('dashboard')}
        onComplete={() => setAppRoute('statusCheck')}
      />
    );
  } else if (appRoute === 'statusCheck') {
    screen = <BurnoutStatusCheckScreen onComplete={() => setAppRoute('dashboard')} />;
  } else if (activeTab === 'overview') {
    screen = <DeviceMetricOverviewScreen {...sharedProps} />;
  } else if (activeTab === 'readiness') {
    screen = <DeviceMetricReadinessScreen {...sharedProps} />;
  } else if (activeTab === 'manualEntry') {
    screen = (
      <DeviceMetricManualEntryScreen
        {...sharedProps}
        form={manualForm}
        onChange={(patch) => setManualForm((current) => ({ ...current, ...patch }))}
        onCancel={() => setActiveTab('manual')}
        onSubmit={handleSubmitManualEntry}
        submitState={manualSubmitState}
      />
    );
  } else {
    screen = <DeviceMetricManualScreen {...sharedProps} onOpenManualEntry={() => setActiveTab('manualEntry')} />;
  }

  return (
    <SafeAreaView style={styles.safeArea}>
      <StatusBar barStyle="light-content" />
      <View style={styles.container}>{screen}</View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: '#5A9BA1',
  },
  container: {
    flex: 1,
  },
});
