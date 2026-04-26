'use client';

import { useState, useMemo } from 'react';
import { useTradingStore, useSelectedTicker } from '@/lib/stores/trading-store';
import { usePriceFormatter } from '@/hooks/use-market-data';
import { getCurrencySymbol } from '@/lib/services/market-data';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Field, FieldGroup, FieldLabel } from '@/components/ui/field';
import { Slider } from '@/components/ui/slider';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { AlertCircle, Calculator, Info } from 'lucide-react';
import type { OrderType, OrderSide } from '@/types/trading';

const ORDER_TYPES: { value: OrderType; label: string }[] = [
  { value: 'limit', label: '지정가' },
  { value: 'market', label: '시장가' },
  { value: 'stop', label: '스탑' },
  { value: 'stop_limit', label: '스탑지정가' },
];

export function OrderPanel() {
  const { selectedSymbol, selectedMarket, orderPanelOpen } = useTradingStore();
  const ticker = useSelectedTicker();
  const { formatPrice } = usePriceFormatter();

  const [side, setSide] = useState<OrderSide>('buy');
  const [orderType, setOrderType] = useState<OrderType>('limit');
  const [price, setPrice] = useState<string>('');
  const [quantity, setQuantity] = useState<string>('');
  const [stopPrice, setStopPrice] = useState<string>('');
  const [quantityPercent, setQuantityPercent] = useState<number[]>([0]);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // 가격이 비어있으면 현재가로 설정
  const effectivePrice = useMemo(() => {
    if (orderType === 'market') return ticker?.price || 0;
    return parseFloat(price) || ticker?.price || 0;
  }, [price, ticker?.price, orderType]);

  // 총 주문 금액 계산
  const totalValue = useMemo(() => {
    const qty = parseFloat(quantity) || 0;
    return effectivePrice * qty;
  }, [effectivePrice, quantity]);

  // 수수료 계산 (베타: 기본 수수료율 사용)
  const commission = useMemo(() => {
    const rate = selectedMarket === 'krx' ? 0.00015 : 
                 selectedMarket === 'crypto' ? 0.001 : 0.0025;
    return totalValue * rate;
  }, [totalValue, selectedMarket]);

  // 주문 제출
  async function handleSubmit() {
    if (!selectedSymbol || !selectedMarket) return;
    
    const qty = parseFloat(quantity);
    if (!qty || qty <= 0) return;
    
    if (orderType !== 'market' && (!effectivePrice || effectivePrice <= 0)) return;
    
    setIsSubmitting(true);
    
    // TODO: 실제 주문 API 연동
    // 현재는 시뮬레이션만 수행
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    alert(`주문이 제출되었습니다!\n\n종목: ${selectedSymbol}\n${side === 'buy' ? '매수' : '매도'} ${quantity}주\n가격: ${effectivePrice}\n총액: ${totalValue.toLocaleString()}`);
    
    setIsSubmitting(false);
    setQuantity('');
    setPrice('');
  }

  if (!orderPanelOpen) return null;

  if (!selectedSymbol) {
    return (
      <Card className="w-80 bg-card/50 border-border/50">
        <CardHeader className="py-3 px-4">
          <CardTitle className="text-sm font-medium">주문</CardTitle>
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
  const isKrx = selectedMarket === 'krx';

  return (
    <Card className="w-80 bg-card/50 border-border/50 flex flex-col">
      <CardHeader className="py-3 px-4 border-b border-border/50 shrink-0">
        <CardTitle className="text-sm font-medium flex items-center justify-between">
          <span>주문</span>
          <span className="text-xs text-muted-foreground font-normal">
            {ticker?.name || selectedSymbol}
          </span>
        </CardTitle>
      </CardHeader>

      <CardContent className="p-4 flex-1 flex flex-col">
        {/* 매수/매도 탭 */}
        <Tabs value={side} onValueChange={(v) => setSide(v as OrderSide)} className="w-full">
          <TabsList className="w-full h-10 mb-4">
            <TabsTrigger 
              value="buy" 
              className="flex-1 data-[state=active]:bg-gain data-[state=active]:text-white"
            >
              매수
            </TabsTrigger>
            <TabsTrigger 
              value="sell"
              className="flex-1 data-[state=active]:bg-loss data-[state=active]:text-white"
            >
              매도
            </TabsTrigger>
          </TabsList>

          <div className="space-y-4">
            {/* 주문 유형 */}
            <Field>
              <FieldLabel>주문 유형</FieldLabel>
              <Select value={orderType} onValueChange={(v) => setOrderType(v as OrderType)}>
                <SelectTrigger className="bg-input/50">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {ORDER_TYPES.map(type => (
                    <SelectItem key={type.value} value={type.value}>
                      {type.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </Field>

            {/* 가격 (시장가 제외) */}
            {orderType !== 'market' && (
              <Field>
                <FieldLabel className="flex items-center justify-between">
                  <span>가격</span>
                  <button 
                    type="button"
                    className="text-xs text-primary hover:underline"
                    onClick={() => setPrice(ticker?.price?.toString() || '')}
                  >
                    현재가
                  </button>
                </FieldLabel>
                <div className="relative">
                  <Input
                    type="number"
                    value={price}
                    onChange={(e) => setPrice(e.target.value)}
                    placeholder={formatPrice(ticker?.price || 0, selectedMarket || 'krx')}
                    className="bg-input/50 pr-8 font-mono"
                  />
                  <span className="absolute right-3 top-1/2 -translate-y-1/2 text-xs text-muted-foreground">
                    {currency}
                  </span>
                </div>
              </Field>
            )}

            {/* 스탑 가격 */}
            {(orderType === 'stop' || orderType === 'stop_limit') && (
              <Field>
                <FieldLabel>스탑 가격</FieldLabel>
                <div className="relative">
                  <Input
                    type="number"
                    value={stopPrice}
                    onChange={(e) => setStopPrice(e.target.value)}
                    placeholder="스탑 트리거 가격"
                    className="bg-input/50 pr-8 font-mono"
                  />
                  <span className="absolute right-3 top-1/2 -translate-y-1/2 text-xs text-muted-foreground">
                    {currency}
                  </span>
                </div>
              </Field>
            )}

            {/* 수량 */}
            <Field>
              <FieldLabel>수량</FieldLabel>
              <div className="relative">
                <Input
                  type="number"
                  value={quantity}
                  onChange={(e) => setQuantity(e.target.value)}
                  placeholder="0"
                  className="bg-input/50 pr-8 font-mono"
                />
                <span className="absolute right-3 top-1/2 -translate-y-1/2 text-xs text-muted-foreground">
                  {isKrx ? '주' : selectedMarket === 'crypto' ? '' : '주'}
                </span>
              </div>
            </Field>

            {/* 수량 슬라이더 */}
            <div className="space-y-2">
              <Slider
                value={quantityPercent}
                onValueChange={setQuantityPercent}
                max={100}
                step={25}
                className="w-full"
              />
              <div className="flex justify-between text-xs text-muted-foreground">
                <button onClick={() => setQuantityPercent([0])}>0%</button>
                <button onClick={() => setQuantityPercent([25])}>25%</button>
                <button onClick={() => setQuantityPercent([50])}>50%</button>
                <button onClick={() => setQuantityPercent([75])}>75%</button>
                <button onClick={() => setQuantityPercent([100])}>100%</button>
              </div>
            </div>

            {/* 주문 요약 */}
            <div className="p-3 rounded-lg bg-muted/30 space-y-2">
              <div className="flex justify-between text-sm">
                <span className="text-muted-foreground">주문금액</span>
                <span className="font-mono">
                  {currency}{totalValue.toLocaleString(undefined, { 
                    maximumFractionDigits: isKrx ? 0 : 2 
                  })}
                </span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-muted-foreground flex items-center gap-1">
                  수수료
                  <Info className="w-3 h-3" />
                </span>
                <span className="font-mono text-muted-foreground">
                  {currency}{commission.toLocaleString(undefined, { 
                    maximumFractionDigits: isKrx ? 0 : 2 
                  })}
                </span>
              </div>
              <div className="border-t border-border/50 pt-2 flex justify-between text-sm font-medium">
                <span>총 {side === 'buy' ? '결제금액' : '수령금액'}</span>
                <span className="font-mono">
                  {currency}{(side === 'buy' ? totalValue + commission : totalValue - commission).toLocaleString(undefined, { 
                    maximumFractionDigits: isKrx ? 0 : 2 
                  })}
                </span>
              </div>
            </div>

            {/* 주문 버튼 */}
            <Button
              className={`w-full h-12 text-base font-medium ${
                side === 'buy' 
                  ? 'bg-gain hover:bg-gain/90' 
                  : 'bg-loss hover:bg-loss/90'
              }`}
              disabled={isSubmitting || !quantity || parseFloat(quantity) <= 0}
              onClick={handleSubmit}
            >
              {isSubmitting ? '주문 처리중...' : side === 'buy' ? '매수' : '매도'}
            </Button>

            {/* 경고 메시지 */}
            <div className="flex items-start gap-2 p-2 rounded bg-warning/10 text-warning text-xs">
              <AlertCircle className="w-4 h-4 shrink-0 mt-0.5" />
              <span>
                투자에는 원금 손실의 위험이 있습니다. 
                신중하게 투자 결정을 내려주세요.
              </span>
            </div>
          </div>
        </Tabs>
      </CardContent>
    </Card>
  );
}
