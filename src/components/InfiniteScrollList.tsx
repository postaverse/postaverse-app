import React from 'react';
import {
  FlatList,
  RefreshControl,
  ActivityIndicator,
  View,
  Text,
  ListRenderItem,
  ListRenderItemInfo,
} from 'react-native';
import { LoadingState, ErrorState, EmptyState } from './StateComponents';
import { colors, spacing, fontSize } from '@/src/styles';

interface InfiniteScrollListProps<T> {
  data: T[];
  renderItem: ListRenderItem<T>;
  isLoading: boolean;
  error: any;
  refreshing: boolean;
  onRefresh: () => void;
  onLoadMore: () => void;
  onEagerLoad?: (currentIndex: number, totalItems: number) => void;
  isFetchingNextPage: boolean;
  hasNextPage: boolean;
  emptyTitle: string;
  emptySubtitle?: string;
  loadingMessage?: string;
  keyExtractor?: (item: T, index: number) => string;
  contentContainerStyle?: any;
  style?: any;
  showsVerticalScrollIndicator?: boolean;
  estimatedItemSize?: number;
  ListHeaderComponent?: React.ComponentType<any> | React.ReactElement | null;
}

const LoadMoreIndicator = () => (
  <View style={{
    paddingVertical: spacing.lg,
    alignItems: 'center',
  }}>
    <ActivityIndicator size="small" color={colors.accent.primary} />
    <Text style={{
      marginTop: spacing.sm,
      fontSize: fontSize.sm,
      color: colors.text.tertiary,
    }}>
      Loading more...
    </Text>
  </View>
);

const EagerLoadingIndicator = () => (
  <View style={{
    paddingVertical: spacing.sm,
    alignItems: 'center',
  }}>
    <ActivityIndicator size="small" color={colors.accent.secondary} />
    <Text style={{
      marginTop: spacing.xs,
      fontSize: fontSize.xs,
      color: colors.text.quaternary,
    }}>
      Preparing more content...
    </Text>
  </View>
);

const EndOfListIndicator = () => (
  <View style={{
    paddingVertical: spacing.lg,
    alignItems: 'center',
  }}>
    <Text style={{
      fontSize: fontSize.sm,
      color: colors.text.quaternary,
    }}>
      You've reached the end
    </Text>
  </View>
);

export function InfiniteScrollList<T extends { id: string }>({
  data,
  renderItem,
  isLoading,
  error,
  refreshing,
  onRefresh,
  onLoadMore,
  onEagerLoad,
  isFetchingNextPage,
  hasNextPage,
  emptyTitle,
  emptySubtitle,
  loadingMessage = 'Loading...',
  keyExtractor,
  contentContainerStyle = { padding: spacing.md },
  style = { flex: 1 },
  showsVerticalScrollIndicator = false,
  ListHeaderComponent,
}: InfiniteScrollListProps<T>) {
  // Handle initial loading state
  if (isLoading && data.length === 0) {
    return <LoadingState message={loadingMessage} />;
  }

  // Handle error state
  if (error && data.length === 0) {
    return (
      <ErrorState 
        message="Failed to load content"
        onRetry={onRefresh}
        retryText="Try again"
      />
    );
  }

  // Handle empty state
  if (!isLoading && data.length === 0) {
    return <EmptyState title={emptyTitle} subtitle={emptySubtitle} />;
  }

  const handleLoadMore = () => {
    if (hasNextPage && !isFetchingNextPage) {
      onLoadMore();
    }
  };


  const enhancedRenderItem = (info: ListRenderItemInfo<T>) => {
    const { item, index } = info;
    
    // Trigger eager loading when we're getting close to the end
    if (onEagerLoad && index > 0 && index % 5 === 0) { // Check every 5 items
      onEagerLoad(index, data.length);
    }
    return renderItem(info);
  };

  const renderFooter = () => {
    if (isFetchingNextPage) {
      return <LoadMoreIndicator />;
    }
    
    // Show eager loading indicator when we have content and more pages available
    if (hasNextPage && data.length > 10) {
      return <EagerLoadingIndicator />;
    }
    
    if (!hasNextPage && data.length > 0) {
      return <EndOfListIndicator />;
    }
    
    return null;
  };

  const defaultKeyExtractor = (item: T, index: number) => {
    // Ensure we always have a stable, unique key
    if (item.id) {
      return item.id.toString();
    }
    // If no id, create a stable key using index and some item property
    return `item-${index}-${JSON.stringify(item).slice(0, 20)}`;
  };

  return (
    <FlatList
      data={data}
      renderItem={onEagerLoad ? enhancedRenderItem : renderItem}
      keyExtractor={keyExtractor || defaultKeyExtractor}
      style={style}
      contentContainerStyle={contentContainerStyle}
      showsVerticalScrollIndicator={showsVerticalScrollIndicator}
      ListHeaderComponent={ListHeaderComponent}
      refreshControl={
        <RefreshControl
          refreshing={refreshing}
          onRefresh={onRefresh}
          tintColor={colors.accent.primary}
          colors={[colors.accent.primary]}
        />
      }
      onEndReached={handleLoadMore}
      onEndReachedThreshold={0.5}
      ListFooterComponent={renderFooter}
      removeClippedSubviews={false}
      maxToRenderPerBatch={8}
      updateCellsBatchingPeriod={50}
      initialNumToRender={15}
      windowSize={8}
     
      maintainVisibleContentPosition={{
        minIndexForVisible: 0,
        autoscrollToTopThreshold: 10,
      }}
     
      onMomentumScrollBegin={() => {
       
        if (hasNextPage && !isFetchingNextPage && data.length > 10) {
          handleLoadMore();
        }
      }}
      onScrollBeginDrag={() => {
       
        if (hasNextPage && !isFetchingNextPage && data.length > 5) {
          setTimeout(() => handleLoadMore(), 100);
        }
      }}
    />
  );
}
