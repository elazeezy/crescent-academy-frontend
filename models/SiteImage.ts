import mongoose, { Schema, Document } from 'mongoose';

export interface ISiteImage extends Document {
  zoneId: string;
  zoneName: string;
  publicId: string;    // Cloudinary public_id for deletion/replacement
  url: string;         // Cloudinary secure_url
  updatedAt: Date;
}

const SiteImageSchema = new Schema<ISiteImage>(
  {
    zoneId:   { type: String, required: true, unique: true },
    zoneName: { type: String, required: true },
    publicId: { type: String, default: '' },
    url:      { type: String, default: '' },
  },
  { timestamps: true }
);

export default mongoose.models.SiteImage ||
  mongoose.model<ISiteImage>('SiteImage', SiteImageSchema);
