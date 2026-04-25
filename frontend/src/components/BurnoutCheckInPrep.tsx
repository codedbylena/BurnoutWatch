import { Heart } from 'lucide-react';
import { useEffect } from 'react';

interface BurnoutCheckInPrepProps {
  onComplete: () => void;
}

export function BurnoutCheckInPrep({ onComplete }: BurnoutCheckInPrepProps) {
  useEffect(() => {
    const timer = setTimeout(() => {
      onComplete();
    }, 2000);

    return () => clearTimeout(timer);
  }, [onComplete]);

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center p-6">
      <div className="w-full max-w-md text-center">
        <div className="relative w-20 h-20 mx-auto mb-6 flex items-center justify-center">
          <div className="absolute w-20 h-20 rounded-full animate-spin" style={{ borderTop: '3px solid #6FAFB5', borderRight: '3px solid transparent' }}></div>
          <Heart className="w-8 h-8 animate-pulse" style={{ color: '#6FAFB5' }} fill="#6FAFB5" />
        </div>

        <h2 className="text-gray-700 text-2xl mb-2">Preparing your check-in</h2>
        <p className="text-gray-500">This will take less than a minute</p>
      </div>
    </div>
  );
}
