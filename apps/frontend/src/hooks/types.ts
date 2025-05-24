export interface PostType {
  id: number;
  title: string;
  content: string;
  createdAt: string;
  _count: {
    likes: number;
    Comment: number;
  };
}
export interface EventType {
  id: number;
  name: string;
  endDate: Date;
  startDate: Date;
  timing: string; // or Date if you want to handle it as a date object
  createdAt: Date;
  city: string;
  stadium: string;
  startTime: Date; // or Date if you want to handle it as a date object
  organisedBy: string;
  description?: string;
  status: 'completed' | 'ongoing' | 'upcoming';
}

export interface SavedType {
  id: number;
  postId: number;
  savedAt: string;
  // or whatever your backend returns for saved posts
}