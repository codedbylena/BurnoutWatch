import { Heart } from 'lucide-react-native';
import { useEffect, useRef, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  Animated,
  Easing,
} from 'react-native';
import { colors, spacing, radius } from '../theme/burnoutTheme';

interface BurnoutStatusCheckProps {
  onComplete: () => void;
}

export function BurnoutStatusCheck({ onComplete }: BurnoutStatusCheckProps) {
  const [progress, setProgress] = useState(0);

  const spin = useRef(new Animated.Value(0)).current;
  const pulse = useRef(new Animated.Value(1)).current;

  useEffect(() => {
    // Progress logic
    const interval = setInterval(() => {
      setProgress((prev) => {
        if (prev >= 100) {
          clearInterval(interval);
          setTimeout(onComplete, 300);
          return 100;
        }
        return prev + 2;
      });
    }, 30);

    // Spin animation
    Animated.loop(
      Animated.timing(spin, {
        toValue: 1,
        duration: 1200,
        easing: Easing.linear,
        useNativeDriver: true,
      })
    ).start();

    // Pulse animation
    Animated.loop(
      Animated.sequence([
        Animated.timing(pulse, {
          toValue: 1.2,
          duration: 600,
          useNativeDriver: true,
        }),
        Animated.timing(pulse, {
          toValue: 1,
          duration: 600,
          useNativeDriver: true,
        }),
      ])
    ).start();

    return () => clearInterval(interval);
  }, []);

  const spinInterpolate = spin.interpolate({
    inputRange: [0, 1],
    outputRange: ['0deg', '360deg'],
  });

  return (
    <View style={styles.screen}>
      <View style={styles.container}>

        {/* Loader */}
        <View style={styles.loaderWrapper}>

          {/* Spinning ring */}
          <Animated.View
            style={[
              styles.spinner,
              { transform: [{ rotate: spinInterpolate }] },
            ]}
          />

          {/* Glow pulse */}
          <Animated.View
            style={[
              styles.glow,
              { transform: [{ scale: pulse }] },
            ]}
          />

          {/* Heart */}
          <Heart size={30} color="#FFFFFF" fill="#FFFFFF" />
        </View>

        {/* Text */}
        <Text style={styles.title}>
          Getting things ready for you…
        </Text>

        {/* Optional progress display */}
        <Text style={styles.progress}>{progress}%</Text>

      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  screen: {
    flex: 1,
    backgroundColor: '#6FAFB5',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  container: {
    alignItems: 'center',
  },
  loaderWrapper: {
    width: 80,
    height: 80,
    marginBottom: 20,
    justifyContent: 'center',
    alignItems: 'center',
  },
  spinner: {
    position: 'absolute',
    width: 80,
    height: 80,
    borderRadius: 40,
    borderTopWidth: 3,
    borderRightWidth: 3,
    borderTopColor: '#FFFFFF',
    borderRightColor: 'transparent',
  },
  glow: {
    position: 'absolute',
    width: 50,
    height: 50,
    borderRadius: 25,
    backgroundColor: '#FFFFFF',
    opacity: 0.2,
  },
  title: {
    color: '#FFFFFF',
    fontSize: 20,
    textAlign: 'center',
  },
  progress: {
    marginTop: 10,
    color: '#FFFFFF',
    fontSize: 14,
    opacity: 0.8,
  },
});
