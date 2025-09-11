// src/components/ui/Icon.tsx
import React from 'react';
import type { IconBaseProps, IconType } from 'react-icons';

interface IconProps extends IconBaseProps {
  icon: IconType;
  className?: string;
}

const Icon: React.FC<IconProps> = ({ 
  icon: IconComponent, 
  size = 16, 
  className = '', 
  ...props 
}) => {
  const iconElement = IconComponent({ size, className, ...props });
  return iconElement as React.ReactElement;
};

export default Icon;