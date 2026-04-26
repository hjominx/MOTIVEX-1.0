'use client';

import { useState } from 'react';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { signUp } from '../actions';
import { Eye, EyeOff, AlertCircle, Check } from 'lucide-react';

export default function SignUpPage() {
  const [showPw, setShowPw]   = useState(false);
  const [pw, setPw]           = useState('');
  const [error, setError]     = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [agreed, setAgreed]   = useState(false);

  const checks = {
    length:    pw.length >= 8,
    upper:     /[A-Z]/.test(pw),
    lower:     /[a-z]/.test(pw),
    number:    /\d/.test(pw),
  };
  const strong = checks.length && checks.upper && checks.lower && checks.number;

  async function handleSubmit(formData: FormData) {
    if (!agreed) { setError('이용약관에 동의해주세요.'); return; }
    setLoading(true);
    setError(null);
    const result = await signUp(formData);
    if (result?.error) { setError(result.error); setLoading(false); }
  }

  return (
    <div className="min-h-screen bg-background flex items-center justify-center p-4">
      <div className="w-full max-w-[380px]">

        <div className="text-center mb-8">
          <h1 className="text-[22px] font-semibold tracking-tight">MOTIVEX</h1>
          <p className="text-[13px] text-muted-foreground mt-1">새 계정 만들기</p>
        </div>

        <div className="bg-white rounded-2xl border border-border card-shadow p-6 space-y-4">
          <form action={handleSubmit} className="space-y-4">
            {error && (
              <div className="flex items-start gap-2 p-3 bg-loss text-loss rounded-xl text-[13px]">
                <AlertCircle className="w-4 h-4 shrink-0 mt-0.5" />
                <span>{error}</span>
              </div>
            )}

            <div className="space-y-3">
              <Field label="이름">
                <Input
                  name="fullName"
                  placeholder="홍길동"
                  className="h-10 text-[14px] bg-muted/50 border-border/60 rounded-xl focus:bg-white"
                />
              </Field>

              <Field label="이메일">
                <Input
                  name="email"
                  type="email"
                  placeholder="name@example.com"
                  required
                  className="h-10 text-[14px] bg-muted/50 border-border/60 rounded-xl focus:bg-white"
                />
              </Field>

              <Field label="전화번호 (선택)">
                <Input
                  name="phone"
                  type="tel"
                  placeholder="010-0000-0000"
                  className="h-10 text-[14px] bg-muted/50 border-border/60 rounded-xl focus:bg-white"
                />
              </Field>

              <div>
                <label className="block text-[13px] font-medium text-foreground mb-1.5">비밀번호</label>
                <div className="relative">
                  <Input
                    name="password"
                    type={showPw ? 'text' : 'password'}
                    placeholder="8자 이상"
                    value={pw}
                    onChange={(e) => setPw(e.target.value)}
                    required
                    className="h-10 text-[14px] bg-muted/50 border-border/60 rounded-xl focus:bg-white pr-10"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPw(!showPw)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground"
                  >
                    {showPw ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>

                {/* Password strength */}
                {pw.length > 0 && (
                  <div className="mt-2 grid grid-cols-2 gap-1">
                    {[
                      { ok: checks.length, label: '8자 이상' },
                      { ok: checks.upper,  label: '대문자 포함' },
                      { ok: checks.lower,  label: '소문자 포함' },
                      { ok: checks.number, label: '숫자 포함' },
                    ].map((c) => (
                      <div key={c.label} className={`flex items-center gap-1 text-[11px] ${c.ok ? 'text-gain' : 'text-muted-foreground'}`}>
                        <Check className={`w-3 h-3 ${c.ok ? 'opacity-100' : 'opacity-30'}`} />
                        {c.label}
                      </div>
                    ))}
                  </div>
                )}
              </div>

              <div>
                <label className="block text-[13px] font-medium text-foreground mb-1.5">비밀번호 확인</label>
                <Input
                  name="confirmPassword"
                  type="password"
                  placeholder="비밀번호 재입력"
                  required
                  className="h-10 text-[14px] bg-muted/50 border-border/60 rounded-xl focus:bg-white"
                />
              </div>
            </div>

            {/* Terms */}
            <label className="flex items-start gap-2.5 cursor-pointer">
              <div
                onClick={() => setAgreed(!agreed)}
                className={`mt-0.5 w-4 h-4 rounded border flex items-center justify-center shrink-0 transition-colors ${
                  agreed ? 'bg-primary border-primary' : 'border-border bg-white'
                }`}
              >
                {agreed && <Check className="w-2.5 h-2.5 text-white" />}
              </div>
              <input type="hidden" name="agreeTerms" value={agreed ? 'on' : ''} />
              <span className="text-[12px] text-muted-foreground leading-relaxed">
                <Link href="/terms" className="text-primary underline">이용약관</Link> 및{' '}
                <Link href="/privacy" className="text-primary underline">개인정보처리방침</Link>에 동의합니다
              </span>
            </label>

            <Button
              type="submit"
              disabled={loading || !strong}
              className="w-full h-10 text-[14px] font-medium rounded-xl bg-primary hover:bg-primary/90 text-white disabled:opacity-40"
            >
              {loading ? '처리 중...' : '계정 만들기'}
            </Button>
          </form>
        </div>

        <p className="text-center text-[13px] text-muted-foreground mt-5">
          이미 계정이 있으신가요?{' '}
          <Link href="/auth/login" className="text-primary font-medium hover:underline">로그인</Link>
        </p>
      </div>
    </div>
  );
}

function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div>
      <label className="block text-[13px] font-medium text-foreground mb-1.5">{label}</label>
      {children}
    </div>
  );
}
