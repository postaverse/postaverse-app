export interface User {
  id: string;
  name?: string;
  handle?: string;
  email?: string;
  profile_photo_url?: string;
  bio?: string;
  website?: string;
  admin_rank?: number;
  followers_count?: number;
  following_count?: number;
  posts_count?: number;
  is_following?: boolean;
  two_factor_confirmed_at?: string | null;
  created_at?: string;
  updated_at?: string;
}

export interface Post {
  id: string;
  title: string;
  content: string;
  has_profanity: boolean;
  user_id: string;
  user?: User;
  likes?: Like[];
  likes_count: number;
  comments?: Comment[];
  comments_count: number;
  images?: PostImage[];
  created_at: string;
  updated_at: string;
}

export interface Blog {
  id: string;
  title: string;
  content: string;
  has_profanity?: boolean;
  user_id: string;
  user?: User;
  likes?: BlogLike[];
  likes_count: number;
  comments?: BlogComment[];
  comments_count: number;
  images?: BlogImage[];
  liked_by_user?: boolean;
  created_at: string;
  updated_at: string;
}

export interface Comment {
  id: string;
  content: string;
  has_profanity: boolean;
  user_id: string;
  post_id: string;
  parent_id?: string;
  user?: User;
  post?: Post;
  replies?: Comment[];
  created_at: string;
  updated_at: string;
}

export interface BlogComment {
  id: string;
  content: string;
  has_profanity?: boolean;
  user_id: string;
  blog_id: string;
  parent_id?: string;
  user?: User;
  blog?: Blog;
  replies?: BlogComment[];
  created_at: string;
  updated_at: string;
}

export interface Like {
  id: string;
  user_id: string;
  post_id: string;
  user: User;
  post: Post;
  created_at: string;
  updated_at: string;
}

export interface BlogLike {
  id: string;
  user_id: string;
  blog_id: string;
  user: User;
  blog: Blog;
  created_at: string;
  updated_at: string;
}

export interface PostImage {
  id: string;
  url: string;
  path: string;
  filename: string;
  post_id: string;
  created_at: string;
  updated_at: string;
}

export interface BlogImage {
  id: string;
  url: string;
  path: string;
  filename: string;
  blog_id: string;
  created_at: string;
  updated_at: string;
}

export interface Notification {
  id: string;
  user_id: string;
  message: string;
  link: string;
  is_read: boolean;
  created_at: string;
  updated_at: string;
}

export interface AuthUser {
  user: User;
  token: string;
}

export interface LoginCredentials {
  login: string;
  password: string;
  code?: string; // 2FA code
}

export interface RegisterCredentials {
  name: string;
  handle: string;
  email: string;
  password: string;
  password_confirmation: string;
}

export interface TwoFactorChallenge {
  two_factor: boolean;
  recovery: boolean;
}

export interface TwoFactorSetupData {
  qr_code: string;
  secret_key: string;
  recovery_codes: string[];
}

export interface TwoFactorConfirmData {
  code: string;
}

export interface CreatePostData {
  title: string;
  content: string;
  images?: string[];
}

export interface CreateBlogData {
  title: string;
  content: string;
  images?: string[];
}

export interface UpdateProfileData {
  name?: string;
  handle?: string;
  bio?: string;
}
