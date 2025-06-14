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
} from '../types';

// Configure your Laravel backend URL here
const BASE_URL = 'http://localhost:8000/api';

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
  login: async (credentials: LoginCredentials): Promise<AuthUser> => {
    const response = await api.post('/login', credentials);
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

export default api;
