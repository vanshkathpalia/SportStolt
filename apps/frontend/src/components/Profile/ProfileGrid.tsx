import React from 'react';
import { FullView } from './FullView';

interface ProfileGridProps {
  isLoading?: boolean;
}

export const ProfileGrid: React.FC<ProfileGridProps> = ({ isLoading }) => {
  if (isLoading) {
    return (
      <div className="grid grid-cols-3 gap-2">
        {[...Array(6)].map((_, i) => (
          <div key={i} className="aspect-square bg-gray-200 animate-pulse w-96 h-96" />
        ))}
      </div>
    );
  }

  const posts = [
    'https://images.unsplash.com/photo-1469474968028-56623f02e42e',
    'https://images.unsplash.com/photo-1682687220742-aba13b6e50ba',
    'https://images.unsplash.com/photo-1610147323479-a7fb11ffd5dd',
    'https://images.unsplash.com/photo-1682695796954-bad0d0f59ff1',
    'https://images.unsplash.com/photo-1682687221248-3116ba6ab483',
    'https://images.unsplash.com/photo-1475924156734-496f6cac6ec1',
  ].map(url => `${url}?w=600&h=600&fit=crop`);

  return (
    <div className="grid grid-cols-3 gap-1">
      {posts.map((post, index) => <FullView 
          post = {post}
          index = {index}
      />)}
    </div>
  );
};