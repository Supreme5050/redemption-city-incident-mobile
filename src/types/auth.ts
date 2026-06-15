export type UserRole = 'Reporter' | 'Resident' | 'Visitor' | 'Field Reporter';

export interface AuthUser {
  id: string;
  fullName: string;
  email: string;
  phone: string;
  role: UserRole;
  createdAt: string;
}

export interface SignUpPayload {
  fullName: string;
  email: string;
  phone: string;
  password: string;
  role: UserRole;
}

export interface SignInPayload {
  identifier: string;
  password: string;
}

export interface ResetPasswordPayload {
  identifier: string;
  newPassword: string;
}