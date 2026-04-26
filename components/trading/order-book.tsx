'use client';

import { useMemo } from 'react';
import { useTradingStore, useSelectedTicker } from '@/lib/stores/trading-store';
import { usePriceFormatter } from '@/hooks/use-market-data';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { ScrollArea } from '@/components/ui/scroll-area';
import { getCurrencySymbol } from '@/lib/services/market-data';

export function OrderBook() {
  const { orderBook, selectedSymbol, selectedMarket } = useTradingStore();
  const ticker = useSelectedTicker();
  const { formatPrice, formatVolume } = usePriceFormatter();

  // 최대 수량 계산 (바 그래프용)
  const maxQuantity = useMemo(() => {
    if (!orderBook) return 0;
    const allQuantities = [
      ...orderBook.asks.map(a => a.quantity),
      ...orderBook.bids.map(b => b.quantity),
    ];
    return Math.max(...allQuantities, 1);
  }, [orderBook]);

  if (!selectedSymbol || !orderBook) {
    return (
      <Card className="w-64 bg-card/50 border-border/50">
        <CardHeader className="py-3 px-4">
          <CardTitle className="text-sm font-medium">호가</CardTitle>
        </CardHeader>
        <CardContent className="px-4 pb-4">
          <div className="text-center text-muted-foreground text-sm py-8">
            종목을 선택해주세요
          </div>
        </CardContent>
      </Card>
    );
  }

  const currency = getCurrencySymbol(selectedMarket || 'krx');
  const isPositive = (ticker?.changePercent || 0) >= 0;

  return (
    <Card className="w-64 bg-card/50 border-border/50 flex flex-col">
      <CardHeader className="py-3 px-4 border-b border-border/50 shrink-0">
        <CardTitle className="text-sm font-medium flex items-center justify-between">
          <span>호가</span>
          <span className="text-xs text-muted-foreground font-normal">
            {selectedSymbol}
          </span>
        </CardTitle>
      </CardHeader>
      
      <div className="flex-1 flex flex-col min-h-0">
        {/* 헤더 */}
        <div className="grid grid-cols-2 text-xs text-muted-foreground px-4 py-2 border-b border-border/30">
          <span>가격</span>
          <span className="text-right">수량</span>
        </div>

        {/* 매도호가 (위에서 아래로, 높은 가격부터) */}
        <ScrollArea className="flex-1">
          <div className="divide-y divide-border/20">
            {orderBook.asks.slice().reverse().map((ask, index) => (
              <div key={`ask-${index}`} className="relative px-4 py-1.5 hover:bg-loss/5 cursor-pointer">
                {/* 배경 바 */}
                <div 
                  className="absolute inset-y-0 right-0 bg-loss/10"
                  style={{ width: `${(ask.quantity / maxQuantity) * 100}%` }}
                />
                <div className="relative grid grid-cols-2 items-center">
                  <span className="font-mono text-sm text-loss">
                    {formatPrice(ask.price, selectedMarket || 'krx')}
                  </span>
                  <span className="font-mono text-xs text-right text-muted-foreground">
                    {formatVolume(ask.quantity)}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </ScrollArea>

        {/* 현재가 */}
        <div className={`py-2 px-4 border-y border-border/50 ${
          isPositive ? 'bg-gain/10' : 'bg-loss/10'
        }`}>
          <div className="flex items-center justify-between">
            <span className={`text-lg font-bold font-mono ${
              isPositive ? 'text-gain' : 'text-loss'
            }`}>
              {currency}{formatPrice(ticker?.price || 0, selectedMarket || 'krx')}
            </span>
            <span className={`text-xs font-medium ${
              isPositive ? 'text-gain' : 'text-loss'
            }`}>
              {isPositive ? '+' : ''}{ticker?.changePercent?.toFixed(2)}%
            </span>
          </div>
        </div>

        {/* 매수호가 (위에서 아래로, 높은 가격부터) */}
        <ScrollArea className="flex-1">
          <div className="divide-y divide-border/20">
            {orderBook.bids.map((bid, index) => (
              <div key={`bid-${index}`} className="relative px-4 py-1.5 hover:bg-gain/5 cursor-pointer">
                {/* 배경 바 */}
                <div 
                  className="absolute inset-y-0 right-0 bg-gain/10"
                  style={{ width: `${(bid.quantity / maxQuantity) * 100}%` }}
                />
                <div className="relative grid grid-cols-2 items-center">
                  <span className="font-mono text-sm text-gain">
                    {formatPrice(bid.price, selectedMarket || 'krx')}
                  </span>
                  <span className="font-mono text-xs text-right text-muted-foreground">
                    {formatVolume(bid.quantity)}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </ScrollArea>
      </div>

      {/* 총량 요약 */}
      <div className="px-4 py-2 border-t border-border/50 shrink-0">
        <div className="grid grid-cols-2 text-xs">
          <div>
            <span className="text-muted-foreground">매도잔량</span>
            <div className="font-mono text-loss">
              {formatVolume(orderBook.asks.reduce((sum, a) => sum + a.quantity, 0))}
            </div>
          </div>
          <div className="text-right">
            <span className="text-muted-foreground">매수잔량</span>
            <div className="font-mono text-gain">
              {formatVolume(orderBook.bids.reduce((sum, b) => sum + b.quantity, 0))}
            </div>
          </div>
        </div>
      </div>
    </Card>
  );
}
