import { Heart, ArrowLeft, Camera } from 'lucide-react';
import { useState } from 'react';

interface BurnoutCheckInProps {
  onComplete: () => void;
  onBack: () => void;
}

export function BurnoutCheckIn({ onComplete, onBack }: BurnoutCheckInProps) {
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [answers, setAnswers] = useState<number[]>([]);
  const [showCameraRequest, setShowCameraRequest] = useState(false);

  const questions = [
    {
      id: 1,
      text: "How would you rate your energy level today?",
      subtitle: "Be honest with yourself"
    },
    {
      id: 2,
      text: "How much stress are you feeling?",
      subtitle: "There's no right or wrong answer"
    },
    {
      id: 3,
      text: "How connected do you feel to your work?",
      subtitle: "Your feelings matter"
    }
  ];

  const options = [
    { value: 1, label: "Very Low", emoji: "😔" },
    { value: 2, label: "Low", emoji: "😕" },
    { value: 3, label: "Moderate", emoji: "😐" },
    { value: 4, label: "Good", emoji: "🙂" },
    { value: 5, label: "Great", emoji: "😊" }
  ];

  const handleAnswer = (value: number) => {
    const newAnswers = [...answers, value];
    setAnswers(newAnswers);

    if (currentQuestion < questions.length - 1) {
      setTimeout(() => {
        setCurrentQuestion(currentQuestion + 1);
      }, 300);
    } else {
      setTimeout(() => {
        setShowCameraRequest(true);
      }, 300);
    }
  };

  const handleCameraPermission = (granted: boolean) => {
    if (granted) {
      // In a real app, you would request camera permission here
      // navigator.mediaDevices.getUserMedia({ video: true })
    }
    onComplete();
  };

  if (showCameraRequest) {
    return (
      <div className="min-h-screen bg-gray-50">
        <div className="max-w-md mx-auto px-6 py-8">
          <button
            onClick={() => setShowCameraRequest(false)}
            className="flex items-center gap-2 text-gray-600 mb-8 hover:text-gray-900 transition-colors"
          >
            <ArrowLeft className="w-5 h-5" />
            <span>Back</span>
          </button>

          <div className="text-center mt-20">
            <div className="w-24 h-24 rounded-full mx-auto mb-6 flex items-center justify-center" style={{ backgroundColor: '#6FAFB5' + '20' }}>
              <Camera className="w-12 h-12" style={{ color: '#6FAFB5' }} />
            </div>

            <h2 className="text-gray-900 text-2xl mb-3">One more thing...</h2>
            <p className="text-gray-600 mb-2">Complete your check-in with a quick face scan</p>
            <p className="text-gray-500 text-sm mb-8">This helps us better understand your well-being</p>

            <div className="space-y-3">
              <button
                onClick={() => handleCameraPermission(true)}
                className="w-full text-white py-4 rounded-xl transition-all hover:opacity-90 flex items-center justify-center gap-2"
                style={{ backgroundColor: '#6FAFB5' }}
              >
                <Camera className="w-5 h-5" />
                Allow Camera Access
              </button>

              <button
                onClick={() => handleCameraPermission(false)}
                className="w-full text-gray-600 py-4 rounded-xl transition-all hover:bg-gray-100"
              >
                Skip for now
              </button>
            </div>

            <p className="text-gray-400 text-xs mt-6">
              Your privacy matters. Images are processed securely and never stored.
            </p>
          </div>
        </div>
      </div>
    );
  }

  const question = questions[currentQuestion];

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-md mx-auto px-6 py-8">
        <button
          onClick={onBack}
          className="flex items-center gap-2 text-gray-600 mb-8 hover:text-gray-900 transition-colors"
        >
          <ArrowLeft className="w-5 h-5" />
          <span>Back</span>
        </button>

        <div className="mb-8">
          <div className="flex gap-2 mb-6">
            {questions.map((_, index) => (
              <div
                key={index}
                className="h-1 flex-1 rounded-full transition-all"
                style={{
                  backgroundColor: index <= currentQuestion ? '#6FAFB5' : '#E5E7EB'
                }}
              ></div>
            ))}
          </div>

          <div className="text-center mb-8">
            <Heart className="w-12 h-12 mx-auto mb-4" style={{ color: '#6FAFB5' }} fill="#6FAFB5" />
            <h2 className="text-gray-900 text-2xl mb-2">{question.text}</h2>
            <p className="text-gray-500 text-sm">{question.subtitle}</p>
          </div>
        </div>

        <div className="space-y-3">
          {options.map((option) => (
            <button
              key={option.value}
              onClick={() => handleAnswer(option.value)}
              className="w-full bg-white rounded-2xl p-5 shadow-sm border border-gray-200 hover:border-gray-300 transition-all hover:shadow-md flex items-center gap-4"
            >
              <span className="text-3xl">{option.emoji}</span>
              <span className="text-gray-700 text-lg flex-1 text-left">{option.label}</span>
            </button>
          ))}
        </div>

        <p className="text-center text-gray-400 text-sm mt-8">
          Question {currentQuestion + 1} of {questions.length}
        </p>
      </div>
    </div>
  );
}
