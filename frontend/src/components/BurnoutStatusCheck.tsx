import { Heart } from 'lucide-react';
import { useEffect, useState } from 'react';

interface BurnoutStatusCheckProps {
  onComplete: () => void;
}

export function BurnoutStatusCheck({ onComplete }: BurnoutStatusCheckProps) {
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    const progressInterval = setInterval(() => {
      setProgress((prev) => {
        if (prev >= 100) {
          clearInterval(progressInterval);
          setTimeout(() => onComplete(), 300);
          return 100;
        }
        return prev + 2;
      });
    }, 30);

    return () => clearInterval(progressInterval);
  }, [onComplete]);

  return (
    <div className="min-h-screen flex items-center justify-center p-6" style={{ background: 'linear-gradient(to bottom right, #6FAFB5, #5A9BA1, #4A868C)' }}>
      <div className="w-full max-w-md">
        <div className="text-center">
          <div className="relative w-20 h-20 mx-auto mb-6 flex items-center justify-center">
            <div className="absolute w-20 h-20 bg-white/20 rounded-full animate-spin" style={{ borderTop: '3px solid white', borderRight: '3px solid transparent' }}></div>
            <Heart className="w-8 h-8 text-white animate-pulse" fill="white" />
          </div>

          <h2 className="text-white text-2xl">Checking burnout status</h2>
        </div>
      </div>
    </div>
  );
}
