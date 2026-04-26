import { useState } from 'react';

import { BurnoutLogin } from '../components/BurnoutLogin';
import { BurnoutStatusCheck } from '../components/BurnoutStatusCheck';
import { BurnoutDashboard } from '../components/BurnoutDashboard';
import { SupervisorDashboard } from '../components/SupervisorDashboard';
import { BurnoutCheckInPrep } from '../components/BurnoutCheckInPrep';
import { BurnoutQuestionnaire } from '../components/BurnoutQuestionnaire';
import { BurnoutCameraAccess } from '../components/BurnoutCameraAccess';

type AppState =
  | 'login'
  | 'statusCheck'
  | 'dashboard'
  | 'supervisorDashboard'
  | 'checkInPrep'
  | 'questionnaire'
  | 'cameraAccess';

export default function AppFlow() {
  const [appState, setAppState] = useState<AppState>('login');
  const [userRole, setUserRole] = useState('');

  if (appState === 'login') {
    return (
      <BurnoutLogin
        onLogin={(role: string) => {
          setUserRole(role);

          if (role === 'Supervisor') {
            setAppState('supervisorDashboard');
          } else {
            setAppState('statusCheck');
          }
        }}
      />
    );
  }

  if (appState === 'statusCheck') {
    return <BurnoutStatusCheck onComplete={() => setAppState('dashboard')} />;
  }

  if (appState === 'supervisorDashboard') {
    return <SupervisorDashboard onLogout={() => setAppState('login')} />;
  }

  if (appState === 'checkInPrep') {
    return <BurnoutCheckInPrep onComplete={() => setAppState('questionnaire')} />;
  }

  if (appState === 'questionnaire') {
    return (
      <BurnoutQuestionnaire
        onComplete={() => setAppState('cameraAccess')}
        onBack={() => setAppState('dashboard')}
      />
    );
  }

  if (appState === 'cameraAccess') {
    return (
      <BurnoutCameraAccess
        onComplete={() => setAppState('dashboard')}
        onBack={() => setAppState('questionnaire')}
      />
    );
  }

  return (
    <BurnoutDashboard
      onStartCheckIn={() => setAppState('checkInPrep')}
      onLogout={() => setAppState('login')}
    />
  );
}