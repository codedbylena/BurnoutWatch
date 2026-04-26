import { View, Text, StyleSheet } from 'react-native';
import { Heart, Activity, Footprints, Flame } from 'lucide-react-native';

const healthMetrics = [
  { icon: Heart, label: 'Heart Rate', value: '72', unit: 'bpm', color: '#EF4444', bgColor: '#FEF2F2' },
  { icon: Activity, label: 'Blood Pressure', value: '120/80', unit: 'mmHg', color: '#6FAFB5', bgColor: '#F0F9FA' },
  { icon: Footprints, label: 'Steps', value: '8,432', unit: 'steps', color: '#10B981', bgColor: '#ECFDF5' },
  { icon: Flame, label: 'Calories', value: '1,842', unit: 'kcal', color: '#F59E0B', bgColor: '#FFFBEB' },
];

export function HealthDashboard() {
  return (
    <View style={styles.grid}>
      {healthMetrics.map((metric, index) => {
        const Icon = metric.icon;

        return (
          <View key={index} style={styles.card}>
            
            <View style={[styles.iconWrapper, { backgroundColor: metric.bgColor }]}>
              <Icon size={20} color={metric.color} />
            </View>

            <Text style={styles.label}>{metric.label}</Text>

            <View style={styles.valueRow}>
              <Text style={styles.value}>{metric.value}</Text>
              <Text style={styles.unit}>{metric.unit}</Text>
            </View>

          </View>
        );
      })}
    </View>
  );
}

const styles = StyleSheet.create({
  grid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 12,
  },
  card: {
    width: '48%', // 2 columns
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    padding: 12,
    borderWidth: 1,
    borderColor: '#F3F4F6',
  },
  iconWrapper: {
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 8,
  },
  label: {
    fontSize: 12,
    color: '#6B7280',
    marginBottom: 4,
  },
  valueRow: {
    flexDirection: 'row',
    alignItems: 'baseline',
    gap: 4,
  },
  value: {
    fontSize: 18,
    color: '#111827',
  },
  unit: {
    fontSize: 10,
    color: '#9CA3AF',
  },
});