import { useState } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
} from 'react-native';
import { LogOut, Users, AlertCircle, Heart } from 'lucide-react-native';
import { colors, spacing, radius } from '../theme/burnoutTheme';

interface SupervisorDashboardProps {
  onLogout: () => void;
}

interface TeamMember {
  name: string;
  role: string;
  status: 'Low' | 'Moderate' | 'High';
  lastCheckIn: string;
  trend: string;
}

export function SupervisorDashboard({ onLogout }: SupervisorDashboardProps) {
  const [expanded, setExpanded] = useState<string | null>(null);

  const teamMembers: TeamMember[] = [
    { name: 'Sarah Chen', role: 'Nurse', status: 'Low', lastCheckIn: '2 hours ago', trend: '-3%' },
    { name: 'Jon Martinez', role: 'Doctor', status: 'Moderate', lastCheckIn: '1 day ago', trend: '+5%' },
    { name: 'Maria Rodriguez', role: 'Nurse', status: 'High', lastCheckIn: '3 hours ago', trend: '+12%' },
  ];

  const getColor = (status: string) => {
    if (status === 'Low') return '#5eae91';
    if (status === 'Moderate') return '#d4a574';
    return '#d47676';
  };

  return (
    <ScrollView style={styles.screen}>
      
      {/* Logout */}
      <TouchableOpacity onPress={onLogout} style={styles.logout}>
        <LogOut size={18} color="#9CA3AF" />
        <Text style={styles.logoutText}>Log Out</Text>
      </TouchableOpacity>

      {/* Header */}
      <View style={styles.header}>
        <Text style={styles.title}>Team Overview</Text>
        <Text style={styles.subtitle}>Support your team</Text>
      </View>

      {/* Summary */}
      <View style={styles.summaryRow}>
        <View style={styles.summaryCard}>
          <Heart size={18} color="#5eae91" />
          <Text style={styles.summaryNumber}>2</Text>
          <Text style={styles.summaryLabel}>Doing well</Text>
        </View>

        <View style={styles.summaryCard}>
          <Users size={18} color="#d4a574" />
          <Text style={styles.summaryNumber}>1</Text>
          <Text style={styles.summaryLabel}>Monitor</Text>
        </View>

        <View style={styles.summaryCard}>
          <AlertCircle size={18} color="#d47676" />
          <Text style={styles.summaryNumber}>1</Text>
          <Text style={styles.summaryLabel}>High</Text>
        </View>
      </View>

      {/* Team List */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Your Team</Text>

        {teamMembers.map((member) => {
          const isOpen = expanded === member.name;

          return (
            <TouchableOpacity
              key={member.name}
              onPress={() => setExpanded(isOpen ? null : member.name)}
              style={styles.card}
            >
              <View style={styles.row}>
                <View>
                  <Text style={styles.name}>{member.name}</Text>
                  <Text style={styles.role}>{member.role}</Text>
                </View>

                <Text style={{ color: getColor(member.status) }}>
                  {member.status}
                </Text>
              </View>

              <Text style={styles.meta}>
                Last check-in: {member.lastCheckIn}
              </Text>

              {isOpen && (
                <View style={styles.expand}>
                  <Text style={styles.expandText}>
                    Suggest checking in and encouraging rest.
                  </Text>
                </View>
              )}
            </TouchableOpacity>
          );
        })}
      </View>

    </ScrollView>
  );
}

const styles = StyleSheet.create({
  screen: {
    flex: 1,
    backgroundColor: '#F7F5F2',
    padding: 16,
  },
  logout: {
    position: 'absolute',
    top: 40,
    right: 20,
    flexDirection: 'row',
    gap: 6,
  },
  logoutText: {
    fontSize: 12,
    color: '#9CA3AF',
  },
  header: {
    marginTop: 80,
    marginBottom: 20,
  },
  title: {
    fontSize: 22,
    fontWeight: '600',
  },
  subtitle: {
    color: '#9CA3AF',
  },
  summaryRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 20,
  },
  summaryCard: {
    flex: 1,
    alignItems: 'center',
  },
  summaryNumber: {
    fontSize: 18,
    marginTop: 4,
  },
  summaryLabel: {
    fontSize: 10,
    color: '#9CA3AF',
  },
  section: {
    marginTop: 10,
  },
  sectionTitle: {
    marginBottom: 10,
    fontSize: 14,
    color: '#6B7280',
  },
  card: {
    backgroundColor: '#FFFFFF',
    padding: 14,
    borderRadius: 12,
    marginBottom: 10,
  },
  row: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  name: {
    fontWeight: '600',
  },
  role: {
    fontSize: 12,
    color: '#9CA3AF',
  },
  meta: {
    fontSize: 12,
    color: '#9CA3AF',
    marginTop: 6,
  },
  expand: {
    marginTop: 10,
    padding: 10,
    backgroundColor: '#F3F4F6',
    borderRadius: 8,
  },
  expandText: {
    fontSize: 12,
    color: '#374151',
  },
});
