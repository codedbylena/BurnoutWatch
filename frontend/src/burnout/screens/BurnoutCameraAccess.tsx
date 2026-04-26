import { ArrowLeft, Camera } from 'lucide-react-native';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { colors, spacing, radius } from '../theme/burnoutTheme';

interface BurnoutCameraAccessProps {
  onComplete: () => void;
  onBack: () => void;
}

export function BurnoutCameraAccess({
  onComplete,
  onBack,
}: BurnoutCameraAccessProps) {
  const handleCameraPermission = (granted: boolean) => {
    if (granted) {
      // Later: request real camera permission here
    }

    onComplete();
  };

  return (
    <View style={styles.screen}>
      <View style={styles.container}>
        <TouchableOpacity onPress={onBack} style={styles.backButton}>
          <ArrowLeft size={20} color="#4B5563" />
          <Text style={styles.backText}>Back</Text>
        </TouchableOpacity>

        <View style={styles.content}>
          <View style={styles.iconCircle}>
            <Camera size={48} color="#6FAFB5" />
          </View>

          <Text style={styles.title}>Complete your check-in</Text>
          <Text style={styles.subtitle}>Quick face scan for burnout detection</Text>
          <Text style={styles.description}>
            This helps us better understand your well-being
          </Text>

          <View style={styles.buttonGroup}>
            <TouchableOpacity
              onPress={() => handleCameraPermission(true)}
              style={styles.primaryButton}
            >
              <Camera size={20} color="#FFFFFF" />
              <Text style={styles.primaryButtonText}>Allow Camera Access</Text>
            </TouchableOpacity>

            <TouchableOpacity
              onPress={() => handleCameraPermission(false)}
              style={styles.secondaryButton}
            >
              <Text style={styles.secondaryButtonText}>Skip for now</Text>
            </TouchableOpacity>
          </View>

          <Text style={styles.privacyText}>
            Your privacy matters. Images are processed securely and never stored.
          </Text>
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  screen: {
    flex: 1,
    backgroundColor: '#F9FAFB',
  },
  container: {
    flex: 1,
    paddingHorizontal: 24,
    paddingVertical: 32,
  },
  backButton: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginBottom: 32,
  },
  backText: {
    color: '#4B5563',
    fontSize: 16,
  },
  content: {
    alignItems: 'center',
    marginTop: 80,
  },
  iconCircle: {
    width: 96,
    height: 96,
    borderRadius: 48,
    backgroundColor: '#6FAFB520',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 24,
  },
  title: {
    color: '#111827',
    fontSize: 24,
    fontWeight: '600',
    marginBottom: 12,
    textAlign: 'center',
  },
  subtitle: {
    color: '#4B5563',
    fontSize: 16,
    marginBottom: 8,
    textAlign: 'center',
  },
  description: {
    color: '#6B7280',
    fontSize: 14,
    marginBottom: 32,
    textAlign: 'center',
  },
  buttonGroup: {
    width: '100%',
    gap: 12,
  },
  primaryButton: {
    backgroundColor: '#6FAFB5',
    paddingVertical: 16,
    borderRadius: 12,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
  },
  primaryButtonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '600',
  },
  secondaryButton: {
    paddingVertical: 16,
    borderRadius: 12,
    alignItems: 'center',
  },
  secondaryButtonText: {
    color: '#4B5563',
    fontSize: 16,
  },
  privacyText: {
    color: '#9CA3AF',
    fontSize: 12,
    textAlign: 'center',
    marginTop: 24,
    lineHeight: 18,
  },
});
