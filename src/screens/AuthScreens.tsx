import React, { useState } from 'react';
import {
  ActivityIndicator,
  Alert,
  KeyboardAvoidingView,
  Platform,
  SafeAreaView,
  ScrollView,
  StatusBar,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { AuthUser, UserRole } from '../types/auth';
import { resetLocalPassword, signInLocalAccount, signUpLocalAccount } from '../services/authService';
import { AppBrandLogo } from '../components/AppBrandLogo';

const STATUS_BAR_HEIGHT = Platform.OS === 'android' ? StatusBar.currentHeight ?? 28 : 0;

const C = {
  bg: '#020B18',
  card: '#071426',
  card2: '#0B1B31',
  border: 'rgba(255,255,255,0.1)',
  borderStrong: 'rgba(255,255,255,0.18)',
  text: '#F7FAFC',
  muted: '#94A7BD',
  muted2: '#6B7F96',
  blue: '#2F80FF',
  green: '#23D160',
  red: '#FF4D4F',
  purple: '#A855F7',
  white: '#FFFFFF'
};

const roles: UserRole[] = ['Reporter', 'Resident', 'Visitor', 'Field Reporter'];

interface AuthProps {
  onAuthenticated: (user: AuthUser) => void;
}

export function SplashScreen() {
  return (
    <SafeAreaView style={styles.screen}>
      <StatusBar backgroundColor={C.bg} barStyle="light-content" />

      <View style={styles.splashWrap}>
        <View style={styles.circleTopRight} />
        <View style={styles.circleBottomLeft} />

        <View style={styles.splashCenter}>
          <AppBrandLogo size="splash" />

          <Text style={styles.splashTitle}>Redemption City Safety</Text>

          <View style={styles.loadingRing}>
            <ActivityIndicator color={C.blue} size="large" />
          </View>
        </View>
      </View>
    </SafeAreaView>
  );
}

export function AuthWelcomeScreen({
  onGoToSignIn,
  onGoToSignUp
}: {
  onGoToSignIn: () => void;
  onGoToSignUp: () => void;
}) {
  return (
    <SafeAreaView style={styles.screen}>
      <StatusBar backgroundColor={C.bg} barStyle="light-content" />

      <View style={styles.authWelcomeWrap}>
        <View style={styles.circleTopRight} />
        <View style={styles.circleBottomLeft} />

        <View style={styles.welcomeTop}>
          <AppBrandLogo size="large" />

          <View style={styles.commandChip}>
            <View style={styles.onlineDot} />
            <Text style={styles.commandChipText}>RCC SAFETY COMMAND</Text>
          </View>

          <Text style={styles.welcomeTitle}>Redemption City Safety</Text>

          <Text style={styles.welcomeSubtitle}>
            Report incidents, pin exact locations, track response progress, and receive verified safety alerts.
          </Text>
        </View>

        <View style={styles.authActions}>
          <TouchableOpacity activeOpacity={0.9} style={styles.primaryButton} onPress={onGoToSignIn}>
            <Ionicons name="log-in-outline" size={26} color={C.white} />
            <Text style={styles.primaryButtonText}>Sign In</Text>
          </TouchableOpacity>

          <TouchableOpacity activeOpacity={0.9} style={styles.secondaryButton} onPress={onGoToSignUp}>
            <Ionicons name="person-add-outline" size={25} color={C.blue} />
            <Text style={styles.secondaryButtonText}>Create Account</Text>
          </TouchableOpacity>

          <Text style={styles.footerNote}>
            Reports go to Admin Control Desk first. Verified admins route them to the appropriate official response body.
          </Text>
        </View>
      </View>
    </SafeAreaView>
  );
}

export function SignInScreen({
  onAuthenticated,
  onGoToSignUp,
  onGoToForgotPassword,
  onBack
}: AuthProps & {
  onGoToSignUp: () => void;
  onGoToForgotPassword: () => void;
  onBack: () => void;
}) {
  const [identifier, setIdentifier] = useState('');
  const [password, setPassword] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  async function handleSignIn() {
    if (!identifier.trim()) {
      Alert.alert('Login required', 'Enter your email or phone number.');
      return;
    }

    if (!password.trim()) {
      Alert.alert('Password required', 'Enter your password.');
      return;
    }

    setIsSubmitting(true);

    try {
      const user = await signInLocalAccount({ identifier, password });
      onAuthenticated(user);
    } catch (error) {
      Alert.alert('Sign in failed', error instanceof Error ? error.message : 'Unable to sign in.');
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <AuthFormShell title="Sign In" subtitle="Access your safety command account." onBack={onBack}>
      <Text style={styles.label}>Email or Phone</Text>
      <TextInput
        value={identifier}
        onChangeText={setIdentifier}
        placeholder="example@email.com or phone number"
        placeholderTextColor={C.muted2}
        autoCapitalize="none"
        style={styles.input}
      />

      <Text style={styles.label}>Password</Text>
      <TextInput
        value={password}
        onChangeText={setPassword}
        placeholder="Enter password"
        placeholderTextColor={C.muted2}
        secureTextEntry
        style={styles.input}
      />

      <TouchableOpacity activeOpacity={0.85} style={styles.forgotButton} onPress={onGoToForgotPassword}>
        <Text style={styles.forgotText}>Forgot password?</Text>
      </TouchableOpacity>

      <TouchableOpacity activeOpacity={0.9} style={styles.primaryButton} onPress={handleSignIn} disabled={isSubmitting}>
        {isSubmitting ? <ActivityIndicator color={C.white} /> : <Ionicons name="log-in-outline" size={22} color={C.white} />}
        <Text style={styles.primaryButtonText}>{isSubmitting ? 'Signing In...' : 'Sign In'}</Text>
      </TouchableOpacity>

      <TouchableOpacity activeOpacity={0.85} style={styles.authSwitchButton} onPress={onGoToSignUp}>
        <Text style={styles.authSwitchText}>
          No account yet? <Text style={styles.authSwitchLink}>Create account</Text>
        </Text>
      </TouchableOpacity>
    </AuthFormShell>
  );
}

export function SignUpScreen({
  onAuthenticated,
  onGoToSignIn,
  onBack
}: AuthProps & {
  onGoToSignIn: () => void;
  onBack: () => void;
}) {
  const [fullName, setFullName] = useState('');
  const [phone, setPhone] = useState('');
  const [email, setEmail] = useState('');
  const [role, setRole] = useState<UserRole>('Reporter');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  async function handleSignUp() {
    if (!fullName.trim()) {
      Alert.alert('Full name required', 'Enter your full name.');
      return;
    }

    if (!phone.trim()) {
      Alert.alert('Phone required', 'Enter your phone number.');
      return;
    }

    if (!email.trim()) {
      Alert.alert('Email required', 'Enter your email address.');
      return;
    }

    if (password.length < 6) {
      Alert.alert('Password too short', 'Use at least 6 characters.');
      return;
    }

    if (password !== confirmPassword) {
      Alert.alert('Password mismatch', 'Password and confirm password must match.');
      return;
    }

    setIsSubmitting(true);

    try {
      const user = await signUpLocalAccount({
        fullName,
        phone,
        email,
        password,
        role
      });

      onAuthenticated(user);
    } catch (error) {
      Alert.alert('Account creation failed', error instanceof Error ? error.message : 'Unable to create account.');
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <AuthFormShell title="Create Account" subtitle="Create a reporter profile for safe incident submission." onBack={onBack}>
      <Text style={styles.label}>Full Name</Text>
      <TextInput value={fullName} onChangeText={setFullName} placeholder="Your full name" placeholderTextColor={C.muted2} style={styles.input} />

      <Text style={styles.label}>Phone Number</Text>
      <TextInput value={phone} onChangeText={setPhone} placeholder="Phone number" placeholderTextColor={C.muted2} keyboardType="phone-pad" style={styles.input} />

      <Text style={styles.label}>Email Address</Text>
      <TextInput value={email} onChangeText={setEmail} placeholder="Email address" placeholderTextColor={C.muted2} keyboardType="email-address" autoCapitalize="none" style={styles.input} />

      <Text style={styles.label}>User Type</Text>
      <View style={styles.roleWrap}>
        {roles.map((item) => (
          <TouchableOpacity key={item} activeOpacity={0.85} style={[styles.roleChip, role === item && styles.roleChipActive]} onPress={() => setRole(item)}>
            <Text style={[styles.roleChipText, role === item && styles.roleChipTextActive]}>{item}</Text>
          </TouchableOpacity>
        ))}
      </View>

      <Text style={styles.label}>Password</Text>
      <TextInput value={password} onChangeText={setPassword} placeholder="Create password" placeholderTextColor={C.muted2} secureTextEntry style={styles.input} />

      <Text style={styles.label}>Confirm Password</Text>
      <TextInput value={confirmPassword} onChangeText={setConfirmPassword} placeholder="Confirm password" placeholderTextColor={C.muted2} secureTextEntry style={styles.input} />

      <TouchableOpacity activeOpacity={0.9} style={styles.primaryButton} onPress={handleSignUp} disabled={isSubmitting}>
        {isSubmitting ? <ActivityIndicator color={C.white} /> : <Ionicons name="person-add-outline" size={22} color={C.white} />}
        <Text style={styles.primaryButtonText}>{isSubmitting ? 'Creating Account...' : 'Create Account'}</Text>
      </TouchableOpacity>

      <TouchableOpacity activeOpacity={0.85} style={styles.authSwitchButton} onPress={onGoToSignIn}>
        <Text style={styles.authSwitchText}>
          Already have an account? <Text style={styles.authSwitchLink}>Sign in</Text>
        </Text>
      </TouchableOpacity>
    </AuthFormShell>
  );
}

export function ForgotPasswordScreen({
  onBack,
  onGoToSignIn
}: {
  onBack: () => void;
  onGoToSignIn: () => void;
}) {
  const [identifier, setIdentifier] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  async function handleResetPassword() {
    if (!identifier.trim()) {
      Alert.alert('Account required', 'Enter your registered email or phone number.');
      return;
    }

    if (newPassword.length < 6) {
      Alert.alert('Password too short', 'Use at least 6 characters.');
      return;
    }

    if (newPassword !== confirmPassword) {
      Alert.alert('Password mismatch', 'New password and confirm password must match.');
      return;
    }

    setIsSubmitting(true);

    try {
      await resetLocalPassword({ identifier, newPassword });

      Alert.alert('Password updated', 'Your password has been reset. Please sign in with your new password.', [
        {
          text: 'Sign In',
          onPress: onGoToSignIn
        }
      ]);
    } catch (error) {
      Alert.alert('Reset failed', error instanceof Error ? error.message : 'Unable to reset password.');
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <AuthFormShell title="Reset Password" subtitle="Recover your account using your registered email or phone number." onBack={onBack}>
      <Text style={styles.label}>Registered Email or Phone</Text>
      <TextInput
        value={identifier}
        onChangeText={setIdentifier}
        placeholder="Email or phone number"
        placeholderTextColor={C.muted2}
        autoCapitalize="none"
        style={styles.input}
      />

      <Text style={styles.label}>New Password</Text>
      <TextInput
        value={newPassword}
        onChangeText={setNewPassword}
        placeholder="Enter new password"
        placeholderTextColor={C.muted2}
        secureTextEntry
        style={styles.input}
      />

      <Text style={styles.label}>Confirm New Password</Text>
      <TextInput
        value={confirmPassword}
        onChangeText={setConfirmPassword}
        placeholder="Confirm new password"
        placeholderTextColor={C.muted2}
        secureTextEntry
        style={styles.input}
      />

      <TouchableOpacity activeOpacity={0.9} style={styles.primaryButton} onPress={handleResetPassword} disabled={isSubmitting}>
        {isSubmitting ? <ActivityIndicator color={C.white} /> : <Ionicons name="key-outline" size={22} color={C.white} />}
        <Text style={styles.primaryButtonText}>{isSubmitting ? 'Updating...' : 'Reset Password'}</Text>
      </TouchableOpacity>

      <TouchableOpacity activeOpacity={0.85} style={styles.authSwitchButton} onPress={onGoToSignIn}>
        <Text style={styles.authSwitchText}>
          Remembered your password? <Text style={styles.authSwitchLink}>Sign in</Text>
        </Text>
      </TouchableOpacity>
    </AuthFormShell>
  );
}

function AuthFormShell({
  title,
  subtitle,
  onBack,
  children
}: {
  title: string;
  subtitle: string;
  onBack: () => void;
  children: React.ReactNode;
}) {
  return (
    <SafeAreaView style={styles.screen}>
      <StatusBar backgroundColor={C.bg} barStyle="light-content" />

      <KeyboardAvoidingView style={styles.keyboardWrap} behavior={Platform.OS === 'ios' ? 'padding' : undefined}>
        <ScrollView contentContainerStyle={styles.formContent} showsVerticalScrollIndicator={false}>
          <View style={styles.formTop}>
            <TouchableOpacity activeOpacity={0.85} style={styles.backButton} onPress={onBack}>
              <Ionicons name="arrow-back" size={23} color={C.white} />
            </TouchableOpacity>

            <AppBrandLogo size="small" />
          </View>

          <View style={styles.formBrandCenter}>
            <AppBrandLogo size="medium" />

            <View style={styles.commandChipSmall}>
              <View style={styles.onlineDot} />
              <Text style={styles.commandChipText}>RCC SAFETY COMMAND</Text>
            </View>
          </View>

          <Text style={styles.formTitle}>{title}</Text>
          <Text style={styles.formSubtitle}>{subtitle}</Text>

          <View style={styles.formCard}>{children}</View>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  screen: {
    flex: 1,
    backgroundColor: C.bg
  },
  splashWrap: {
    flex: 1,
    backgroundColor: C.bg,
    overflow: 'hidden'
  },
  splashCenter: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingBottom: 40
  },
  circleTopRight: {
    position: 'absolute',
    width: 270,
    height: 270,
    borderRadius: 135,
    right: -110,
    top: 54,
    backgroundColor: 'rgba(47,128,255,0.12)'
  },
  circleBottomLeft: {
    position: 'absolute',
    width: 260,
    height: 260,
    borderRadius: 130,
    left: -128,
    bottom: -62,
    backgroundColor: 'rgba(35,209,96,0.10)'
  },
  splashTitle: {
    color: C.text,
    fontSize: 33,
    fontWeight: '900',
    textAlign: 'center',
    marginTop: 38,
    letterSpacing: -0.8
  },
  loadingRing: {
    marginTop: 44
  },
  authWelcomeWrap: {
    flex: 1,
    paddingTop: STATUS_BAR_HEIGHT + 74,
    paddingHorizontal: 26,
    paddingBottom: 34,
    backgroundColor: C.bg,
    overflow: 'hidden',
    justifyContent: 'space-between'
  },
  welcomeTop: {
    alignItems: 'center'
  },
  commandChip: {
    borderRadius: 999,
    backgroundColor: 'rgba(35,209,96,0.12)',
    borderWidth: 1,
    borderColor: 'rgba(35,209,96,0.30)',
    paddingHorizontal: 16,
    paddingVertical: 9,
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 38,
    marginBottom: 28
  },
  commandChipSmall: {
    borderRadius: 999,
    backgroundColor: 'rgba(35,209,96,0.12)',
    borderWidth: 1,
    borderColor: 'rgba(35,209,96,0.30)',
    paddingHorizontal: 12,
    paddingVertical: 7,
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 14
  },
  onlineDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: C.green
  },
  commandChipText: {
    color: C.green,
    fontSize: 12,
    fontWeight: '900',
    letterSpacing: 1.4,
    marginLeft: 9
  },
  welcomeTitle: {
    color: C.text,
    fontSize: 36,
    fontWeight: '900',
    textAlign: 'center',
    letterSpacing: -1
  },
  welcomeSubtitle: {
    color: C.muted,
    fontSize: 17,
    lineHeight: 27,
    textAlign: 'center',
    marginTop: 22
  },
  authActions: {
    gap: 16
  },
  primaryButton: {
    minHeight: 68,
    borderRadius: 18,
    backgroundColor: C.blue,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 12
  },
  primaryButtonText: {
    color: C.white,
    fontSize: 18,
    fontWeight: '900'
  },
  secondaryButton: {
    minHeight: 68,
    borderRadius: 18,
    backgroundColor: 'rgba(2,11,24,0.25)',
    borderWidth: 1.5,
    borderColor: C.blue,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 12
  },
  secondaryButtonText: {
    color: C.blue,
    fontSize: 18,
    fontWeight: '900'
  },
  footerNote: {
    color: C.muted,
    fontSize: 13.5,
    lineHeight: 21,
    textAlign: 'center',
    marginTop: 20
  },
  keyboardWrap: {
    flex: 1
  },
  formContent: {
    paddingTop: STATUS_BAR_HEIGHT + 16,
    paddingHorizontal: 20,
    paddingBottom: 36
  },
  formTop: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 18
  },
  backButton: {
    width: 48,
    height: 48,
    borderRadius: 16,
    backgroundColor: C.card,
    borderWidth: 1,
    borderColor: C.border,
    alignItems: 'center',
    justifyContent: 'center'
  },
  formBrandCenter: {
    alignItems: 'center',
    marginBottom: 26
  },
  formTitle: {
    color: C.text,
    fontSize: 31,
    fontWeight: '900',
    letterSpacing: -0.8
  },
  formSubtitle: {
    color: C.muted,
    fontSize: 15,
    lineHeight: 23,
    marginTop: 8,
    marginBottom: 24
  },
  formCard: {
    borderRadius: 22,
    backgroundColor: C.card,
    borderWidth: 1,
    borderColor: C.border,
    padding: 16
  },
  label: {
    color: C.text,
    fontSize: 13.5,
    fontWeight: '900',
    marginBottom: 8
  },
  input: {
    minHeight: 56,
    borderRadius: 15,
    backgroundColor: C.card2,
    borderWidth: 1,
    borderColor: C.border,
    color: C.text,
    fontSize: 15,
    paddingHorizontal: 14,
    marginBottom: 15
  },
  forgotButton: {
    alignSelf: 'flex-end',
    marginTop: -6,
    marginBottom: 18
  },
  forgotText: {
    color: C.blue,
    fontSize: 13.5,
    fontWeight: '900'
  },
  roleWrap: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
    marginBottom: 15
  },
  roleChip: {
    borderRadius: 999,
    borderWidth: 1,
    borderColor: C.border,
    backgroundColor: C.card2,
    paddingHorizontal: 13,
    paddingVertical: 10
  },
  roleChipActive: {
    backgroundColor: C.blue,
    borderColor: C.blue
  },
  roleChipText: {
    color: C.muted,
    fontSize: 12.5,
    fontWeight: '800'
  },
  roleChipTextActive: {
    color: C.white
  },
  authSwitchButton: {
    paddingVertical: 18,
    alignItems: 'center'
  },
  authSwitchText: {
    color: C.muted,
    fontSize: 13.5,
    fontWeight: '700'
  },
  authSwitchLink: {
    color: C.blue,
    fontWeight: '900'
  }
});