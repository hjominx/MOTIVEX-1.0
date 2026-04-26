import Link from 'next/link';
import { redirect } from 'next/navigation';
import { createClient } from '@/lib/supabase/server';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { 
  TrendingUp, 
  Shield, 
  Zap, 
  Globe, 
  BarChart3, 
  Wallet,
  ArrowRight,
  CheckCircle2
} from 'lucide-react';

export default async function HomePage() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  
  // 로그인된 사용자는 트레이딩 페이지로 리다이렉트
  if (user) {
    redirect('/trading');
  }

  return (
    <div className="min-h-screen bg-background">
      {/* 헤더 */}
      <header className="border-b border-border/50 bg-card/30 backdrop-blur-sm sticky top-0 z-50">
        <div className="container mx-auto px-4 h-16 flex items-center justify-between">
          <Link href="/" className="flex items-center gap-2">
            <div className="flex items-center justify-center w-9 h-9 rounded-lg bg-primary/10 border border-primary/20">
              <TrendingUp className="w-5 h-5 text-primary" />
            </div>
            <span className="font-bold text-xl">NEXUS</span>
          </Link>
          
          <nav className="hidden md:flex items-center gap-6">
            <Link href="#features" className="text-sm text-muted-foreground hover:text-foreground transition-colors">
              기능
            </Link>
            <Link href="#markets" className="text-sm text-muted-foreground hover:text-foreground transition-colors">
              시장
            </Link>
            <Link href="#pricing" className="text-sm text-muted-foreground hover:text-foreground transition-colors">
              수수료
            </Link>
          </nav>
          
          <div className="flex items-center gap-3">
            <Link href="/auth/login">
              <Button variant="ghost" size="sm">로그인</Button>
            </Link>
            <Link href="/auth/signup">
              <Button size="sm">시작하기</Button>
            </Link>
          </div>
        </div>
      </header>

      {/* 히어로 섹션 */}
      <section className="relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-primary/5 via-transparent to-transparent" />
        <div className="container mx-auto px-4 py-24 md:py-32">
          <div className="max-w-4xl mx-auto text-center">
            <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-primary/10 border border-primary/20 text-sm text-primary mb-6">
              <Zap className="w-4 h-4" />
              밀리초 단위 실시간 시세
            </div>
            
            <h1 className="text-4xl md:text-6xl font-bold mb-6 leading-tight text-balance">
              글로벌 자산을
              <br />
              <span className="text-primary">하나의 플랫폼</span>에서
            </h1>
            
            <p className="text-lg md:text-xl text-muted-foreground mb-8 max-w-2xl mx-auto text-pretty">
              한국주식, 미국주식, 암호화폐, 옵션까지.
              전문 트레이더를 위한 차세대 HTS 웹 플랫폼으로
              더 빠르고, 더 스마트하게 거래하세요.
            </p>
            
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
              <Link href="/auth/signup">
                <Button size="lg" className="gap-2 text-base h-12 px-8">
                  무료로 시작하기
                  <ArrowRight className="w-4 h-4" />
                </Button>
              </Link>
              <Link href="/auth/login">
                <Button variant="outline" size="lg" className="text-base h-12 px-8">
                  데모 체험하기
                </Button>
              </Link>
            </div>
            
            {/* 신뢰 지표 */}
            <div className="flex items-center justify-center gap-8 mt-12 text-sm text-muted-foreground">
              <div className="flex items-center gap-2">
                <Shield className="w-4 h-4 text-gain" />
                <span>금융위 등록</span>
              </div>
              <div className="flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-gain" />
                <span>ISMS 인증</span>
              </div>
              <div className="flex items-center gap-2">
                <Zap className="w-4 h-4 text-gain" />
                <span>99.9% 가동률</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 지원 시장 */}
      <section id="markets" className="border-y border-border/50 bg-muted/20">
        <div className="container mx-auto px-4 py-16">
          <h2 className="text-2xl font-bold text-center mb-12">지원 시장</h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            <MarketCard 
              icon={<span className="text-2xl">🇰🇷</span>}
              title="한국 주식"
              description="KOSPI, KOSDAQ 전 종목"
            />
            <MarketCard 
              icon={<span className="text-2xl">🇺🇸</span>}
              title="미국 주식"
              description="NYSE, NASDAQ"
            />
            <MarketCard 
              icon={<span className="text-2xl">₿</span>}
              title="암호화폐"
              description="BTC, ETH 외 100+ 코인"
            />
            <MarketCard 
              icon={<span className="text-2xl">📊</span>}
              title="옵션"
              description="전 종목 옵션 거래"
            />
          </div>
        </div>
      </section>

      {/* 기능 섹션 */}
      <section id="features" className="container mx-auto px-4 py-24">
        <div className="text-center mb-16">
          <h2 className="text-3xl font-bold mb-4">전문가를 위한 기능</h2>
          <p className="text-muted-foreground max-w-2xl mx-auto">
            기관 수준의 트레이딩 도구를 개인 투자자에게 제공합니다
          </p>
        </div>
        
        <div className="grid md:grid-cols-3 gap-6">
          <FeatureCard 
            icon={<Zap className="w-6 h-6" />}
            title="초저지연 시세"
            description="밀리초 단위 실시간 시세와 호가 데이터로 빠른 의사결정을 지원합니다."
          />
          <FeatureCard 
            icon={<BarChart3 className="w-6 h-6" />}
            title="고급 차트"
            description="100+ 기술적 지표와 다양한 차트 유형으로 전문적인 분석이 가능합니다."
          />
          <FeatureCard 
            icon={<Globe className="w-6 h-6" />}
            title="글로벌 접근"
            description="하나의 계좌로 한국, 미국, 암호화폐 시장에 동시 접근하세요."
          />
          <FeatureCard 
            icon={<Shield className="w-6 h-6" />}
            title="보안 강화"
            description="2FA 인증, 암호화 통신, 콜드월렛 보관으로 자산을 안전하게 보호합니다."
          />
          <FeatureCard 
            icon={<Wallet className="w-6 h-6" />}
            title="통합 포트폴리오"
            description="모든 자산을 한눈에 관리하고 실시간 손익을 확인하세요."
          />
          <FeatureCard 
            icon={<TrendingUp className="w-6 h-6" />}
            title="AI 분석"
            description="AI 기반 뉴스 분석과 시장 인사이트로 더 나은 투자 결정을 내리세요."
          />
        </div>
      </section>

      {/* 수수료 섹션 */}
      <section id="pricing" className="border-t border-border/50 bg-muted/20">
        <div className="container mx-auto px-4 py-24">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold mb-4">투명한 수수료</h2>
            <p className="text-muted-foreground">
              거래량이 늘어날수록 수수료가 낮아집니다
            </p>
          </div>
          
          <div className="max-w-4xl mx-auto">
            <div className="grid grid-cols-4 gap-4 text-sm mb-4 px-4">
              <span className="font-medium">시장</span>
              <span className="font-medium text-center">Basic</span>
              <span className="font-medium text-center">Gold</span>
              <span className="font-medium text-center">VIP</span>
            </div>
            
            <div className="space-y-2">
              <PricingRow market="한국 주식" basic="0.015%" gold="0.01%" vip="0.005%" />
              <PricingRow market="미국 주식" basic="0.25%" gold="0.15%" vip="0.05%" />
              <PricingRow market="암호화폐" basic="0.1%" gold="0.06%" vip="0.02%" />
              <PricingRow market="옵션" basic="0.3%" gold="0.2%" vip="0.1%" />
            </div>
          </div>
        </div>
      </section>

      {/* CTA 섹션 */}
      <section className="container mx-auto px-4 py-24">
        <Card className="bg-primary/5 border-primary/20">
          <CardContent className="py-12 text-center">
            <h2 className="text-3xl font-bold mb-4">지금 시작하세요</h2>
            <p className="text-muted-foreground mb-8 max-w-xl mx-auto">
              5분 만에 계좌를 개설하고 글로벌 시장에 접근하세요.
              첫 거래 수수료는 무료입니다.
            </p>
            <Link href="/auth/signup">
              <Button size="lg" className="gap-2 text-base h-12 px-8">
                무료 계좌 개설
                <ArrowRight className="w-4 h-4" />
              </Button>
            </Link>
          </CardContent>
        </Card>
      </section>

      {/* 푸터 */}
      <footer className="border-t border-border/50 bg-card/30">
        <div className="container mx-auto px-4 py-12">
          <div className="grid md:grid-cols-4 gap-8">
            <div>
              <div className="flex items-center gap-2 mb-4">
                <div className="flex items-center justify-center w-8 h-8 rounded-lg bg-primary/10 border border-primary/20">
                  <TrendingUp className="w-4 h-4 text-primary" />
                </div>
                <span className="font-bold">NEXUS</span>
              </div>
              <p className="text-sm text-muted-foreground">
                차세대 글로벌 트레이딩 플랫폼
              </p>
            </div>
            
            <div>
              <h4 className="font-medium mb-4">서비스</h4>
              <ul className="space-y-2 text-sm text-muted-foreground">
                <li><Link href="/trading" className="hover:text-foreground">트레이딩</Link></li>
                <li><Link href="#" className="hover:text-foreground">API</Link></li>
                <li><Link href="#" className="hover:text-foreground">모바일 앱</Link></li>
              </ul>
            </div>
            
            <div>
              <h4 className="font-medium mb-4">지원</h4>
              <ul className="space-y-2 text-sm text-muted-foreground">
                <li><Link href="#" className="hover:text-foreground">고객센터</Link></li>
                <li><Link href="#" className="hover:text-foreground">FAQ</Link></li>
                <li><Link href="#" className="hover:text-foreground">가이드</Link></li>
              </ul>
            </div>
            
            <div>
              <h4 className="font-medium mb-4">법적 고지</h4>
              <ul className="space-y-2 text-sm text-muted-foreground">
                <li><Link href="/terms" className="hover:text-foreground">이용약관</Link></li>
                <li><Link href="/privacy" className="hover:text-foreground">개인정보처리방침</Link></li>
                <li><Link href="/risk" className="hover:text-foreground">투자위험고지</Link></li>
              </ul>
            </div>
          </div>
          
          <div className="border-t border-border/50 mt-12 pt-8 text-center text-sm text-muted-foreground">
            <p>
              투자에는 원금 손실의 위험이 있습니다. 투자 결정은 본인의 책임하에 이루어져야 합니다.
            </p>
            <p className="mt-2">
              &copy; 2024 NEXUS Trading. All rights reserved.
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
}

