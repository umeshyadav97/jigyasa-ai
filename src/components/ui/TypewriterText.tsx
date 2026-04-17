import React, { useState, useEffect } from 'react';
import { Text, TextProps } from 'react-native';

interface TypewriterTextProps extends TextProps {
  text: string;
  delay?: number;
  onTypingEnd?: () => void;
}

export default function TypewriterText({ 
  text, 
  delay = 20, 
  onTypingEnd,
  style, 
  ...props 
}: TypewriterTextProps) {
  const [currentText, setCurrentText] = useState('');
  const [currentIndex, setCurrentIndex] = useState(0);

  useEffect(() => {
    // Reset when text changes
    setCurrentText('');
    setCurrentIndex(0);
  }, [text]);

  useEffect(() => {
    if (currentIndex < text.length) {
      const timeout = setTimeout(() => {
        setCurrentText(prevText => prevText + text[currentIndex]);
        setCurrentIndex(prevIndex => prevIndex + 1);
      }, delay);
      return () => clearTimeout(timeout);
    } else if (currentIndex === text.length && text.length > 0) {
      if (onTypingEnd) onTypingEnd();
    }
  }, [currentIndex, delay, text, onTypingEnd]);

  return <Text style={style} {...props}>{currentText}</Text>;
}
