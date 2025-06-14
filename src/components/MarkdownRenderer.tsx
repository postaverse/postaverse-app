import React from 'react';
import { Text, View, StyleSheet, TextStyle, ViewStyle } from 'react-native';
import Markdown from 'react-native-markdown-display';
import { useColorScheme } from '@/components/useColorScheme';

interface MarkdownRendererProps {
  children: string;
  style?: TextStyle | ViewStyle;
  numberOfLines?: number;
  truncateLength?: number;
  showFullContent?: boolean;
  onSeeMore?: () => void;
  variant?: 'post' | 'blog' | 'bio' | 'comment' | 'default';
}

export const MarkdownRenderer: React.FC<MarkdownRendererProps> = ({
  children,
  style,
  numberOfLines,
  truncateLength,
  showFullContent = true,
  onSeeMore,
  variant = 'default',
}) => {
  const colorScheme = useColorScheme();
  const isDark = colorScheme === 'dark';

  // Sanitize and prepare content
  const sanitizeContent = (content: string): string => {
    if (!content) return '';
    
    // Basic sanitization - remove potentially harmful content
    return content
      .replace(/<script[^>]*>.*?<\/script>/gi, '') // Remove script tags
      .replace(/javascript:/gi, '') // Remove javascript: protocols
      .replace(/on\w+\s*=/gi, '') // Remove event handlers
      .trim();
  };

  const sanitizedContent = sanitizeContent(children);

  // Handle truncation for previews
  const shouldTruncate = !showFullContent && truncateLength && sanitizedContent.length > truncateLength;
  const displayContent = shouldTruncate 
    ? sanitizedContent.substring(0, truncateLength) + '...'
    : sanitizedContent;

  // Define styles based on variant and theme
  const getMarkdownStyles = () => {
    const baseColors = {
      text: isDark ? '#f8fafc' : '#1e293b',
      textSecondary: isDark ? '#cbd5e1' : '#64748b',
      background: isDark ? '#0f172a' : '#ffffff',
      border: isDark ? '#334155' : '#e2e8f0',
      link: '#38bdf8',
      code: isDark ? '#1e293b' : '#f1f5f9',
      blockquote: isDark ? '#374151' : '#f9fafb',
    };

    const variantStyles = {
      post: {
        body: {
          fontSize: 16,
          lineHeight: 24,
          color: baseColors.text,
        },
        paragraph: {
          fontSize: 16,
          lineHeight: 24,
          marginBottom: 12,
          color: baseColors.text,
        },
      },
      blog: {
        body: {
          fontSize: 16,
          lineHeight: 26,
          color: baseColors.text,
        },
        paragraph: {
          fontSize: 16,
          lineHeight: 26,
          marginBottom: 16,
          color: baseColors.text,
        },
        heading1: {
          fontSize: 24,
          fontWeight: '700' as const,
          marginBottom: 16,
          marginTop: 24,
          color: baseColors.text,
        },
        heading2: {
          fontSize: 20,
          fontWeight: '600' as const,
          marginBottom: 12,
          marginTop: 20,
          color: baseColors.text,
        },
        heading3: {
          fontSize: 18,
          fontWeight: '600' as const,
          marginBottom: 8,
          marginTop: 16,
          color: baseColors.text,
        },
      },
      bio: {
        body: {
          fontSize: 14,
          lineHeight: 20,
          color: baseColors.textSecondary,
        },
        paragraph: {
          fontSize: 14,
          lineHeight: 20,
          marginBottom: 8,
          color: baseColors.textSecondary,
        },
      },
      comment: {
        body: {
          fontSize: 14,
          lineHeight: 20,
          color: baseColors.text,
        },
        paragraph: {
          fontSize: 14,
          lineHeight: 20,
          marginBottom: 8,
          color: baseColors.text,
        },
      },
      default: {
        body: {
          fontSize: 16,
          lineHeight: 24,
          color: baseColors.text,
        },
        paragraph: {
          fontSize: 16,
          lineHeight: 24,
          marginBottom: 12,
          color: baseColors.text,
        },
      },
    };

    const baseStyle = variantStyles[variant];

    return {
      ...baseStyle,
      // Common styles for all variants
      strong: {
        fontWeight: '600' as const,
        color: baseColors.text,
      },
      em: {
        fontStyle: 'italic' as const,
        color: baseColors.text,
      },
      link: {
        color: baseColors.link,
        textDecorationLine: 'underline' as const,
      },
      code_inline: {
        backgroundColor: baseColors.code,
        paddingHorizontal: 4,
        paddingVertical: 2,
        borderRadius: 4,
        fontSize: baseStyle.body.fontSize * 0.9,
        fontFamily: 'monospace' as const,
        color: baseColors.text,
      },
      code_block: {
        backgroundColor: baseColors.code,
        padding: 12,
        borderRadius: 8,
        marginVertical: 8,
        borderLeftWidth: 4,
        borderLeftColor: baseColors.link,
      },
      blockquote: {
        backgroundColor: baseColors.blockquote,
        paddingHorizontal: 16,
        paddingVertical: 12,
        borderLeftWidth: 4,
        borderLeftColor: baseColors.link,
        marginVertical: 8,
        borderRadius: 4,
      },
      bullet_list: {
        marginVertical: 8,
      },
      ordered_list: {
        marginVertical: 8,
      },
      list_item: {
        marginBottom: 4,
      },
      hr: {
        backgroundColor: baseColors.border,
        height: 1,
        marginVertical: 16,
      },
    };
  };

  if (!sanitizedContent) {
    return null;
  }

  return (
    <View style={[styles.container, style]}>
      <Markdown style={getMarkdownStyles()}>
        {displayContent}
      </Markdown>
      
      {shouldTruncate && onSeeMore && (
        <Text 
          style={[
            styles.seeMoreText, 
            { color: '#38bdf8' }
          ]} 
          onPress={onSeeMore}
        >
          See more
        </Text>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    // Base container styles
  },      seeMoreText: {
        fontSize: 14,
        fontWeight: '500' as const,
        marginTop: 8,
        textDecorationLine: 'underline' as const,
      },
});

export default MarkdownRenderer;