function MarketCard({ 
  icon, 
  title, 
  description 
}: { 
  icon: React.ReactNode; 
  title: string; 
  description: string;
}) {
  return (
    <Card className="bg-card/50 border-border/50 text-center">
      <CardContent className="pt-6">
        <div className="mb-3">{icon}</div>
        <h3 className="font-semibold mb-1">{title}</h3>
        <p className="text-sm text-muted-foreground">{description}</p>
      </CardContent>
    </Card>
  );
}

function FeatureCard({ 
  icon, 
  title, 
  description 
}: { 
  icon: React.ReactNode; 
  title: string; 
  description: string;
}) {
  return (
    <Card className="bg-card/50 border-border/50">
      <CardContent className="pt-6">
        <div className="w-12 h-12 rounded-lg bg-primary/10 border border-primary/20 flex items-center justify-center text-primary mb-4">
          {icon}
        </div>
        <h3 className="font-semibold mb-2">{title}</h3>
        <p className="text-sm text-muted-foreground">{description}</p>
      </CardContent>
    </Card>
  );
}

function PricingRow({ 
  market, 
  basic, 
  gold, 
  vip 
}: { 
  market: string; 
  basic: string; 
  gold: string; 
  vip: string;
}) {
  return (
    <Card className="bg-card/50 border-border/50">
      <CardContent className="py-4 grid grid-cols-4 gap-4 items-center">
        <span className="font-medium">{market}</span>
        <span className="text-center text-muted-foreground">{basic}</span>
        <span className="text-center text-primary">{gold}</span>
        <span className="text-center text-gain font-medium">{vip}</span>
      </CardContent>
    </Card>
  );
}
