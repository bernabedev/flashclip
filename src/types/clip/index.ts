export interface ClipDataToSave {
  title: string;
  url: string;
  thumbnailUrl?: string;
  authorName?: string;
  duration?: number;
  size?: number;
  width?: number;
  height?: number;
  isPublic?: boolean;
}

export interface ClipData extends ClipDataToSave {
  id: string;
  createdAt: Date;
  updatedAt: Date;
}
