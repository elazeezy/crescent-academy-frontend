// Pure constants only — this file is imported by client components (the public
// Gallery page, the admin gallery manager), so it must never pull in Mongoose or
// any other server-only module. See lib/galleryMigration.ts for the DB-touching side.
export const GALLERY_CATEGORIES = [
  'Classroom',
  'Assembly',
  'Sports',
  "Qur'anic Studies",
  'Science Lab',
  'Awards',
  'Events',
] as const;

export type GalleryCategory = typeof GALLERY_CATEGORIES[number];
