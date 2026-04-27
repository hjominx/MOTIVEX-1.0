'use server';

import { createClient } from '@/lib/supabase/server';
import { checkRateLimit } from '@/lib/security/rate-limit';
import { headers } from 'next/headers';
import { redirect } from 'next/navigation';

const AUTH_FAILURE_MESSAGE = '요청을 처리할 수 없습니다. 잠시 후 다시 시도해주세요.';

function normalizeEmail(value: FormDataEntryValue | null): string {
  return String(value ?? '').trim().toLowerCase();
}

function getStringValue(value: FormDataEntryValue | null): string {
  return String(value ?? '').trim();
}

async function getClientIp(): Promise<string> {
  const headerStore = await headers();
  const forwarded = headerStore.get('x-forwarded-for');
  if (!forwarded) return 'unknown';
  return forwarded.split(',')[0]?.trim() || 'unknown';
}

function validateStrongPassword(password: string): string | null {
  if (password.length < 8) {
    return '비밀번호는 8자 이상이어야 합니다.';
  }

  const checks = [
    /[A-Z]/.test(password),
    /[a-z]/.test(password),
    /\d/.test(password),
    /[!@#$%^&*(),.?":{}|<>]/.test(password),
  ];

  const passedRules = checks.filter(Boolean).length;
  if (passedRules < 3) {
    return '비밀번호는 대문자, 소문자, 숫자, 특수문자 중 3가지 이상을 포함해야 합니다.';
  }

  return null;
}

export async function signIn(formData: FormData) {
  const email = normalizeEmail(formData.get('email'));
  const password = getStringValue(formData.get('password'));
  
  if (!email || !password) {
    return { error: '이메일과 비밀번호를 입력해주세요.' };
  }

  const ip = await getClientIp();
  const rateLimit = checkRateLimit({
    key: `auth:signin:${ip}:${email}`,
    limit: 10,
    windowMs: 60_000,
  });

  if (!rateLimit.allowed) {
    return {
      error: `요청이 너무 많습니다. ${rateLimit.retryAfterSec}초 후 다시 시도해주세요.`,
    };
  }
  
  const supabase = await createClient();
  
  const { error } = await supabase.auth.signInWithPassword({
    email,
    password,
  });
  
  if (error) {
    return { error: AUTH_FAILURE_MESSAGE };
  }
  
  redirect('/trading');
}

export async function signUp(formData: FormData) {
  const email = normalizeEmail(formData.get('email'));
  const password = getStringValue(formData.get('password'));
  const confirmPassword = getStringValue(formData.get('confirmPassword'));
  const fullName = getStringValue(formData.get('fullName'));
  const phone = getStringValue(formData.get('phone'));
  const agreeTerms = formData.get('agreeTerms') === 'on';
  
  // 유효성 검사
  if (!email || !password || !confirmPassword) {
    return { error: '모든 필수 항목을 입력해주세요.' };
  }
  
  if (password !== confirmPassword) {
    return { error: '비밀번호가 일치하지 않습니다.' };
  }
  
  const passwordError = validateStrongPassword(password);
  if (passwordError) {
    return { error: passwordError };
  }
  
  if (!agreeTerms) {
    return { error: '서비스 이용약관에 동의해주세요.' };
  }
  
  const supabase = await createClient();
  
  const redirectUrl = process.env.NEXT_PUBLIC_DEV_SUPABASE_REDIRECT_URL ?? 
    `${process.env.NEXT_PUBLIC_SITE_URL || ''}/auth/callback`;
  
  const { error } = await supabase.auth.signUp({
    email,
    password,
    options: {
      emailRedirectTo: redirectUrl,
      data: {
        full_name: fullName || null,
        phone: phone || null,
      },
    },
  });
  
  if (error) {
    if (error.message.includes('already registered') || error.message.includes('already been registered')) {
      redirect('/auth/verify-email');
    }
    return { error: AUTH_FAILURE_MESSAGE };
  }
  
  redirect('/auth/verify-email');
}

export async function signOut() {
  const supabase = await createClient();
  await supabase.auth.signOut();
  redirect('/');
}

export async function resetPassword(formData: FormData) {
  const email = normalizeEmail(formData.get('email'));
  
  if (!email) {
    return { error: '이메일을 입력해주세요.' };
  }

  const ip = await getClientIp();
  const rateLimit = checkRateLimit({
    key: `auth:reset-password:${ip}:${email}`,
    limit: 5,
    windowMs: 60_000,
  });

  if (!rateLimit.allowed) {
    return {
      error: `요청이 너무 많습니다. ${rateLimit.retryAfterSec}초 후 다시 시도해주세요.`,
    };
  }
  
  const supabase = await createClient();
  
  const redirectUrl = process.env.NEXT_PUBLIC_DEV_SUPABASE_REDIRECT_URL ?? 
    `${process.env.NEXT_PUBLIC_SITE_URL || ''}/auth/callback`;
  
  const { error } = await supabase.auth.resetPasswordForEmail(email, {
    redirectTo: `${redirectUrl}?next=/auth/update-password`,
  });
  
  if (error && !error.message.includes('not found')) {
    return { error: AUTH_FAILURE_MESSAGE };
  }
  
  return { success: '비밀번호 재설정 링크를 이메일로 보냈습니다.' };
}

export async function updatePassword(formData: FormData) {
  const password = formData.get('password') as string;
  const confirmPassword = formData.get('confirmPassword') as string;
  
  if (!password || !confirmPassword) {
    return { error: '모든 필드를 입력해주세요.' };
  }
  
  if (password !== confirmPassword) {
    return { error: '비밀번호가 일치하지 않습니다.' };
  }
  
  const passwordError = validateStrongPassword(password);
  if (passwordError) {
    return { error: passwordError };
  }
  
  const supabase = await createClient();
  
  const { error } = await supabase.auth.updateUser({
    password,
  });
  
  if (error) {
    return { error: AUTH_FAILURE_MESSAGE };
  }
  
  redirect('/trading');
}

export async function getUser() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  return user;
}

export async function getUserProfile() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  
  if (!user) return null;
  
  const { data: profile } = await supabase
    .from('profiles')
    .select('*')
    .eq('id', user.id)
    .single();
  
  return profile;
}
