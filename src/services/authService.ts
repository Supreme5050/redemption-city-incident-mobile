import { AuthUser, ResetPasswordPayload, SignInPayload, SignUpPayload, UserRole } from '../types/auth';
import { supabase } from '../lib/supabase';

type SupabaseProfile = {
  id: string;
  full_name: string;
  email: string;
  phone: string | null;
  role: string;
  created_at: string;
};

function normalizeEmail(value: string) {
  return value.trim().toLowerCase();
}

function mapProfileToAuthUser(profile: SupabaseProfile): AuthUser {
  return {
    id: profile.id,
    fullName: profile.full_name,
    email: profile.email,
    phone: profile.phone ?? '',
    role: profile.role as UserRole,
    createdAt: profile.created_at
  };
}

async function getProfileByUserId(userId: string): Promise<AuthUser | null> {
  const { data, error } = await supabase
    .from('profiles')
    .select('id, full_name, email, phone, role, created_at')
    .eq('id', userId)
    .maybeSingle();

  if (error) {
    throw new Error(error.message);
  }

  if (!data) {
    return null;
  }

  return mapProfileToAuthUser(data as SupabaseProfile);
}

export async function signUpLocalAccount(payload: SignUpPayload): Promise<AuthUser> {
  const email = normalizeEmail(payload.email);
  const phone = payload.phone.trim();
  const fullName = payload.fullName.trim();

  if (!fullName) {
    throw new Error('Please enter your full name.');
  }

  if (!email.includes('@')) {
    throw new Error('Please enter a valid email address.');
  }

  if (!phone) {
    throw new Error('Please enter your phone number.');
  }

  if (payload.password.length < 6) {
    throw new Error('Password must be at least 6 characters.');
  }

  const { data, error } = await supabase.auth.signUp({
    email,
    password: payload.password,
    options: {
      data: {
        full_name: fullName,
        phone,
        role: payload.role
      }
    }
  });

  if (error) {
    throw new Error(error.message);
  }

  if (!data.user) {
    throw new Error('Account could not be created. Please try again.');
  }

  const profilePayload = {
    id: data.user.id,
    full_name: fullName,
    email,
    phone,
    role: payload.role,
    updated_at: new Date().toISOString()
  };

  const { error: profileError } = await supabase.from('profiles').upsert(profilePayload);

  if (profileError) {
    throw new Error(profileError.message);
  }

  const profile = await getProfileByUserId(data.user.id);

  if (!profile) {
    throw new Error('Account was created, but profile could not be loaded.');
  }

  return profile;
}

export async function signInLocalAccount(payload: SignInPayload): Promise<AuthUser> {
  const identifier = payload.identifier.trim();

  if (!identifier.includes('@')) {
    throw new Error('For Supabase login, please sign in with your email address for now.');
  }

  const email = normalizeEmail(identifier);

  const { data, error } = await supabase.auth.signInWithPassword({
    email,
    password: payload.password
  });

  if (error) {
    throw new Error(error.message);
  }

  if (!data.user) {
    throw new Error('Unable to sign in. Please try again.');
  }

  const profile = await getProfileByUserId(data.user.id);

  if (!profile) {
    throw new Error('Profile not found for this account.');
  }

  return profile;
}

export async function resetLocalPassword(payload: ResetPasswordPayload): Promise<void> {
  const identifier = payload.identifier.trim();

  if (!identifier.includes('@')) {
    throw new Error('Password recovery currently works with email only.');
  }

  const email = normalizeEmail(identifier);

  const { error } = await supabase.auth.resetPasswordForEmail(email);

  if (error) {
    throw new Error(error.message);
  }
}

export async function loadAuthSession(): Promise<AuthUser | null> {
  const {
    data: { session },
    error
  } = await supabase.auth.getSession();

  if (error) {
    throw new Error(error.message);
  }

  if (!session?.user) {
    return null;
  }

  return getProfileByUserId(session.user.id);
}

export async function signOutLocalAccount(): Promise<void> {
  const { error } = await supabase.auth.signOut();

  if (error) {
    throw new Error(error.message);
  }
}