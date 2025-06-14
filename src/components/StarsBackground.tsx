import React, { useEffect, useRef, useState } from 'react';
import { View, Animated, Dimensions, StyleSheet } from 'react-native';

interface Star {
  id: number;
  x: number;
  y: number;
  size: number;
  opacity: Animated.Value;
  color: string;
  initialOpacity: number;
}

interface StarsBackgroundProps {
  starCount?: number;
}

const { width: screenWidth, height: screenHeight } = Dimensions.get('window');

export const StarsBackground: React.FC<StarsBackgroundProps> = ({ 
  starCount = 250 
}) => {
  const [stars, setStars] = useState<Star[]>([]);
  const animationsRef = useRef<Animated.CompositeAnimation[]>([]);

  const createStar = (id: number): Star => {
    const sizeRand = Math.random();
    let size: number;
    
    if (sizeRand > 0.97) {
      // 3% chance of larger stars
      size = 3 + Math.random() * 1;
    } else if (sizeRand > 0.85) {
      // 12% chance of medium stars
      size = 1.5 + Math.random() * 1;
    } else {
      // 85% chance of small stars
      size = 0.5 + Math.random() * 1;
    }

    // Most stars are white, some have subtle color tints
    let color = '#ffffff';
    if (Math.random() > 0.7) {
      const hue = Math.random() > 0.5 ? 210 : Math.random() > 0.7 ? 45 : 0; // Blue, yellow, or red tint
      const saturation = 50 + Math.random() * 50;
      color = `hsl(${hue}, ${saturation}%, 95%)`;
    }

    const initialOpacity = 0.3 + Math.random() * 0.7; // Random starting opacity

    return {
      id,
      x: Math.random() * screenWidth,
      y: Math.random() * screenHeight,
      size,
      opacity: new Animated.Value(initialOpacity),
      color,
      initialOpacity,
    };
  };

  useEffect(() => {
    // Stop any existing animations
    animationsRef.current.forEach(animation => animation.stop());
    animationsRef.current = [];

    // Create stars
    const newStars = Array.from({ length: starCount }, (_, i) => createStar(i));
    setStars(newStars);

    // Start animations with a small delay to ensure stars are rendered
    const timeoutId = setTimeout(() => {
      newStars.forEach((star, index) => {
        const duration = 1500 + Math.random() * 2500; // 1.5-4 seconds
        const delay = Math.random() * 3000; // 0-3 second initial delay
        
        const createTwinkleAnimation = () => {
          return Animated.loop(
            Animated.sequence([
              Animated.timing(star.opacity, {
                toValue: 0.1,
                duration: duration / 2,
                useNativeDriver: true,
              }),
              Animated.timing(star.opacity, {
                toValue: star.initialOpacity,
                duration: duration / 2,
                useNativeDriver: true,
              }),
            ])
          );
        };

        const animation = Animated.sequence([
          Animated.delay(delay),
          createTwinkleAnimation(),
        ]);

        animationsRef.current.push(animation);
        animation.start();
      });
    }, 100);

    // Handle screen rotation/resize
    const subscription = Dimensions.addEventListener('change', ({ window }) => {
      setStars(prevStars => 
        prevStars.map(star => ({
          ...star,
          x: Math.random() * window.width,
          y: Math.random() * window.height,
        }))
      );
    });

    return () => {
      clearTimeout(timeoutId);
      animationsRef.current.forEach(animation => animation.stop());
      subscription?.remove();
    };
  }, [starCount]);

  return (
    <View style={[styles.container, { pointerEvents: 'none' }]}>
      {stars.map((star) => (
        <Animated.View
          key={star.id}
          style={[
            styles.star,
            {
              left: star.x,
              top: star.y,
              width: star.size,
              height: star.size,
              backgroundColor: star.color,
              opacity: star.opacity,
            },
          ]}
        />
      ))}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    zIndex: 1,
    overflow: 'hidden',
  },
  star: {
    position: 'absolute',
    borderRadius: 1,
    // Use boxShadow for web compatibility
    boxShadow: '0 0 2px rgba(255, 255, 255, 0.8)',
    elevation: 1,
  },
});
