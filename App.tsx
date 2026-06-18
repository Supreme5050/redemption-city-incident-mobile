import React, { useEffect, useMemo, useState } from 'react';
import { ActivityIndicator, Alert, StyleSheet, Text, View } from 'react-native';
import { DraftIncident, Incident } from './src/types/incident';
import { ScreenName } from './src/types/navigation';
import { LostFoundDraft, LostFoundRecord } from './src/types/lostFound';
import { AuthUser } from './src/types/auth';
import { loadAuthSession, signOutLocalAccount } from './src/services/authService';
import { HomeScreen } from './src/screens/CommandHomeScreen';
import { CommandMapScreen } from './src/screens/CommandMapScreen';
import {
  AuthWelcomeScreen,
  ForgotPasswordScreen,
  SignInScreen,
  SignUpScreen,
  SplashScreen
} from './src/screens/AuthScreens';
import {
  AlertsScreen,
  LostFoundScreen,
  MyReportsScreen,
  ProfileScreen,
  ReportDetailsScreen,
  ReportStepOneScreen,
  ReportStepTwoScreen,
  SubmitSuccessScreen
} from './src/screens/CommandMobileScreens';
import { createIncidentFromDraft, getIncidentById, loadMyIncidents } from './src/services/incidentService';
import { createLostFoundRecord, loadLostFoundRecords } from './src/services/lostFoundService';
import { Screen } from './src/components/Screen';
import { colors } from './src/theme/colors';

type AuthView = 'splash' | 'welcome' | 'sign-in' | 'sign-up' | 'forgot-password' | 'app';

function createEmptyDraft(overrides?: Partial<DraftIncident>): DraftIncident {
  return {
    title: '',
    type: null,
    severity: 'Medium',
    dateTime: new Date().toLocaleString(undefined, {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
      hour: 'numeric',
      minute: '2-digit'
    }),
    description: '',
    location: '',
    address: '',
    latitude: null,
    longitude: null,
    anonymous: false,
    reporterContact: '',
    attachments: [],
    ...overrides
  };
}

