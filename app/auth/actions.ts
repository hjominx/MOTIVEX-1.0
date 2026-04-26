'use server';

import { createClient } from '@/lib/supabase/server';
import { redirect } from 'next/navigation';

export async function signIn(formData: FormData) {
  const email = formData.get('email') as string;
  const password = formData.get('password') as string;
  
  if (!email || !password) {
    return { error: '이메일과 비밀번호를 입력해주세요.' };
  }
  
  const supabase = await createClient();
  
  const { error } = await supabase.auth.signInWithPassword({
    email,
    password,
  });
  
  if (error) {
    if (error.message.includes('Invalid login credentials')) {
      return { error: '이메일 또는 비밀번호가 올바르지 않습니다.' };
    }
    if (error.message.includes('Email not confirmed')) {
      return { error: '이메일 인증이 필요합니다. 이메일을 확인해주세요.' };
    }
    return { error: error.message };
  }
  
  redirect('/trading');
}

export async function signUp(formData: FormData) {
  const email = formData.get('email') as string;
  const password = formData.get('password') as string;
  const confirmPassword = formData.get('confirmPassword') as string;
  const fullName = formData.get('fullName') as string;
  const phone = formData.get('phone') as string;
  const agreeTerms = formData.get('agreeTerms') === 'on';
  
  // 유효성 검사
  if (!email || !password || !confirmPassword) {
    return { error: '모든 필수 항목을 입력해주세요.' };
  }
  
  if (password !== confirmPassword) {
    return { error: '비밀번호가 일치하지 않습니다.' };
  }
  
  if (password.length < 8) {
    return { error: '비밀번호는 8자 이상이어야 합니다.' };
  }
  
  // 비밀번호 복잡성 검사
  const hasUpperCase = /[A-Z]/.test(password);
  const hasLowerCase = /[a-z]/.test(password);
  const hasNumbers = /\d/.test(password);
  const hasSpecialChar = /[!@#$%^&*(),.?":{}|<>]/.test(password);
  
  if (!(hasUpperCase && hasLowerCase && hasNumbers) && !hasSpecialChar) {
    return { error: '비밀번호는 대문자, 소문자, 숫자를 포함하거나 특수문자를 포함해야 합니다.' };
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
    if (error.message.includes('already registered')) {
      return { error: '이미 가입된 이메일입니다.' };
    }
    return { error: error.message };
  }
  
  redirect('/auth/verify-email');
}

export async function signOut() {
  const supabase = await createClient();
  await supabase.auth.signOut();
  redirect('/');
}

export async function resetPassword(formData: FormData) {
  const email = formData.get('email') as string;
  
  if (!email) {
    return { error: '이메일을 입력해주세요.' };
  }
  
  const supabase = await createClient();
  
  const redirectUrl = process.env.NEXT_PUBLIC_DEV_SUPABASE_REDIRECT_URL ?? 
    `${process.env.NEXT_PUBLIC_SITE_URL || ''}/auth/callback`;
  
  const { error } = await supabase.auth.resetPasswordForEmail(email, {
    redirectTo: `${redirectUrl}?next=/auth/update-password`,
  });
  
  if (error) {
    return { error: error.message };
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
  
  if (password.length < 8) {
    return { error: '비밀번호는 8자 이상이어야 합니다.' };
  }
  
  const supabase = await createClient();
  
  const { error } = await supabase.auth.updateUser({
    password,
  });
  
  if (error) {
    return { error: error.message };
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
