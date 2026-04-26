'use client';

import { useState } from 'react';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Field, FieldGroup, FieldLabel } from '@/components/ui/field';
import { Checkbox } from '@/components/ui/checkbox';
import { signUp } from '../actions';
import { TrendingUp, Eye, EyeOff, AlertCircle, Check, X } from 'lucide-react';

export default function SignUpPage() {
  const [showPassword, setShowPassword] = useState(false);
  const [password, setPassword] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [agreeTerms, setAgreeTerms] = useState(false);

  // 비밀번호 강도 체크
  const passwordChecks = {
    length: password.length >= 8,
    uppercase: /[A-Z]/.test(password),
    lowercase: /[a-z]/.test(password),
    number: /\d/.test(password),
    special: /[!@#$%^&*(),.?":{}|<>]/.test(password),
  };
  
  const isPasswordStrong = passwordChecks.length && 
    ((passwordChecks.uppercase && passwordChecks.lowercase && passwordChecks.number) || passwordChecks.special);

  async function handleSubmit(formData: FormData) {
    setIsLoading(true);
    setError(null);
    
    const result = await signUp(formData);
    
    if (result?.error) {
      setError(result.error);
      setIsLoading(false);
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-background p-4 py-8">
      <div className="w-full max-w-md">
        {/* 로고 */}
        <div className="flex items-center justify-center gap-3 mb-8">
          <div className="flex items-center justify-center w-12 h-12 rounded-xl bg-primary/10 border border-primary/20">
            <TrendingUp className="w-7 h-7 text-primary" />
          </div>
          <div>
            <h1 className="text-2xl font-bold text-foreground">NEXUS</h1>
            <p className="text-xs text-muted-foreground">Trading Platform</p>
          </div>
        </div>

        <Card className="border-border/50 bg-card/50 backdrop-blur">
          <CardHeader className="text-center pb-2">
            <CardTitle className="text-xl">회원가입</CardTitle>
            <CardDescription>새 계정을 만들고 거래를 시작하세요</CardDescription>
          </CardHeader>
          <CardContent>
            <form action={handleSubmit} className="space-y-4">
              {error && (
                <div className="flex items-center gap-2 p-3 text-sm text-loss bg-loss/10 border border-loss/20 rounded-lg">
                  <AlertCircle className="w-4 h-4 shrink-0" />
                  <span>{error}</span>
                </div>
              )}
              
              <FieldGroup>
                <Field>
                  <FieldLabel htmlFor="email">이메일 *</FieldLabel>
                  <Input
                    id="email"
                    name="email"
                    type="email"
                    placeholder="your@email.com"
                    required
                    autoComplete="email"
                    className="bg-input/50"
                  />
                </Field>
                
                <Field>
                  <FieldLabel htmlFor="fullName">이름</FieldLabel>
                  <Input
                    id="fullName"
                    name="fullName"
                    type="text"
                    placeholder="홍길동"
                    autoComplete="name"
                    className="bg-input/50"
                  />
                </Field>
                
                <Field>
                  <FieldLabel htmlFor="phone">휴대폰 번호</FieldLabel>
                  <Input
                    id="phone"
                    name="phone"
                    type="tel"
                    placeholder="010-1234-5678"
                    autoComplete="tel"
                    className="bg-input/50"
                  />
                </Field>
                
                <Field>
                  <FieldLabel htmlFor="password">비밀번호 *</FieldLabel>
                  <div className="relative">
                    <Input
                      id="password"
                      name="password"
                      type={showPassword ? 'text' : 'password'}
                      placeholder="••••••••"
                      required
                      autoComplete="new-password"
                      className="bg-input/50 pr-10"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
                    >
                      {showPassword ? (
                        <EyeOff className="w-4 h-4" />
                      ) : (
                        <Eye className="w-4 h-4" />
                      )}
                    </button>
                  </div>
                  
                  {/* 비밀번호 강도 표시 */}
                  {password && (
                    <div className="mt-2 space-y-1">
                      <PasswordCheck passed={passwordChecks.length} label="8자 이상" />
                      <PasswordCheck passed={passwordChecks.uppercase} label="대문자 포함" />
                      <PasswordCheck passed={passwordChecks.lowercase} label="소문자 포함" />
                      <PasswordCheck passed={passwordChecks.number} label="숫자 포함" />
                      <PasswordCheck passed={passwordChecks.special} label="특수문자 포함 (선택)" />
                    </div>
                  )}
                </Field>
                
                <Field>
                  <FieldLabel htmlFor="confirmPassword">비밀번호 확인 *</FieldLabel>
                  <Input
                    id="confirmPassword"
                    name="confirmPassword"
                    type={showPassword ? 'text' : 'password'}
                    placeholder="••••••••"
                    required
                    autoComplete="new-password"
                    className="bg-input/50"
                  />
                </Field>
              </FieldGroup>
              
              <div className="flex items-start gap-3">
                <Checkbox
                  id="agreeTerms"
                  name="agreeTerms"
                  checked={agreeTerms}
                  onCheckedChange={(checked) => setAgreeTerms(checked as boolean)}
                  className="mt-0.5"
                />
                <label htmlFor="agreeTerms" className="text-sm text-muted-foreground leading-relaxed">
                  <Link href="/terms" className="text-primary hover:underline">이용약관</Link>,{' '}
                  <Link href="/privacy" className="text-primary hover:underline">개인정보처리방침</Link>,{' '}
                  <Link href="/risk" className="text-primary hover:underline">투자위험고지</Link>에 동의합니다. *
                </label>
              </div>
              
              <Button 
                type="submit" 
                className="w-full" 
                disabled={isLoading || !agreeTerms || !isPasswordStrong}
              >
                {isLoading ? '가입 중...' : '회원가입'}
              </Button>
            </form>
            
            <div className="mt-6 text-center text-sm text-muted-foreground">
              이미 계정이 있으신가요?{' '}
              <Link href="/auth/login" className="text-primary hover:underline font-medium">
                로그인
              </Link>
            </div>
          </CardContent>
        </Card>
        
        <div className="mt-6 p-4 bg-warning/10 border border-warning/20 rounded-lg">
          <p className="text-xs text-warning text-center leading-relaxed">
            투자에는 원금 손실의 위험이 있습니다. 투자 결정은 본인의 책임하에 이루어져야 합니다.
          </p>
        </div>
      </div>
    </div>
  );
}

function PasswordCheck({ passed, label }: { passed: boolean; label: string }) {
  return (
    <div className="flex items-center gap-2 text-xs">
      {passed ? (
        <Check className="w-3 h-3 text-gain" />
      ) : (
        <X className="w-3 h-3 text-muted-foreground" />
      )}
      <span className={passed ? 'text-gain' : 'text-muted-foreground'}>{label}</span>
    </div>
  );
}
