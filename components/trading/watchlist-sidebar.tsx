'use client';

import { useState, useMemo } from 'react';
import { useTradingStore } from '@/lib/stores/trading-store';
import { usePriceFormatter } from '@/hooks/use-market-data';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { 
  KRX_STOCKS, 
  US_STOCKS, 
  CRYPTO_LIST 
} from '@/lib/services/market-data';
import { Search, Star, TrendingUp, TrendingDown, Plus } from 'lucide-react';
import type { MarketType } from '@/types/trading';

interface StockItemProps {
  symbol: string;
  name: string;
  market: MarketType;
  onClick: () => void;
  isSelected: boolean;
}

function StockItem({ symbol, name, market, onClick, isSelected }: StockItemProps) {
  const tickers = useTradingStore((state) => state.tickers);
  const ticker = tickers[symbol];
  const { formatPrice, formatChange } = usePriceFormatter();

  const price = ticker?.price || 0;
  const changePercent = ticker?.changePercent || 0;
  const isPositive = changePercent >= 0;

  return (
    <button
      onClick={onClick}
      className={`w-full p-3 text-left transition-colors ${
        isSelected 
          ? 'bg-primary/10 border-l-2 border-primary' 
          : 'hover:bg-accent border-l-2 border-transparent'
      }`}
    >
      <div className="flex items-center justify-between">
        <div className="min-w-0 flex-1">
          <div className="flex items-center gap-2">
            <span className="font-medium text-sm truncate">{name}</span>
          </div>
          <span className="text-xs text-muted-foreground">{symbol}</span>
        </div>
        <div className="text-right ml-2">
          <div className="font-mono text-sm font-medium">
            {formatPrice(price, market)}
          </div>
          <div className={`flex items-center justify-end gap-0.5 text-xs font-medium ${
            isPositive ? 'text-gain' : 'text-loss'
          }`}>
            {isPositive ? (
              <TrendingUp className="w-3 h-3" />
            ) : (
              <TrendingDown className="w-3 h-3" />
            )}
            {formatChange(ticker?.change || 0, changePercent)}
          </div>
        </div>
      </div>
    </button>
  );
}

export function WatchlistSidebar() {
  const { 
    selectedSymbol, 
    setSelectedSymbol, 
    sidebarOpen,
  } = useTradingStore();
  
  const [searchQuery, setSearchQuery] = useState('');
  const [activeTab, setActiveTab] = useState<'krx' | 'us' | 'crypto'>('krx');

  // 검색 필터링
  const filteredStocks = useMemo(() => {
    const stocks = 
      activeTab === 'krx' ? KRX_STOCKS :
      activeTab === 'us' ? US_STOCKS :
      CRYPTO_LIST;
    
    if (!searchQuery) return stocks;
    
    const query = searchQuery.toLowerCase();
    return stocks.filter(
      stock => 
        stock.symbol.toLowerCase().includes(query) ||
        stock.name.toLowerCase().includes(query)
    );
  }, [activeTab, searchQuery]);

  if (!sidebarOpen) return null;

  return (
    <aside className="w-72 border-r border-border bg-card flex flex-col shrink-0">
      {/* 검색 */}
      <div className="p-3 border-b border-border">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
          <Input
            placeholder="종목 검색..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-9 bg-input/50 h-9"
          />
        </div>
      </div>

      {/* 마켓 탭 */}
      <Tabs value={activeTab} onValueChange={(v) => setActiveTab(v as typeof activeTab)} className="flex-1 flex flex-col">
        <TabsList className="w-full h-10 rounded-none border-b border-border bg-transparent p-0">
          <TabsTrigger 
            value="krx" 
            className="flex-1 rounded-none border-b-2 border-transparent data-[state=active]:border-primary data-[state=active]:bg-transparent"
          >
            한국
          </TabsTrigger>
          <TabsTrigger 
            value="us"
            className="flex-1 rounded-none border-b-2 border-transparent data-[state=active]:border-primary data-[state=active]:bg-transparent"
          >
            미국
          </TabsTrigger>
          <TabsTrigger 
            value="crypto"
            className="flex-1 rounded-none border-b-2 border-transparent data-[state=active]:border-primary data-[state=active]:bg-transparent"
          >
            코인
          </TabsTrigger>
        </TabsList>

        <ScrollArea className="flex-1">
          <TabsContent value="krx" className="m-0">
            <div className="divide-y divide-border/50">
              {filteredStocks.map((stock) => (
                <StockItem
                  key={stock.symbol}
                  symbol={stock.symbol}
                  name={stock.name}
                  market={stock.market}
                  onClick={() => setSelectedSymbol(stock.symbol, stock.market)}
                  isSelected={selectedSymbol === stock.symbol}
                />
              ))}
            </div>
          </TabsContent>
          
          <TabsContent value="us" className="m-0">
            <div className="divide-y divide-border/50">
              {filteredStocks.map((stock) => (
                <StockItem
                  key={stock.symbol}
                  symbol={stock.symbol}
                  name={stock.name}
                  market={stock.market}
                  onClick={() => setSelectedSymbol(stock.symbol, stock.market)}
                  isSelected={selectedSymbol === stock.symbol}
                />
              ))}
            </div>
          </TabsContent>
          
          <TabsContent value="crypto" className="m-0">
            <div className="divide-y divide-border/50">
              {filteredStocks.map((stock) => (
                <StockItem
                  key={stock.symbol}
                  symbol={stock.symbol}
                  name={stock.name}
                  market={stock.market}
                  onClick={() => setSelectedSymbol(stock.symbol, stock.market)}
                  isSelected={selectedSymbol === stock.symbol}
                />
              ))}
            </div>
          </TabsContent>
        </ScrollArea>
      </Tabs>

      {/* 관심종목 추가 버튼 */}
      <div className="p-3 border-t border-border">
        <Button variant="outline" size="sm" className="w-full gap-2">
          <Plus className="w-4 h-4" />
          관심종목 추가
        </Button>
      </div>
    </aside>
  );
}
