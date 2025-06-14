import { useInfiniteQuery, QueryKey } from '@tanstack/react-query';
import React, { useState, useCallback } from 'react';

interface UseInfiniteScrollOptions<T> {
  queryKey: QueryKey;
  queryFn: (pageParam: number) => Promise<{ data: T[]; meta: any }>;
  enabled?: boolean;
  staleTime?: number;
  getNextPageParam?: (lastPage: { data: T[]; meta: any }, pages: { data: T[]; meta: any }[]) => number | undefined;
}

interface PaginationMeta {
  current_page: number;
  from: number;
  last_page: number;
  per_page: number;
  to: number;
  total: number;
  links?: {
    first: string;
    last: string;
    next?: string;
    prev?: string;
  };
}

export function useInfiniteScroll<T>({
  queryKey,
  queryFn,
  enabled = true,
  staleTime = 1000 * 60 * 5, // 5 minutes
  getNextPageParam,
}: UseInfiniteScrollOptions<T>) {
  const [refreshing, setRefreshing] = useState(false);

  const defaultGetNextPageParam = (lastPage: { data: T[]; meta: PaginationMeta }) => {
    if (lastPage.meta.current_page >= lastPage.meta.last_page) {
      return undefined; // No more pages
    }
    return lastPage.meta.current_page + 1;
  };

  const {
    data,
    error,
    fetchNextPage,
    hasNextPage,
    isFetching,
    isFetchingNextPage,
    status,
    refetch,
  } = useInfiniteQuery({
    queryKey,
    queryFn: ({ pageParam = 1 }) => queryFn(pageParam),
    getNextPageParam: getNextPageParam || defaultGetNextPageParam,
    enabled,
    staleTime: staleTime * 2, // Double stale time for better caching during eager loading
    initialPageParam: 1,
    refetchOnWindowFocus: false, // Prevent unexpected refetches
    refetchOnMount: true,
    refetchOnReconnect: 'always',
    retry: 3, // Retry failed requests up to 3 times
    retryDelay: (attemptIndex) => Math.min(1000 * 2 ** attemptIndex, 30000), // Exponential backoff
    // Enhanced caching for eager loading
    gcTime: 1000 * 60 * 15, // Keep data in cache for 15 minutes
    // Prefetch configuration for smoother experience
    placeholderData: (previousData) => previousData, // Keep showing previous data while loading
    // Network mode optimizations
    networkMode: 'online',
  });

  // Flatten all pages into a single array with deduplication
  const allItems = React.useMemo(() => {
    if (!data?.pages) return [];
    
    const items = data.pages.flatMap(page => page.data || []);
    
    // Deduplicate items by id to prevent duplicates
    const seen = new Set();
    return items.filter(item => {
      const id = (item as any)?.id;
      if (!id) return true; // Keep items without id
      if (seen.has(id)) return false;
      seen.add(id);
      return true;
    });
  }, [data?.pages]);

  // Background prefetching effect
  React.useEffect(() => {
    if (allItems.length > 0 && hasNextPage && !isFetchingNextPage && !isFetching) {
      // Prefetch next page after a short delay when not actively loading
      const prefetchTimer = setTimeout(() => {
        fetchNextPage();
      }, 2000); // Wait 2 seconds before background prefetch

      return () => clearTimeout(prefetchTimer);
    }
  }, [allItems.length, hasNextPage, isFetchingNextPage, isFetching, fetchNextPage]);

  const handleRefresh = useCallback(async () => {
    setRefreshing(true);
    try {
      await refetch();
    } catch (error) {
      console.error('Error refreshing data:', error);
    } finally {
      setRefreshing(false);
    }
  }, [refetch]);

  const handleLoadMore = useCallback(() => {
    if (hasNextPage && !isFetchingNextPage) {
      fetchNextPage();
    }
  }, [hasNextPage, isFetchingNextPage, fetchNextPage]);

  // Eager loading - prefetch next page when user is getting close to the end
  const handleEagerLoad = useCallback((currentIndex: number, totalItems: number) => {
    const threshold = Math.max(10, totalItems * 0.7); // Load when 70% through or 10 items from end
    if (currentIndex >= threshold && hasNextPage && !isFetchingNextPage) {
      fetchNextPage();
    }
  }, [hasNextPage, isFetchingNextPage, fetchNextPage]);

  // Enhanced load more that includes eager loading logic
  const enhancedLoadMore = useCallback(() => {
    // Always try to load more when explicitly called
    if (hasNextPage && !isFetchingNextPage) {
      fetchNextPage();
    }
    
    // Also trigger eager loading for the next page after this one
    setTimeout(() => {
      if (hasNextPage && !isFetchingNextPage) {
        fetchNextPage();
      }
    }, 500); // Small delay to avoid overwhelming the API
  }, [hasNextPage, isFetchingNextPage, fetchNextPage]);

  return {
    data: allItems,
    error,
    isLoading: status === 'pending',
    isFetching,
    isFetchingNextPage,
    hasNextPage,
    refreshing,
    onRefresh: handleRefresh,
    onLoadMore: enhancedLoadMore, // Use enhanced load more for eager loading
    onEagerLoad: handleEagerLoad, // Expose eager loading function
    refetch,
    // Additional properties for debugging
    totalItems: data?.pages.reduce((acc, page) => acc + page.data.length, 0) ?? 0,
    pageCount: data?.pages.length ?? 0,
  };
}
