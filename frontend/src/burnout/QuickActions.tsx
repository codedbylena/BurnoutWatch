import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { Pill, FileText, Stethoscope, MessageCircle } from 'lucide-react-native';

const actions = [
  { icon: Pill, label: 'Medications', color: '#A78BFA' },
  { icon: FileText, label: 'Records', color: '#34D399' },
  { icon: Stethoscope, label: 'Book Visit', color: '#F472B6' },
  { icon: MessageCircle, label: 'Messages', color: '#FBBF24' },
];

export function QuickActions() {
  return (
    <View style={styles.grid}>
      {actions.map((action, index) => {
        const Icon = action.icon;

        return (
          <TouchableOpacity key={index} style={styles.actionItem}>
            
            <View
              style={[
                styles.iconWrapper,
                { backgroundColor: action.color },
              ]}
            >
              <Icon size={22} color="#FFFFFF" />
            </View>

            <Text style={styles.label}>{action.label}</Text>

          </TouchableOpacity>
        );
      })}
    </View>
  );
}

const styles = StyleSheet.create({
  grid: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  actionItem: {
    alignItems: 'center',
    gap: 6,
    flex: 1,
  },
  iconWrapper: {
    width: 48,
    height: 48,
    borderRadius: 24,
    justifyContent: 'center',
    alignItems: 'center',
  },
  label: {
    fontSize: 12,
    color: '#374151',
    textAlign: 'center',
  },
});