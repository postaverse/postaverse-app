import React, { useState } from 'react';
import { 
  View, 
  Text, 
  TextInput, 
  TouchableOpacity, 
  StatusBar, 
  ScrollView 
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { Image } from 'expo-image';
import { router } from 'expo-router';
import { useQuery } from '@tanstack/react-query';

import { searchStyles, colors } from '@/src/styles';

import {
  AuthGuard,
  ScreenLayout,
  LoadingState,
  EmptyState,
  CardLayout,
} from '@/src/components';
import { searchAPI } from '@/src/services/api';
import { User, Post, Blog } from '@/src/types';

interface UserCardProps {
  user: User;
  onPress: (userId: string) => void;
}

const UserCard: React.FC<UserCardProps> = ({ user, onPress }) => (
  <TouchableOpacity onPress={() => onPress(user.id)}>
    <CardLayout>
      <View style={searchStyles.userCard}>
        <Image
          source={{ uri: user.profile_photo_url || 'https://via.placeholder.com/40' }}
          style={searchStyles.userAvatar}
        />
        <View style={searchStyles.userInfo}>
          <Text style={searchStyles.userName}>{user.name}</Text>
          <Text style={searchStyles.userHandle}>@{user.handle}</Text>
          {user.bio && <Text style={searchStyles.userBio} numberOfLines={2}>{user.bio}</Text>}
        </View>
        <View style={searchStyles.userStats}>
          <Text style={searchStyles.userStat}>{user.followers_count || 0} followers</Text>
          <Text style={searchStyles.userStat}>{user.posts_count || 0} posts</Text>
        </View>
      </View>
    </CardLayout>
  </TouchableOpacity>
);

interface SearchInputProps {
  value: string;
  onChangeText: (text: string) => void;
  placeholder?: string;
}

const SearchInput: React.FC<SearchInputProps> = ({
  value,
  onChangeText,
  placeholder = "Search users, posts, and blogs...",
}) => (
  <View style={searchStyles.searchContainer}>
    <Ionicons name="search" size={20} color="#9ca3af" style={searchStyles.searchIcon} />
    <TextInput
      style={searchStyles.searchInput}
      value={value}
      onChangeText={onChangeText}
      placeholder={placeholder}
      placeholderTextColor="#9ca3af"
      autoCapitalize="none"
      autoCorrect={false}
    />
    {value.length > 0 && (
      <TouchableOpacity onPress={() => onChangeText('')} style={searchStyles.clearButton}>
        <Ionicons name="close-circle" size={20} color="#9ca3af" />
      </TouchableOpacity>
    )}
  </View>
);

interface TabSelectorProps {
  activeTab: string;
  tabs: { key: string; label: string; count?: number }[];
  onTabChange: (tab: string) => void;
}

const TabSelector: React.FC<TabSelectorProps> = ({ activeTab, tabs, onTabChange }) => (
  <View style={searchStyles.tabContainer}>
    {tabs.map((tab) => (
      <TouchableOpacity
        key={tab.key}
        style={[
          searchStyles.tab,
          activeTab === tab.key && searchStyles.activeTab,
        ]}
        onPress={() => onTabChange(tab.key)}
      >
        <Text style={[
          searchStyles.tabText,
          activeTab === tab.key && searchStyles.activeTabText,
        ]}>
          {tab.label}
          {tab.count !== undefined && ` (${tab.count})`}
        </Text>
      </TouchableOpacity>
    ))}
  </View>
);

export default function SearchScreen() {
  const [query, setQuery] = useState('');
  const [activeTab, setActiveTab] = useState<'all' | 'users' | 'posts' | 'blogs'>('all');

  const {
    data: searchResults,
    isLoading,
    error,
  } = useQuery({
    queryKey: ['search', query],
    queryFn: () => searchAPI.search(query),
    enabled: query.length > 2,
    staleTime: 1000 * 60 * 5, // 5 minutes
  });

  const handleUserPress = (userId: string) => {
    router.push(`/profile/${userId}` as any);
  };

  const handlePostPress = (postId: string) => {
    router.push(`/post/${postId}` as any);
  };

  const handleBlogPress = (blogId: string) => {
    router.push(`/blog/${blogId}` as any);
  };

  const getFilteredData = () => {
    if (!searchResults) return [];
    
    switch (activeTab) {
      case 'users':
        return searchResults.users || [];
      case 'posts':
        return searchResults.posts || [];
      case 'blogs':
        return searchResults.blogs || [];
      default:
        return [
          ...(searchResults.users || []),
          ...(searchResults.posts || []),
          ...(searchResults.blogs || []),
        ];
    }
  };

  const renderSearchItem = (item: any, index: number) => {
    if (item.handle !== undefined) {
      // It's a user
      return (
        <View key={`user-${item.id}-${index}`} style={searchStyles.itemContainer}>
          <UserCard user={item} onPress={handleUserPress} />
        </View>
      );
    } else if (item.user_id !== undefined && item.title !== undefined) {
      // It's a post or blog
      const isPost = item.content && !item.blog_id;
      return (
        <View key={`content-${item.id}-${index}`} style={searchStyles.itemContainer}>
          <TouchableOpacity onPress={() => 
            isPost ? handlePostPress(item.id) : handleBlogPress(item.id)
          }>
            <CardLayout>
              <View style={searchStyles.contentCard}>
                <Text style={searchStyles.contentTitle}>{item.title}</Text>
                <Text style={searchStyles.contentExcerpt} numberOfLines={2}>
                  {item.content}
                </Text>
                <View style={searchStyles.contentMeta}>
                    <Text style={searchStyles.contentAuthor}>
                    by {item.user?.name || 'Unknown'} • @{item.user?.handle || 'unknown'}
                    </Text>
                </View>
              </View>
            </CardLayout>
          </TouchableOpacity>
        </View>
      );
    }
    return null;
  };

  const renderSection = (title: string, data: any[], renderItem: (item: any, index: number) => React.ReactNode) => {
    if (data.length === 0) return null;

    return (
      <View style={searchStyles.sectionContainer}>
        <View style={searchStyles.sectionHeader}>
          <Text style={searchStyles.sectionTitle}>{title}</Text>
          <Text style={searchStyles.sectionCount}>{data.length}</Text>
        </View>
        {data.map((item, index) => renderItem(item, index))}
      </View>
    );
  };

  const tabs = [
    { key: 'all', label: 'All', count: searchResults ? 
      (searchResults.users?.length || 0) + 
      (searchResults.posts?.length || 0) + 
      (searchResults.blogs?.length || 0) : undefined 
    },
    { key: 'users', label: 'Users', count: searchResults?.users?.length },
    { key: 'posts', label: 'Posts', count: searchResults?.posts?.length },
    { key: 'blogs', label: 'Blogs', count: searchResults?.blogs?.length },
  ];

  const filteredData = getFilteredData();

  return (
    <AuthGuard>
      <StatusBar barStyle="light-content" backgroundColor={colors.background.primary} />
      
      <ScreenLayout backgroundColor={colors.background.primary}>
        {/* Header */}
        <View style={searchStyles.header}>
          <Text style={searchStyles.headerTitle}>Search</Text>
        </View>

        {/* Search Input */}
        <View style={searchStyles.searchSection}>
          <SearchInput 
            value={query}
            onChangeText={setQuery}
          />
        </View>

        {/* Tab Selector */}
        {query.length > 2 && (
          <View style={searchStyles.tabSection}>
            <TabSelector
              activeTab={activeTab}
              tabs={tabs}
              onTabChange={(tab) => setActiveTab(tab as any)}
            />
          </View>
        )}

        {/* Content */}
        <ScrollView 
          style={searchStyles.scrollView}
          contentContainerStyle={searchStyles.scrollContent}
          showsVerticalScrollIndicator={false}
        >
          {query.length <= 2 ? (
            <View style={searchStyles.emptyContainer}>
              <EmptyState 
                title="Start searching"
                subtitle="Enter at least 3 characters to search for users, posts, and blogs"
              />
            </View>
          ) : isLoading ? (
            <View style={searchStyles.loadingContainer}>
              <LoadingState message="Searching..." />
            </View>
          ) : error ? (
            <View style={searchStyles.errorContainer}>
              <EmptyState 
                title="Search failed"
                subtitle="Please try again"
              />
            </View>
          ) : (
            <View style={searchStyles.resultsContainer}>
              {activeTab === 'all' ? (
                <>
                  {renderSection('Users', searchResults?.users || [], renderSearchItem)}
                  {(searchResults?.users?.length || 0) > 0 && (searchResults?.posts?.length || 0) > 0 && 
                    <View style={searchStyles.sectionDivider} />}
                  {renderSection('Posts', searchResults?.posts || [], renderSearchItem)}
                  {((searchResults?.users?.length || 0) > 0 || (searchResults?.posts?.length || 0) > 0) && (searchResults?.blogs?.length || 0) > 0 && 
                    <View style={searchStyles.sectionDivider} />}
                  {renderSection('Blogs', searchResults?.blogs || [], renderSearchItem)}
                  {(searchResults?.users?.length || 0) === 0 && 
                   (searchResults?.posts?.length || 0) === 0 && 
                   (searchResults?.blogs?.length || 0) === 0 && (
                    <View style={searchStyles.emptyContainer}>
                      <EmptyState 
                        title="No results found"
                        subtitle="Try different keywords or check your spelling"
                      />
                    </View>
                  )}
                </>
              ) : (
                <>
                  {filteredData.length === 0 ? (
                    <View style={searchStyles.emptyContainer}>
                      <EmptyState 
                        title="No results found"
                        subtitle="Try different keywords or check your spelling"
                      />
                    </View>
                  ) : (
                    filteredData.map((item, index) => renderSearchItem(item, index))
                  )}
                </>
              )}
            </View>
          )}
        </ScrollView>
      </ScreenLayout>
    </AuthGuard>
  );
}
