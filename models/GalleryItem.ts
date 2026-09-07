import mongoose, { Schema, Document } from 'mongoose';
import { GALLERY_CATEGORIES } from '@/lib/gallery';

export interface IGalleryItem extends Document {
  type: 'image' | 'video';
  publicId: string;
  url: string;
  caption: string;
  category: string;
  createdAt: Date;
  updatedAt: Date;
}

const GalleryItemSchema = new Schema<IGalleryItem>(
  {
    type:     { type: String, enum: ['image', 'video'], required: true },
    publicId: { type: String, required: true },
    url:      { type: String, required: true },
    caption:  { type: String, default: '' },
    category: { type: String, enum: GALLERY_CATEGORIES, default: 'Events' },
  },
  { timestamps: true }
);

export default mongoose.models.GalleryItem || mongoose.model<IGalleryItem>('GalleryItem', GalleryItemSchema);
