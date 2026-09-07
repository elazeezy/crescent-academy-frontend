import type { GalleryCategory } from '@/lib/gallery';

// Server-only — imports Mongoose models, so this file must only ever be required
// from API routes, never from a client component (unlike lib/gallery.ts).

// Caption/category metadata for the old fixed gallery_1..gallery_20 SiteImage zones,
// used only to migrate them into GalleryItem the first time the new manager loads.
const LEGACY_GALLERY_ZONES: { id: string; category: GalleryCategory; caption: string }[] = [
  { id: 'gallery_1',  category: 'Classroom',        caption: 'Classroom Excellence' },
  { id: 'gallery_2',  category: 'Classroom',        caption: 'Student Life' },
  { id: 'gallery_3',  category: 'Classroom',        caption: 'Learning Together' },
  { id: 'gallery_4',  category: 'Assembly',         caption: 'Morning Assembly' },
  { id: 'gallery_5',  category: 'Assembly',         caption: 'School Gathering' },
  { id: 'gallery_6',  category: 'Sports',           caption: 'Sports Day' },
  { id: 'gallery_7',  category: 'Sports',           caption: 'Athletic Excellence' },
  { id: 'gallery_8',  category: 'Sports',           caption: 'Team Spirit' },
  { id: 'gallery_9',  category: "Qur'anic Studies", caption: "Qur'anic Studies" },
  { id: 'gallery_10', category: "Qur'anic Studies", caption: 'Memorisation Circle' },
  { id: 'gallery_11', category: "Qur'anic Studies", caption: 'Islamic Learning' },
  { id: 'gallery_12', category: 'Science Lab',      caption: 'Science Lab' },
  { id: 'gallery_13', category: 'Science Lab',      caption: 'Practical Science' },
  { id: 'gallery_14', category: 'Awards',           caption: 'Prize Giving Day' },
  { id: 'gallery_15', category: 'Awards',           caption: 'Academic Excellence' },
  { id: 'gallery_16', category: 'Awards',           caption: 'Celebrating Achievement' },
  { id: 'gallery_17', category: 'Events',           caption: 'School Event' },
  { id: 'gallery_18', category: 'Events',           caption: 'Special Occasion' },
  { id: 'gallery_19', category: 'Events',           caption: 'Cultural Celebration' },
  { id: 'gallery_20', category: 'Events',           caption: 'Community Gathering' },
];

// One-time, idempotent import of the old fixed gallery zones into the new GalleryItem
// collection, so photos already uploaded by the school before this feature existed
// don't silently disappear from the public gallery. Only runs while GalleryItem is
// still empty — once the school starts managing the new collection this never fires again.
export async function migrateLegacyGalleryZonesIfNeeded() {
  const { default: GalleryItem } = await import('@/models/GalleryItem');
  const { default: SiteImage } = await import('@/models/SiteImage');

  const alreadyMigrated = await GalleryItem.exists({});
  if (alreadyMigrated) return;

  const legacyIds = LEGACY_GALLERY_ZONES.map((z) => z.id);
  const legacyImages = await SiteImage.find({ zoneId: { $in: legacyIds } }).lean();
  if (legacyImages.length === 0) return;

  const metaById = new Map(LEGACY_GALLERY_ZONES.map((z) => [z.id, z]));
  const docs = legacyImages
    .filter((img: any) => img.url && img.publicId)
    .map((img: any) => {
      const meta = metaById.get(img.zoneId)!;
      return { type: 'image', publicId: img.publicId, url: img.url, caption: meta.caption, category: meta.category };
    });

  if (docs.length > 0) await GalleryItem.insertMany(docs);
}
