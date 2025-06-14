import React, { useState } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StatusBar,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import { router } from 'expo-router';

import {
  AuthGuard,
  ScreenLayout,
  FeedContainer,
  CardLayout,
} from '@/src/components';
import { notificationsAPI } from '@/src/services/api';
import { Notification } from '@/src/types';
import { notificationStyles, colors } from '@/src/styles';
import { useDialog } from '@/src/contexts/DialogContext';

interface NotificationCardProps {
  notification: Notification;
  isSelected: boolean;
  selectMode: boolean;
  onPress: (notification: Notification) => void;
  onToggleSelect: (notificationId: string) => void;
  onMarkAsUnread: (notificationId: string) => void;
  onDelete: (notificationId: string) => void;
}

const NotificationCard: React.FC<NotificationCardProps> = ({
  notification,
  isSelected,
  selectMode,
  onPress,
  onToggleSelect,
  onMarkAsUnread,
  onDelete,
}) => {
  const { showConfirm } = useDialog();
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffMs = now.getTime() - date.getTime();
    const diffMins = Math.floor(diffMs / (1000 * 60));
    const diffHours = Math.floor(diffMs / (1000 * 60 * 60));
    const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24));

    if (diffMins < 60) {
      return `${diffMins}m ago`;
    } else if (diffHours < 24) {
      return `${diffHours}h ago`;
    } else if (diffDays < 7) {
      return `${diffDays}d ago`;
    } else {
      return date.toLocaleDateString();
    }
  };

  const getNotificationIcon = () => {
    if (notification.message.includes('liked')) {
      return <Ionicons name="heart" size={20} color="#ef4444" />;
    } else if (notification.message.includes('commented')) {
      return <Ionicons name="chatbubble" size={20} color="#6366f1" />;
    } else if (notification.message.includes('following')) {
      return <Ionicons name="person-add" size={20} color="#10b981" />;
    } else if (notification.message.includes('mentioned')) {
      return <Ionicons name="at" size={20} color="#f59e0b" />;
    } else {
      return <Ionicons name="notifications" size={20} color="#9ca3af" />;
    }
  };

  return (
    <CardLayout>
      <View style={[
        notificationStyles.notificationCard,
        !notification.is_read && notificationStyles.unreadNotification,
        isSelected && notificationStyles.selectedNotification
      ]}>
        {selectMode && (
          <TouchableOpacity 
            onPress={() => onToggleSelect(notification.id)}
            style={notificationStyles.checkboxContainer}
          >
            <View style={[
              notificationStyles.checkbox,
              isSelected && notificationStyles.checkboxSelected
            ]}>
              {isSelected && (
                <Ionicons name="checkmark" size={16} color="#ffffff" />
              )}
            </View>
          </TouchableOpacity>
        )}

        <TouchableOpacity
          style={notificationStyles.notificationContent}
          onPress={() => selectMode ? onToggleSelect(notification.id) : onPress(notification)}
        >
          <View style={notificationStyles.notificationHeader}>
            <View style={notificationStyles.notificationIcon}>
              {getNotificationIcon()}
            </View>
            {!notification.is_read && (
              <View style={notificationStyles.unreadDot} />
            )}
          </View>
          
          <Text style={notificationStyles.notificationMessage}>
            {notification.message}
          </Text>
          
          <Text style={notificationStyles.notificationTime}>
            {formatDate(notification.created_at)}
          </Text>
        </TouchableOpacity>

        {!selectMode && (
          <View style={notificationStyles.notificationActions}>
            {notification.is_read ? (
              <TouchableOpacity
                onPress={() => onMarkAsUnread(notification.id)}
                style={notificationStyles.actionButton}
              >
                <Ionicons name="radio-button-off" size={16} color="#6366f1" />
              </TouchableOpacity>
            ) : (
              <TouchableOpacity
                onPress={() => onPress(notification)}
                style={notificationStyles.actionButton}
              >
                <Ionicons name="checkmark" size={16} color="#10b981" />
              </TouchableOpacity>
            )}
            
            <TouchableOpacity
              onPress={() => {
                showConfirm(
                  'Delete Notification',
                  'Are you sure you want to delete this notification?',
                  () => onDelete(notification.id),
                  undefined,
                  'Delete',
                  'Cancel',
                  'destructive'
                );
              }}
              style={notificationStyles.actionButton}
            >
              <Ionicons name="trash-outline" size={16} color="#9ca3af" />
            </TouchableOpacity>
          </View>
        )}
      </View>
    </CardLayout>
  );
};

