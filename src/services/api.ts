import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {
  User,
  Post,
  Blog,
  Comment,
  BlogComment,
  Notification,
  AuthUser,
  LoginCredentials,
  RegisterCredentials,
  CreatePostData,
  CreateBlogData,
  UpdateProfileData,
  TwoFactorChallenge,
  TwoFactorSetupData,
  TwoFactorConfirmData,
} from '../types';

const IS_DEV = 0; // 1 for development, 0 for production

const BASE_URL = IS_DEV 
  ? 'http://localhost:8000/api'
  : 'https://postaverse.net/api';

// Create axios instance
const api = axios.create({
  baseURL: BASE_URL,
  headers: {
    'Content-Type': 'application/json',
    'Accept': 'application/json',
  },
});

// Request interceptor to add auth token
api.interceptors.request.use(
  async (config) => {
    const token = await AsyncStorage.getItem('auth_token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response interceptor to handle auth errors
api.interceptors.response.use(
  (response) => response,
  async (error) => {
    if (error.response?.status === 401) {
      await AsyncStorage.removeItem('auth_token');
      await AsyncStorage.removeItem('user');
    }
    return Promise.reject(error);
  }
);

// Auth API
export const authAPI = {
  login: async (credentials: LoginCredentials): Promise<AuthUser | TwoFactorChallenge> => {
    const response = await api.post('/login', credentials);
    
    // Check if 2FA challenge is required
    if (response.data.two_factor || response.data.recovery) {
      // Store credentials temporarily for 2FA challenge submission
      await AsyncStorage.setItem('temp_credentials', JSON.stringify(credentials));
      
      return {
        two_factor: response.data.two_factor || false,
        recovery: response.data.recovery || false,
      };
    }
    
    const { user, token } = response.data;
    
    // Store token and user data
    await AsyncStorage.setItem('auth_token', token);
    await AsyncStorage.setItem('user', JSON.stringify(user));
    
    return { user, token };
  },

  register: async (credentials: RegisterCredentials): Promise<AuthUser> => {
    const response = await api.post('/register', credentials);
    const { user, token } = response.data;
    
    // Store token and user data
    await AsyncStorage.setItem('auth_token', token);
    await AsyncStorage.setItem('user', JSON.stringify(user));
    
    return { user, token };
  },

  logout: async (): Promise<void> => {
    await api.post('/logout');
    await AsyncStorage.removeItem('auth_token');
    await AsyncStorage.removeItem('user');
  },

  me: async (): Promise<User> => {
    const response = await api.get('/me');
    return response.data;
  },

  updateProfile: async (data: UpdateProfileData): Promise<User> => {
    const response = await api.put('/profile', data);
    return response.data;
  },

  // Check if user is authenticated
  isAuthenticated: async (): Promise<boolean> => {
    const token = await AsyncStorage.getItem('auth_token');
    return !!token;
  },

  // Get stored user
  getStoredUser: async (): Promise<User | null> => {
    const userData = await AsyncStorage.getItem('user');
    return userData ? JSON.parse(userData) : null;
  },

  // Two-Factor Authentication methods
  setupTwoFactor: async (): Promise<TwoFactorSetupData> => {
    const response = await api.post('/user/two-factor-authentication');
    return response.data;
  },

  confirmTwoFactor: async (data: TwoFactorConfirmData): Promise<void> => {
    await api.post('/user/confirmed-two-factor-authentication', data);
  },

  disableTwoFactor: async (): Promise<void> => {
    await api.delete('/user/two-factor-authentication');
  },

  generateRecoveryCodes: async (): Promise<{ recovery_codes: string[] }> => {
    const response = await api.post('/user/two-factor-recovery-codes');
    return response.data;
  },

  // Submit two-factor challenge
  submitTwoFactorChallenge: async (data: { code?: string; recovery_code?: string; login?: string; password?: string }): Promise<AuthUser> => {
    // For 2FA challenge, we need to re-submit the login with the 2FA code
    const storedCredentials = await AsyncStorage.getItem('temp_credentials');
    if (!storedCredentials) {
      throw new Error('No stored credentials for 2FA challenge');
    }
    
    const credentials = JSON.parse(storedCredentials);
    const response = await api.post('/login', {
      ...credentials,
      code: data.code || data.recovery_code,
    });
    
    const { user, token } = response.data;
    
    // Store token and user data
    await AsyncStorage.setItem('auth_token', token);
    await AsyncStorage.setItem('user', JSON.stringify(user));
    
    // Clear temporary credentials
    await AsyncStorage.removeItem('temp_credentials');
    
    return { user, token };
  },
};

// Posts API
export const postsAPI = {
  getFeed: async (page = 1): Promise<{ data: Post[]; meta: any }> => {
    const response = await api.get(`/feed?page=${page}`);
    return response.data;
  },

  getPosts: async (page = 1): Promise<{ data: Post[]; meta: any }> => {
    const response = await api.get(`/posts?page=${page}`);
    return response.data;
  },

  getPost: async (id: string): Promise<Post> => {
    const response = await api.get(`/posts/${id}`);
    return response.data.data || response.data;
  },

  createPost: async (data: CreatePostData): Promise<Post> => {
    const response = await api.post('/posts', data);
    return response.data;
  },

  updatePost: async (id: string, data: Partial<CreatePostData>): Promise<Post> => {
    const response = await api.put(`/posts/${id}`, data);
    return response.data;
  },

  deletePost: async (id: string): Promise<void> => {
    await api.delete(`/posts/${id}`);
  },

  toggleLike: async (id: string): Promise<{ liked: boolean; likes_count: number }> => {
    const response = await api.post(`/posts/${id}/like`);
    return response.data;
  },
};

// Blogs API
export const blogsAPI = {
  getBlogs: async (page = 1): Promise<{ data: Blog[]; meta: any }> => {
    const response = await api.get(`/blogs?page=${page}`);
    return response.data;
  },

  getBlog: async (id: string): Promise<Blog> => {
    const response = await api.get(`/blogs/${id}`);
    return response.data.data || response.data;
  },

  createBlog: async (data: CreateBlogData): Promise<Blog> => {
    const response = await api.post('/blogs', data);
    return response.data.data || response.data;
  },

  updateBlog: async (id: string, data: Partial<CreateBlogData>): Promise<Blog> => {
    const response = await api.put(`/blogs/${id}`, data);
    return response.data.data || response.data;
  },

  deleteBlog: async (id: string): Promise<void> => {
    await api.delete(`/blogs/${id}`);
  },

  toggleLike: async (id: string): Promise<{ liked: boolean; likes_count: number }> => {
    const response = await api.post(`/blogs/${id}/like`);
    return response.data;
  },
};

// Comments API
export const commentsAPI = {
  createPostComment: async (postId: string, content: string, parentId?: string): Promise<Comment> => {
    const response = await api.post(`/posts/${postId}/comments`, { 
      content,
      parent_id: parentId 
    });
    return response.data.comment || response.data;
  },

  createBlogComment: async (blogId: string, content: string, parentId?: string): Promise<BlogComment> => {
    const response = await api.post(`/blogs/${blogId}/comments`, { 
      content,
      parent_id: parentId 
    });
    return response.data.comment || response.data;
  },

  updateComment: async (id: string, content: string): Promise<Comment | BlogComment> => {
    const response = await api.put(`/comments/${id}`, { content });
    return response.data.data || response.data;
  },

  deleteComment: async (id: string): Promise<void> => {
    try {
      const response = await api.delete(`/comments/${id}`);
    } catch (error: any) {
      console.error('API: Error in deleteComment:', error);
      console.error('API: Error response:', error.response);
      throw error;
    }
  },
};

// Users API
export const usersAPI = {
  getUsers: async (page = 1): Promise<{ data: User[]; meta: any }> => {
    const response = await api.get(`/users?page=${page}`);
    return response.data;
  },

  getUser: async (id: string): Promise<User> => {
    const response = await api.get(`/users/${id}`);
    return response.data.data || response.data;
  },

  toggleFollow: async (id: string): Promise<{ following: boolean }> => {
    const response = await api.post(`/users/${id}/follow`);
    return response.data;
  },

  getFollowers: async (id: string, page = 1): Promise<{ data: User[]; meta: any }> => {
    const response = await api.get(`/users/${id}/followers?page=${page}`);
    return response.data;
  },

  getFollowing: async (id: string, page = 1): Promise<{ data: User[]; meta: any }> => {
    const response = await api.get(`/users/${id}/following?page=${page}`);
    return response.data;
  },

  getUserPosts: async (id: string, page = 1): Promise<{ data: Post[]; meta: any }> => {
    const response = await api.get(`/users/${id}/posts?page=${page}`);
    return response.data;
  },

  getUserBlogs: async (id: string, page = 1): Promise<{ data: Blog[]; meta: any }> => {
    const response = await api.get(`/users/${id}/blogs?page=${page}`);
    return response.data;
  },
};

// Search API
export const searchAPI = {
  search: async (query: string): Promise<{ users: User[]; posts: Post[]; blogs: Blog[] }> => {
    const response = await api.get(`/search?q=${encodeURIComponent(query)}`);
    // Handle the Laravel API response format which wraps arrays in {data: [...]}
    return {
      users: response.data.users?.data || [],
      posts: response.data.posts?.data || [],
      blogs: response.data.blogs?.data || [],
    };
  },

  searchUsers: async (query: string): Promise<User[]> => {
    const response = await api.get(`/search/users?q=${encodeURIComponent(query)}`);
    return response.data.data || response.data;
  },

  searchPosts: async (query: string): Promise<Post[]> => {
    const response = await api.get(`/search/posts?q=${encodeURIComponent(query)}`);
    return response.data.data || response.data;
  },

  searchBlogs: async (query: string): Promise<Blog[]> => {
    const response = await api.get(`/search/blogs?q=${encodeURIComponent(query)}`);
    return response.data.data || response.data;
  },
};

// Notifications API
export const notificationsAPI = {
  getNotifications: async (page = 1): Promise<{ data: Notification[]; meta: any }> => {
    const response = await api.get(`/notifications?page=${page}`);
    return response.data;
  },

  getUnreadCount: async (): Promise<{ unread_count: number }> => {
    const response = await api.get('/notifications/unread-count');
    return response.data;
  },

  markAsRead: async (id: string): Promise<void> => {
    await api.put(`/notifications/${id}/read`);
  },

  markAsUnread: async (id: string): Promise<void> => {
    await api.put(`/notifications/${id}/unread`);
  },

  markAllAsRead: async (): Promise<void> => {
    await api.put('/notifications/read-all');
  },

  bulkAction: async (action: 'mark_read' | 'mark_unread' | 'delete', notificationIds: string[]): Promise<void> => {
    await api.post('/notifications/bulk-action', {
      action,
      notification_ids: notificationIds
    });
  },

  deleteNotification: async (id: string): Promise<void> => {
    await api.delete(`/notifications/${id}`);
  },
};

// User blocking API
export const blockingAPI = {
  getBlockedUsers: async (): Promise<{ data: User[] }> => {
    const response = await api.get('/users/blocked');
    return response.data;
  },

  blockUser: async (userId: string): Promise<{ message: string }> => {
    const response = await api.post(`/users/${userId}/block`);
    return response.data;
  },

  unblockUser: async (userId: string): Promise<{ message: string }> => {
    const response = await api.delete(`/users/${userId}/block`);
    return response.data;
  },
};

// Security API
export const securityAPI = {
  // Password management
  updatePassword: async (data: { current_password: string; password: string; password_confirmation: string }): Promise<{ message: string }> => {
    const response = await api.put('/user/password', data);
    return response.data;
  },

  // Two-factor authentication
  enableTwoFactor: async (): Promise<{ qr_code: string; secret_key: string; recovery_codes: string[] }> => {
    const response = await api.post('/user/two-factor-authentication');
    return response.data;
  },

  confirmTwoFactor: async (code: string): Promise<{ message: string }> => {
    const response = await api.post('/user/confirmed-two-factor-authentication', { code });
    return response.data;
  },

  disableTwoFactor: async (): Promise<{ message: string }> => {
    const response = await api.delete('/user/two-factor-authentication');
    return response.data;
  },

  getRecoveryCodes: async (): Promise<{ recovery_codes: string[] }> => {
    const response = await api.get('/user/two-factor-recovery-codes');
    return response.data;
  },

  regenerateRecoveryCodes: async (): Promise<{ recovery_codes: string[] }> => {
    const response = await api.post('/user/two-factor-recovery-codes');
    return response.data;
  },

  // Browser sessions
  getBrowserSessions: async (): Promise<{ sessions: any[] }> => {
    const response = await api.get('/user/sessions');
    return response.data;
  },

  logoutOtherSessions: async (password: string): Promise<{ message: string }> => {
    const response = await api.delete('/user/other-browser-sessions', { data: { password } });
    return response.data;
  },

  // Account deletion
  deleteAccount: async (password: string): Promise<{ message: string }> => {
    const response = await api.delete('/user', { data: { password } });
    return response.data;
  },
};

// Connected accounts API (if Socialstream is configured)
export const connectedAccountsAPI = {
  getConnectedAccounts: async (): Promise<{ connected_accounts: any[] }> => {
    const response = await api.get('/user/connected-accounts');
    return response.data;
  },

  removeConnectedAccount: async (accountId: string): Promise<{ message: string }> => {
    const response = await api.delete(`/user/connected-accounts/${accountId}`);
    return response.data;
  },
};

export default api;