export default function App() {
  const [authView, setAuthView] = useState<AuthView>('splash');
  const [currentUser, setCurrentUser] = useState<AuthUser | null>(null);

  const [activeScreen, setActiveScreen] = useState<ScreenName>('home');
  const [draft, setDraft] = useState<DraftIncident>(createEmptyDraft());
  const [incidents, setIncidents] = useState<Incident[]>([]);
  const [lostFoundRecords, setLostFoundRecords] = useState<LostFoundRecord[]>([]);
  const [selectedIncident, setSelectedIncident] = useState<Incident | null>(null);
  const [lastSubmittedIncident, setLastSubmittedIncident] = useState<Incident | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const currentScreen = useMemo(() => activeScreen, [activeScreen]);

  useEffect(() => {
    let mounted = true;

    async function initApp() {
      const session = await loadAuthSession();

      await new Promise((resolve) => setTimeout(resolve, 1700));

      if (!mounted) return;

      if (session) {
        setCurrentUser(session);
        setAuthView('app');
        await bootAppData();
      } else {
        setAuthView('welcome');
      }
    }

    initApp();

    return () => {
      mounted = false;
    };
  }, []);

  async function bootAppData() {
    setIsLoading(true);

    try {
      const [storedIncidents, storedLostFoundRecords] = await Promise.all([
        loadMyIncidents(),
        loadLostFoundRecords()
      ]);

      setIncidents(storedIncidents);
      setLostFoundRecords(storedLostFoundRecords);
      setSelectedIncident(storedIncidents[0] ?? null);
    } catch (error) {
      const message = error instanceof Error ? error.message : 'Unable to load app data.';
      Alert.alert('Data loading failed', message);
      setIncidents([]);
      setLostFoundRecords([]);
      setSelectedIncident(null);
    } finally {
      setIsLoading(false);
    }
  }

  async function refreshAppData() {
    try {
      const [storedIncidents, storedLostFoundRecords] = await Promise.all([
        loadMyIncidents(),
        loadLostFoundRecords()
      ]);

      setIncidents(storedIncidents);
      setLostFoundRecords(storedLostFoundRecords);

      return storedIncidents;
    } catch (error) {
      const message = error instanceof Error ? error.message : 'Unable to refresh reports.';
      Alert.alert('Refresh failed', message);
      return incidents;
    }
  }

  async function handleAuthenticated(user: AuthUser) {
    setCurrentUser(user);
    setAuthView('app');
    await bootAppData();
  }

  function navigate(screen: ScreenName) {
    setActiveScreen(screen);
  }

  function startReport(options?: Partial<DraftIncident>) {
    setDraft(createEmptyDraft(options));
    setActiveScreen('report-step-one');
  }

  async function openIncident(incident: Incident) {
    try {
      const freshIncident = await getIncidentById(incident.id);
      const targetIncident = freshIncident ?? incident;

      setSelectedIncident(targetIncident);
      setIncidents((oldIncidents) =>
        oldIncidents.map((item) => (item.id === targetIncident.id ? targetIncident : item))
      );
      setActiveScreen('report-details');
    } catch (error) {
      setSelectedIncident(incident);
      setActiveScreen('report-details');
    }
  }

  async function refreshSelectedIncident() {
    if (!selectedIncident) {
      return null;
    }

    try {
      const freshIncident = await getIncidentById(selectedIncident.id);

      if (!freshIncident) {
        return selectedIncident;
      }

      setSelectedIncident(freshIncident);
      setIncidents((oldIncidents) =>
        oldIncidents.map((item) => (item.id === freshIncident.id ? freshIncident : item))
      );

      return freshIncident;
    } catch (error) {
      const message = error instanceof Error ? error.message : 'Unable to refresh this report.';
      Alert.alert('Refresh failed', message);
      return selectedIncident;
    }
  }

  function validateIncidentDraft() {
    if (!draft.type) {
      Alert.alert('Select incident type', 'Please choose the type of incident you are reporting.');
      return false;
    }

    if (!draft.description.trim() || draft.description.trim().length < 10) {
      Alert.alert('Description required', 'Please describe what happened clearly before submitting.');
      return false;
    }

    if (!draft.location.trim() || !draft.latitude || !draft.longitude) {
      Alert.alert('Location required', 'Please use current location or drop a pin on the map.');
      return false;
    }

    if (!draft.anonymous && !draft.reporterContact.trim()) {
      Alert.alert('Contact required', 'Please enter your phone number or email, or turn on anonymous reporting.');
      return false;
    }

    return true;
  }

  async function submitIncident() {
    if (isSubmitting) return;

    if (!validateIncidentDraft()) return;

    setIsSubmitting(true);

    try {
      const newIncident = await createIncidentFromDraft(draft);
      const updatedIncidents = await loadMyIncidents();

      setIncidents(updatedIncidents);
      setSelectedIncident(newIncident);
      setLastSubmittedIncident(newIncident);
      setDraft(createEmptyDraft());
      setActiveScreen('submit-success');
    } catch (error) {
      const message = error instanceof Error ? error.message : 'Unable to submit incident report.';
      Alert.alert('Submit failed', message);
    } finally {
      setIsSubmitting(false);
    }
  }

  async function submitLostFound(draftPayload: LostFoundDraft) {
    try {
      const record = await createLostFoundRecord(draftPayload);
      const updatedRecords = await loadLostFoundRecords();

      setLostFoundRecords(updatedRecords);

      return record;
    } catch (error) {
      throw error;
    }
  }

  async function handleSignOut() {
    try {
      await signOutLocalAccount();
      setCurrentUser(null);
      setIncidents([]);
      setLostFoundRecords([]);
      setSelectedIncident(null);
      setLastSubmittedIncident(null);
      setDraft(createEmptyDraft());
      setActiveScreen('home');
      setAuthView('welcome');
    } catch (error) {
      const message = error instanceof Error ? error.message : 'Unable to sign out right now.';
      Alert.alert('Sign out failed', message);
    }
  }

  if (authView === 'splash') {
    return <SplashScreen />;
  }

  if (authView === 'welcome') {
    return (
      <AuthWelcomeScreen
        onGoToSignIn={() => setAuthView('sign-in')}
        onGoToSignUp={() => setAuthView('sign-up')}
      />
    );
  }

  if (authView === 'sign-in') {
    return (
      <SignInScreen
        onAuthenticated={handleAuthenticated}
        onGoToSignUp={() => setAuthView('sign-up')}
        onGoToForgotPassword={() => setAuthView('forgot-password')}
        onBack={() => setAuthView('welcome')}
      />
    );
  }

  if (authView === 'sign-up') {
    return (
      <SignUpScreen
        onAuthenticated={handleAuthenticated}
        onGoToSignIn={() => setAuthView('sign-in')}
        onBack={() => setAuthView('welcome')}
      />
    );
  }

  if (authView === 'forgot-password') {
    return (
      <ForgotPasswordScreen
        onBack={() => setAuthView('sign-in')}
        onGoToSignIn={() => setAuthView('sign-in')}
      />
    );
  }

  if (isLoading) {
    return (
      <Screen>
        <View style={styles.loadingWrap}>
          <ActivityIndicator size="large" color={colors.primary} />
          <Text style={styles.loadingText}>
            Opening Redemption City Safety Command{currentUser ? ` for ${currentUser.fullName}` : ''}...
          </Text>
        </View>
      </Screen>
    );
  }

  if (currentScreen === 'report-step-one') {
    return <ReportStepOneScreen draft={draft} setDraft={setDraft} onNavigate={navigate} />;
  }

  if (currentScreen === 'report-step-two') {
    return (
      <ReportStepTwoScreen
        draft={draft}
        setDraft={setDraft}
        onNavigate={navigate}
        onSubmit={submitIncident}
        isSubmitting={isSubmitting}
      />
    );
  }

  if (currentScreen === 'submit-success' && lastSubmittedIncident) {
    return (
      <SubmitSuccessScreen
        incident={lastSubmittedIncident}
        onNavigate={navigate}
        onOpenIncident={openIncident}
      />
    );
  }

  if (currentScreen === 'my-reports') {
    return (
      <MyReportsScreen
        incidents={incidents}
        lostFoundRecords={lostFoundRecords}
        onNavigate={navigate}
        onOpenIncident={openIncident}
        onRefresh={refreshAppData}
      />
    );
  }

  if (currentScreen === 'report-details' && selectedIncident) {
    return (
      <ReportDetailsScreen
        incident={selectedIncident}
        onNavigate={navigate}
        onRefreshIncident={refreshSelectedIncident}
      />
    );
  }

  if (currentScreen === 'alerts') {
    return <AlertsScreen incidents={incidents} onNavigate={navigate} onOpenIncident={openIncident} />;
  }

  if (currentScreen === 'map') {
    return (
      <CommandMapScreen
        incidents={incidents}
        onNavigate={navigate}
        onOpenIncident={openIncident}
      />
    );
  }

  if (currentScreen === 'lost-found') {
    return <LostFoundScreen onNavigate={navigate} onSubmitLostFound={submitLostFound} />;
  }

  if (currentScreen === 'profile') {
    return <ProfileScreen currentUser={currentUser} onNavigate={navigate} onSignOut={handleSignOut} />;
  }

  return (
    <HomeScreen
      incidents={incidents}
      onNavigate={navigate}
      onStartReport={startReport}
      onOpenIncident={openIncident}
    />
  );
}

const styles = StyleSheet.create({
  loadingWrap: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 28,
    gap: 16
  },
  loadingText: {
    color: colors.textMuted,
    fontSize: 15,
    fontWeight: '800',
    textAlign: 'center'
  }
});