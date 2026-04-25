import { Heart, CheckCircle, Circle } from 'lucide-react';

interface BurnoutDashboardProps {
  onStartCheckIn: () => void;
}

export function BurnoutDashboard({ onStartCheckIn }: BurnoutDashboardProps) {
  const currentStatus = 'Moderate'; // Can be: Low, Moderate, High
  const lastCheckIn = 'Today, 9:30 AM';

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'Low':
        return { bg: '#34D399', text: 'You\'re doing well' };
      case 'Moderate':
        return { bg: '#FBBF24', text: 'Pay attention to self-care' };
      case 'High':
        return { bg: '#EF4444', text: 'Consider reaching out for support' };
      default:
        return { bg: '#6FAFB5', text: '' };
    }
  };

  const statusInfo = getStatusColor(currentStatus);

  const checkInSteps = [
    { id: 1, label: 'Morning reflection', completed: true },
    { id: 2, label: 'Energy check', completed: true },
    { id: 3, label: 'Evening wind-down', completed: false },
  ];

  return (
    <div className="min-h-screen bg-gray-50 pb-24">
      <div className="max-w-md mx-auto">
        <header className="px-6 pt-12 pb-8">
          <h1 className="text-gray-700 text-3xl">Welcome back, Jon</h1>
          <p className="text-gray-500 mt-2"><span className="italic">Let's check in with how you're doing today</span></p>
        </header>

        <main className="px-6 space-y-8">
          {/* Current Status Card */}
          <section>
            <h2 className="text-gray-700 mb-4 italic">Current Status</h2>
            <div className="bg-white rounded-3xl p-6 shadow-sm border border-gray-100">
              <div className="flex items-center gap-4 mb-4">
                <div
                  className="w-16 h-16 rounded-full flex items-center justify-center"
                  style={{ backgroundColor: statusInfo.bg + '20' }}
                >
                  <Heart
                    className="w-8 h-8"
                    style={{ color: statusInfo.bg }}
                    fill={statusInfo.bg}
                  />
                </div>
                <div className="flex-1">
                  <div className="text-gray-500 text-sm mb-1">Burnout Level</div>
                  <div className="text-2xl" style={{ color: statusInfo.bg }}>{currentStatus}</div>
                </div>
              </div>
              <p className="text-gray-600 text-sm">{statusInfo.text}</p>
              <div className="mt-4 pt-4 border-t border-gray-100">
                <p className="text-gray-400 text-xs">Last check-in: {lastCheckIn}</p>
              </div>
            </div>
          </section>

          {/* Daily Check-in */}
          <section>
            <h2 className="text-gray-900 mb-4">Today's Check-in</h2>
            <div className="bg-white rounded-3xl p-6 shadow-sm border border-gray-100 space-y-4">
              {checkInSteps.map((step) => (
                <div key={step.id} className="flex items-center gap-3">
                  {step.completed ? (
                    <CheckCircle className="w-6 h-6 text-green-500 flex-shrink-0" />
                  ) : (
                    <Circle className="w-6 h-6 text-gray-300 flex-shrink-0" />
                  )}
                  <span className={`text-base ${step.completed ? 'text-gray-400 line-through' : 'text-gray-700'}`}>
                    {step.label}
                  </span>
                </div>
              ))}

              <button
                onClick={onStartCheckIn}
                className="w-full mt-4 text-white py-3.5 rounded-xl transition-all hover:opacity-90 flex items-center justify-center gap-2"
                style={{ backgroundColor: '#6FAFB5' }}
              >
                Complete Next Check-in
                <Heart className="w-4 h-4" />
              </button>
            </div>
          </section>

          {/* Quick Insights */}
          <section>
            <h2 className="text-gray-900 mb-4">This Week</h2>
            <div className="grid grid-cols-3 gap-3">
              <div className="bg-white rounded-2xl p-4 shadow-sm border border-gray-100 text-center">
                <div className="text-2xl mb-1" style={{ color: '#6FAFB5' }}>5</div>
                <div className="text-xs text-gray-500">Check-ins</div>
              </div>
              <div className="bg-white rounded-2xl p-4 shadow-sm border border-gray-100 text-center">
                <div className="text-2xl text-green-500 mb-1">3</div>
                <div className="text-xs text-gray-500">Good days</div>
              </div>
              <div className="bg-white rounded-2xl p-4 shadow-sm border border-gray-100 text-center">
                <div className="text-2xl text-gray-900 mb-1">68%</div>
                <div className="text-xs text-gray-500">Well-being</div>
              </div>
            </div>
          </section>
        </main>
      </div>
    </div>
  );
}
