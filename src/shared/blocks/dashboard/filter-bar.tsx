'use client';

import { useState, useEffect } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { Search, RotateCcw, Loader2 } from 'lucide-react';
import { Input } from '@/shared/components/ui/input';
import { Button } from '@/shared/components/ui/button';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/shared/components/ui/select';

export function FilterBar({
  searchPlaceholder,
  statusOptions,
  statusPlaceholder,
  searchTitle,
  resetTitle,
  statusParamName = 'status',
}: {
  searchPlaceholder?: string;
  statusOptions: { label: string; value: string }[];
  statusPlaceholder?: string;
  searchTitle: string;
  resetTitle: string;
  statusParamName?: string;
}) {
  const router = useRouter();
  const searchParams = useSearchParams();

  const [query, setQuery] = useState(searchParams.get('q') || '');
  const [status, setStatus] = useState(searchParams.get(statusParamName) || 'all');
  const [isLoading, setIsLoading] = useState(false);

  // When searchParams changes, we know the navigation is complete
  useEffect(() => {
    setIsLoading(false);
  }, [searchParams]);

  useEffect(() => {
    setStatus(searchParams.get(statusParamName) || 'all');
  }, [searchParams, statusParamName]);

  const onSearch = () => {
    setIsLoading(true);
    const params = new URLSearchParams(searchParams.toString());
    
    // Set query
    if (query.trim()) {
      params.set('q', query.trim());
    } else {
      params.delete('q');
    }

    // Set status
    if (status && status !== 'all') {
      params.set(statusParamName, status);
    } else {
      params.delete(statusParamName);
    }
    
    // Reset to first page when filtering
    params.set('page', '1');
    
    router.push(`?${params.toString()}`);
  };

  const onReset = () => {
    setQuery('');
    setStatus('all');
    router.push('?');
  };

  return (
    <div className="flex flex-wrap items-center gap-3 mb-6">
      <div className="flex items-center gap-2">
        <Input
          className="w-[200px] sm:w-[300px]"
          placeholder={searchPlaceholder}
          value={query}
          disabled={isLoading}
          onChange={(e) => setQuery(e.target.value)}
          onKeyDown={(e) => e.key === 'Enter' && !isLoading && onSearch()}
        />
        <Select value={status} onValueChange={setStatus} disabled={isLoading}>
          <SelectTrigger className="w-[140px]">
            <SelectValue placeholder={statusPlaceholder} />
          </SelectTrigger>
          <SelectContent>
            {statusOptions.map((opt) => (
              <SelectItem key={opt.value} value={opt.value}>
                {opt.label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>
      <div className="flex items-center gap-2">
        <Button onClick={onSearch} className="gap-2" disabled={isLoading}>
          {isLoading ? (
            <Loader2 className="w-4 h-4 animate-spin" />
          ) : (
            <Search className="w-4 h-4" />
          )}
          {searchTitle}
        </Button>
        <Button 
          variant="outline" 
          onClick={onReset} 
          className="gap-2 text-muted-foreground"
          disabled={isLoading}
        >
          <RotateCcw className="w-4 h-4" />
          {resetTitle}
        </Button>
      </div>
    </div>
  );
}
