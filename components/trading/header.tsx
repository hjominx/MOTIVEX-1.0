'use client';

import { useState } from 'react';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { useTradingStore } from '@/lib/stores/trading-store';
import { signOut } from '@/app/auth/actions';
import { 
  TrendingUp, 
  Bell, 
  Settings, 
  User, 
  LogOut, 
  Wallet,
  Menu,
  X,
  Wifi,
  WifiOff,
  ChevronDown
} from 'lucide-react';

interface TradingHeaderProps {
  userEmail?: string;
}

export function TradingHeader({ userEmail }: TradingHeaderProps) {
  const { isConnected, sidebarOpen, setSidebarOpen } = useTradingStore();
  const [showNotifications, setShowNotifications] = useState(false);

  return (
    <header className="h-14 border-b border-border bg-card/80 backdrop-blur-sm flex items-center justify-between px-4 shrink-0">
      {/* 왼쪽: 로고 및 메뉴 토글 */}
      <div className="flex items-center gap-4">
        <button
          onClick={() => setSidebarOpen(!sidebarOpen)}
          className="p-2 rounded-lg hover:bg-accent transition-colors"
        >
          {sidebarOpen ? (
            <X className="w-5 h-5 text-muted-foreground" />
          ) : (
            <Menu className="w-5 h-5 text-muted-foreground" />
          )}
        </button>
        
        <Link href="/trading" className="flex items-center gap-2">
          <div className="flex items-center justify-center w-8 h-8 rounded-lg bg-primary/10 border border-primary/20">
            <TrendingUp className="w-5 h-5 text-primary" />
          </div>
          <span className="font-bold text-lg hidden sm:block">NEXUS</span>
        </Link>

        {/* 마켓 네비게이션 */}
        <nav className="hidden md:flex items-center gap-1 ml-4">
          <NavButton href="/trading" active>한국주식</NavButton>
          <NavButton href="/trading/us">미국주식</NavButton>
          <NavButton href="/trading/crypto">암호화폐</NavButton>
          <NavButton href="/trading/options">옵션</NavButton>
        </nav>
      </div>

      {/* 오른쪽: 상태 및 사용자 메뉴 */}
      <div className="flex items-center gap-2">
        {/* 연결 상태 */}
        <div className={`flex items-center gap-1.5 px-2 py-1 rounded text-xs ${
          isConnected 
            ? 'text-gain bg-gain/10' 
            : 'text-loss bg-loss/10'
        }`}>
          {isConnected ? (
            <Wifi className="w-3.5 h-3.5" />
          ) : (
            <WifiOff className="w-3.5 h-3.5" />
          )}
          <span className="hidden sm:inline">{isConnected ? '실시간' : '연결끊김'}</span>
        </div>

        {/* 알림 */}
        <Button variant="ghost" size="icon" className="relative">
          <Bell className="w-5 h-5" />
          <span className="absolute top-1 right-1 w-2 h-2 bg-loss rounded-full" />
        </Button>

        {/* 사용자 메뉴 */}
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" className="gap-2 px-2">
              <div className="w-8 h-8 rounded-full bg-primary/10 border border-primary/20 flex items-center justify-center">
                <User className="w-4 h-4 text-primary" />
              </div>
              <ChevronDown className="w-4 h-4 text-muted-foreground hidden sm:block" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-56">
            {userEmail && (
              <>
                <div className="px-2 py-1.5">
                  <p className="text-sm font-medium">{userEmail}</p>
                  <p className="text-xs text-muted-foreground">Basic 등급</p>
                </div>
                <DropdownMenuSeparator />
              </>
            )}
            <DropdownMenuItem asChild>
              <Link href="/trading/portfolio" className="flex items-center gap-2">
                <Wallet className="w-4 h-4" />
                내 포트폴리오
              </Link>
            </DropdownMenuItem>
            <DropdownMenuItem asChild>
              <Link href="/trading/accounts" className="flex items-center gap-2">
                <Settings className="w-4 h-4" />
                계좌 관리
              </Link>
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem 
              className="text-loss focus:text-loss"
              onClick={() => signOut()}
            >
              <LogOut className="w-4 h-4 mr-2" />
              로그아웃
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </header>
  );
}

function NavButton({ 
  href, 
  children, 
  active = false 
}: { 
  href: string; 
  children: React.ReactNode; 
  active?: boolean;
}) {
  return (
    <Link
      href={href}
      className={`px-3 py-1.5 rounded-lg text-sm font-medium transition-colors ${
        active 
          ? 'bg-primary/10 text-primary' 
          : 'text-muted-foreground hover:text-foreground hover:bg-accent'
      }`}
    >
      {children}
    </Link>
  );
}
