import AsyncStorage from '@react-native-async-storage/async-storage';
import { AuthUser, ResetPasswordPayload, SignInPayload, SignUpPayload } from '../types/auth';

const AUTH_USERS_KEY = 'rcc_safety_auth_users';
const AUTH_SESSION_KEY = 'rcc_safety_auth_session';

interface StoredAuthUser extends AuthUser {
  password: string;
}

function normalize(value: string) {
  return value.trim().toLowerCase();
}

async function loadUsers(): Promise<StoredAuthUser[]> {
  const raw = await AsyncStorage.getItem(AUTH_USERS_KEY);
  return raw ? JSON.parse(raw) : [];
}

async function saveUsers(users: StoredAuthUser[]) {
  await AsyncStorage.setItem(AUTH_USERS_KEY, JSON.stringify(users));
}

function removePassword(user: StoredAuthUser): AuthUser {
  return {
    id: user.id,
    fullName: user.fullName,
    email: user.email,
    phone: user.phone,
    role: user.role,
    createdAt: user.createdAt
  };
}

export async function signUpLocalAccount(payload: SignUpPayload): Promise<AuthUser> {
  const users = await loadUsers();

  const email = normalize(payload.email);
  const phone = payload.phone.trim();

  const existingUser = users.find((user) => normalize(user.email) === email || user.phone === phone);

  if (existingUser) {
    throw new Error('An account already exists with this email or phone number.');
  }

  const newUser: StoredAuthUser = {
    id: `USR-${Date.now()}`,
    fullName: payload.fullName.trim(),
    email,
    phone,
    role: payload.role,
    password: payload.password,
    createdAt: new Date().toISOString()
  };

  await saveUsers([newUser, ...users]);

  const sessionUser = removePassword(newUser);
  await AsyncStorage.setItem(AUTH_SESSION_KEY, JSON.stringify(sessionUser));

  return sessionUser;
}

export async function signInLocalAccount(payload: SignInPayload): Promise<AuthUser> {
  const users = await loadUsers();

  const identifier = normalize(payload.identifier);

  const foundUser = users.find(
    (user) => normalize(user.email) === identifier || user.phone.trim() === payload.identifier.trim()
  );

  if (!foundUser || foundUser.password !== payload.password) {
    throw new Error('Invalid login details. Please check your email/phone and password.');
  }

  const sessionUser = removePassword(foundUser);
  await AsyncStorage.setItem(AUTH_SESSION_KEY, JSON.stringify(sessionUser));

  return sessionUser;
}

export async function resetLocalPassword(payload: ResetPasswordPayload): Promise<void> {
  const users = await loadUsers();

  const identifier = normalize(payload.identifier);

  const userIndex = users.findIndex(
    (user) => normalize(user.email) === identifier || user.phone.trim() === payload.identifier.trim()
  );

  if (userIndex === -1) {
    throw new Error('No account was found with this email or phone number.');
  }

  const updatedUsers = [...users];

  updatedUsers[userIndex] = {
    ...updatedUsers[userIndex],
    password: payload.newPassword
  };

  await saveUsers(updatedUsers);
}

export async function loadAuthSession(): Promise<AuthUser | null> {
  const raw = await AsyncStorage.getItem(AUTH_SESSION_KEY);
  return raw ? JSON.parse(raw) : null;
}

export async function signOutLocalAccount() {
  await AsyncStorage.removeItem(AUTH_SESSION_KEY);
}