export default function NotificationsScreen() {
  const queryClient = useQueryClient();
  const { showAlert, showConfirm } = useDialog();
  const [selectedNotifications, setSelectedNotifications] = useState<string[]>([]);
  const [selectMode, setSelectMode] = useState(false);

  const {
    data: notificationsData,
    isLoading,
    error,
    refetch,
  } = useQuery({
    queryKey: ['notifications'],
    queryFn: () => notificationsAPI.getNotifications(),
    staleTime: 1000 * 60 * 2, // 2 minutes
  });

  const { data: unreadCountData } = useQuery({
    queryKey: ['notifications', 'unread-count'],
    queryFn: () => notificationsAPI.getUnreadCount(),
    staleTime: 1000 * 30, // 30 seconds
  });

  const handleNotificationPress = async (notification: Notification) => {
    try {
      // Mark as read if not already read
      if (!notification.is_read) {
        await notificationsAPI.markAsRead(notification.id);
        queryClient.invalidateQueries({ queryKey: ['notifications'] });
        queryClient.invalidateQueries({ queryKey: ['notifications', 'unread-count'] });
      }

      // Navigate to the link if it exists
      if (notification.link) {
        if (notification.link.includes('/post/')) {
          const postId = notification.link.split('/post/')[1];
          router.push(`/post/${postId}` as any);
        } else if (notification.link.includes('/blog/')) {
          const blogId = notification.link.split('/blog/')[1];
          router.push(`/blog/${blogId}` as any);
        } else if (notification.link.includes('/@')) {
          const userId = notification.link.split('/@')[1];
          router.push(`/profile/${userId}` as any);
        }
      }
    } catch (error) {
      console.error('Error handling notification press:', error);
    }
  };

  const handleMarkAllAsRead = async () => {
    try {
      await notificationsAPI.markAllAsRead();
      queryClient.invalidateQueries({ queryKey: ['notifications'] });
      queryClient.invalidateQueries({ queryKey: ['notifications', 'unread-count'] });
    } catch (error) {
      console.error('Error marking all as read:', error);
      showAlert('Error', 'Failed to mark all notifications as read');
    }
  };

  const handleMarkAsUnread = async (notificationId: string) => {
    try {
      await notificationsAPI.markAsUnread(notificationId);
      queryClient.invalidateQueries({ queryKey: ['notifications'] });
      queryClient.invalidateQueries({ queryKey: ['notifications', 'unread-count'] });
    } catch (error) {
      console.error('Error marking as unread:', error);
      showAlert('Error', 'Failed to mark notification as unread');
    }
  };

  const handleBulkAction = async (action: 'mark_read' | 'mark_unread' | 'delete') => {
    if (selectedNotifications.length === 0) {
      showAlert('No Selection', 'Please select notifications first');
      return;
    }

    try {
      await notificationsAPI.bulkAction(action, selectedNotifications);
      setSelectedNotifications([]);
      setSelectMode(false);
      queryClient.invalidateQueries({ queryKey: ['notifications'] });
      queryClient.invalidateQueries({ queryKey: ['notifications', 'unread-count'] });
      
      const actionText = action === 'mark_read' ? 'marked as read' : 
                        action === 'mark_unread' ? 'marked as unread' : 'deleted';
      showAlert('Success', `${selectedNotifications.length} notifications ${actionText}`);
    } catch (error) {
      console.error('Error with bulk action:', error);
      showAlert('Error', 'Failed to perform bulk action');
    }
  };

  const toggleSelectMode = () => {
    setSelectMode(!selectMode);
    setSelectedNotifications([]);
  };

  const toggleSelectNotification = (notificationId: string) => {
    setSelectedNotifications(prev => 
      prev.includes(notificationId) 
        ? prev.filter(id => id !== notificationId)
        : [...prev, notificationId]
    );
  };

  const selectAllNotifications = () => {
    if (selectedNotifications.length === notifications.length) {
      setSelectedNotifications([]);
    } else {
      setSelectedNotifications(notifications.map(n => n.id));
    }
  };

  const handleDeleteNotification = async (notificationId: string) => {
    try {
      await notificationsAPI.deleteNotification(notificationId);
      queryClient.invalidateQueries({ queryKey: ['notifications'] });
      queryClient.invalidateQueries({ queryKey: ['notifications', 'unread-count'] });
    } catch (error) {
      console.error('Error deleting notification:', error);
      showAlert('Error', 'Failed to delete notification');
    }
  };

  const notifications = notificationsData?.data || [];
  const unreadCount = unreadCountData?.unread_count || 0;

  // Custom header component for notifications
  const notificationHeader = (
    <View style={notificationStyles.customHeader}>
      <View style={notificationStyles.headerLeft}>
        <Text style={notificationStyles.headerTitle}>Notifications</Text>
        {unreadCount > 0 && (
          <View style={notificationStyles.unreadBadge}>
            <Text style={notificationStyles.unreadBadgeText}>{unreadCount}</Text>
          </View>
        )}
      </View>
      <View style={notificationStyles.headerActions}>
        {notifications.length > 0 && (
          <TouchableOpacity onPress={toggleSelectMode} style={notificationStyles.selectButton}>
            <Text style={notificationStyles.selectButtonText}>
              {selectMode ? 'Cancel' : 'Select'}
            </Text>
          </TouchableOpacity>
        )}
        {unreadCount > 0 && !selectMode && (
          <TouchableOpacity onPress={handleMarkAllAsRead} style={notificationStyles.markAllButton}>
            <Text style={notificationStyles.markAllText}>Mark all read</Text>
          </TouchableOpacity>
        )}
      </View>
    </View>
  );

  // Bulk actions component
  const bulkActionsComponent = selectMode && (
    <View style={notificationStyles.bulkActionsBar}>
      <View style={notificationStyles.bulkActionsLeft}>
        <TouchableOpacity onPress={selectAllNotifications} style={notificationStyles.selectAllButton}>
          <Text style={notificationStyles.selectAllText}>
            {selectedNotifications.length === notifications.length ? 'Deselect All' : 'Select All'}
          </Text>
        </TouchableOpacity>
        <Text style={notificationStyles.selectedCount}>
          {selectedNotifications.length} selected
        </Text>
      </View>
      <View style={notificationStyles.bulkActionsRight}>
        <TouchableOpacity 
          onPress={() => handleBulkAction('mark_read')} 
          style={[notificationStyles.bulkActionButton, notificationStyles.readButton]}
          disabled={selectedNotifications.length === 0}
        >
          <Ionicons name="checkmark" size={16} color="#10b981" />
          <Text style={notificationStyles.bulkActionText}>Read</Text>
        </TouchableOpacity>
        <TouchableOpacity 
          onPress={() => handleBulkAction('mark_unread')} 
          style={[notificationStyles.bulkActionButton, notificationStyles.unreadButton]}
          disabled={selectedNotifications.length === 0}
        >
          <Ionicons name="radio-button-off" size={16} color="#6366f1" />
          <Text style={notificationStyles.bulkActionText}>Unread</Text>
        </TouchableOpacity>
        <TouchableOpacity 
          onPress={() => handleBulkAction('delete')} 
          style={[notificationStyles.bulkActionButton, notificationStyles.deleteButton]}
          disabled={selectedNotifications.length === 0}
        >
          <Ionicons name="trash" size={16} color="#ef4444" />
          <Text style={notificationStyles.bulkActionText}>Delete</Text>
        </TouchableOpacity>
      </View>
    </View>
  );

  return (
    <AuthGuard>
      <StatusBar barStyle="light-content" backgroundColor={colors.background.primary} />
      
      <ScreenLayout scrollable onRefresh={refetch}>
        {notificationHeader}
        {bulkActionsComponent}
        
        <FeedContainer
          data={notifications}
          isLoading={isLoading}
          error={error}
          renderItem={(notification: Notification) => (
            <NotificationCard
              key={notification.id}
              notification={notification}
              isSelected={selectedNotifications.includes(notification.id)}
              selectMode={selectMode}
              onPress={handleNotificationPress}
              onToggleSelect={toggleSelectNotification}
              onMarkAsUnread={handleMarkAsUnread}
              onDelete={handleDeleteNotification}
            />
          )}
          emptyTitle="No notifications"
          emptySubtitle="You'll see notifications here when you have them"
          loadingMessage="Loading notifications..."
          spacing={8}
        />
      </ScreenLayout>
    </AuthGuard>
  );
}
