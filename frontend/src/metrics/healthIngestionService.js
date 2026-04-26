let Platform = { OS: 'ios' };
try {
  ({ Platform } = require('react-native'));
} catch (error) {
  Platform = { OS: 'ios' };
}
const { HealthConnectProvider } = require('./providers/HealthConnectProvider');
const { HealthKitProvider } = require('./providers/HealthKitProvider');

function createHealthIngestionService({ iosAdapter, androidAdapter, platform } = {}) {
  const runtimePlatform = platform ?? Platform.OS;
  const provider =
    runtimePlatform === 'ios'
      ? new HealthKitProvider({ adapter: iosAdapter })
      : new HealthConnectProvider({ adapter: androidAdapter });

  return {
    requestPermissions() {
      return provider.requestPermissions();
    },
    getAvailability() {
      return provider.getAvailability();
    },
    fetchDailySummaries(workerId, startDate, endDate) {
      return provider.fetchDailySummaries(workerId, startDate, endDate);
    },
  };
}

module.exports = {
  createHealthIngestionService,
};
