'use client';

import { useState } from 'react';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { signIn } from '../actions';
import { Eye, EyeOff, AlertCircle, TrendingUp, ArrowRight } from 'lucide-react';

export default function LoginPage() {
  const [showPw, setShowPw]   = useState(false);
  const [error, setError]     = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  async function handleSubmit(formData: FormData) {
    setLoading(true);
    setError(null);
    const result = await signIn(formData);
    if (result?.error) { setError(result.error); setLoading(false); }
  }

  return (
    <div className="min-h-screen bg-background overflow-hidden relative">
      {/* 부드러운 배경 그래디언트 이펙트 */}
      <div className="fixed inset-0 -z-10 pointer-events-none">
        <div className="absolute -top-40 -right-40 w-80 h-80 bg-gradient-to-br from-primary/10 via-transparent to-transparent rounded-full blur-3xl" />
        <div className="absolute top-1/3 -left-32 w-72 h-72 bg-gradient-to-br from-secondary/8 via-transparent to-transparent rounded-full blur-3xl" />
      </div>

      <div className="flex items-center justify-center min-h-screen p-4">
        <div className="w-full max-w-[420px] slide-in-up">
          
          {/* 로고 */}
          <div className="text-center mb-12">
            <Link href="/" className="inline-flex items-center gap-3 mb-8 group">
              <div className="flex items-center justify-center w-12 h-12 rounded-xl bg-gradient-primary p-2.5 group-hover:shadow-lg group-hover:shadow-primary/30 transition-all duration-300">
                <TrendingUp className="w-7 h-7 text-white" />
              </div>
              <span className="text-2xl font-bold bg-gradient-to-r from-primary via-secondary to-primary bg-clip-text text-transparent">MOTIVEX</span>
            </Link>
            
            <h1 className="text-3xl font-bold text-foreground mb-2">다시 돌아오셨네요</h1>
            <p className="text-muted-foreground">계정에 로그인하여 거래를 시작하세요</p>
          </div>

          {/* 로그인 카드 */}
          <div className="relative overflow-hidden rounded-2xl border border-primary/20 bg-white shadow-lg p-8">
            <form action={handleSubmit} className="relative z-10 space-y-6">
              {/* 에러 메시지 */}
              {error && (
                <div className="flex items-start gap-3 p-4 rounded-xl bg-loss/10 border border-loss/20 text-loss text-sm animate-pulse">
                  <AlertCircle className="w-5 h-5 shrink-0 mt-0.5" />
                  <span className="font-medium">{error}</span>
                </div>
              )}

              {/* 입력 필드들 */}
              <div className="space-y-4">
                {/* 이메일 */}
                <div>
                  <label className="block text-sm font-semibold text-foreground mb-2">이메일</label>
                  <Input
                    name="email"
                    type="email"
                    placeholder="name@example.com"
                    autoComplete="email"
                    required
                    className="h-11 text-sm bg-background border border-primary/20 rounded-lg focus:border-primary/50 focus:ring-2 focus:ring-primary/20 transition-all duration-300 placeholder:text-muted-foreground/50"
                  />
                </div>

                {/* 비밀번호 */}
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <label className="text-sm font-semibold text-foreground">비밀번호</label>
                    <Link
                      href="/auth/forgot-password"
                      className="text-xs text-primary hover:text-secondary transition-colors duration-300 font-medium"
                    >
                      비밀번호 찾기
                    </Link>
                  </div>
                  <div className="relative">
                    <Input
                      name="password"
                      type={showPw ? 'text' : 'password'}
                      placeholder="비밀번호 입력"
                      autoComplete="current-password"
                      required
                      className="h-11 text-sm bg-background border border-primary/20 rounded-lg focus:border-primary/50 focus:ring-2 focus:ring-primary/20 transition-all duration-300 pr-11 placeholder:text-muted-foreground/50"
                    />
                    <button
                      type="button"
                      onClick={() => setShowPw(!showPw)}
                      className="absolute right-3.5 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-primary transition-colors duration-300"
                    >
                      {showPw ? (
                        <EyeOff className="w-4 h-4" />
                      ) : (
                        <Eye className="w-4 h-4" />
                      )}
                    </button>
                  </div>
                </div>
              </div>

              {/* 로그인 버튼 */}
              <Button
                type="submit"
                disabled={loading}
                className="w-full h-11 text-base font-semibold rounded-lg bg-gradient-primary hover:shadow-lg hover:shadow-primary/30 text-white transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
              >
                {loading ? (
                  <>
                    <div className="w-4 h-4 rounded-full border-2 border-white border-t-transparent animate-spin" />
                    로그인 중...
                  </>
                ) : (
                  <>
                    로그인
                    <ArrowRight className="w-4 h-4" />
                  </>
                )}
              </Button>
            </form>
          </div>

          {/* 회원가입 링크 */}
          <p className="text-center text-sm text-muted-foreground mt-8">
            계정이 없으신가요?{' '}
            <Link href="/auth/signup" className="text-primary font-semibold hover:text-secondary transition-colors duration-300">
              회원가입
            </Link>
          </p>

          {/* 추가 도움말 */}
          <div className="mt-8 p-4 rounded-lg border border-border bg-muted/20 text-center text-xs text-muted-foreground">
            데모 계정으로 시험해보세요. 본인 인증 없이도 제한된 기능을 사용할 수 있습니다.
          </div>
        </div>
      </div>
    </div>
  );
}
