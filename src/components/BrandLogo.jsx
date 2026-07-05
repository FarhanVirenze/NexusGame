import React from 'react';

const SIZE_CLASSES = {
  sm: 'w-10 h-10',
  md: 'w-11 h-11 md:w-12 md:h-12',
  lg: 'w-12 h-12 md:w-14 md:h-14',
};

export default function BrandLogo({ size = 'md', className = '', withRing = true }) {
  return (
    <img
      src="/images/logonexus.png"
      alt="NexusPay"
      className={`${SIZE_CLASSES[size] ?? SIZE_CLASSES.md} rounded-full object-cover shrink-0 ${
        withRing ? 'ring-2 ring-primary/20 shadow-md shadow-primary/10' : ''
      } ${className}`}
    />
  );
}
