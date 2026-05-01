import dbConnect from './dbConnect';
import SiteImage from '@/models/SiteImage';

export type SiteImageMap = Record<string, string>; // zoneId → url

/**
 * Server-side helper: fetch all site image URLs keyed by zoneId.
 * Falls back gracefully — missing zones return empty string.
 */
export async function getSiteImages(): Promise<SiteImageMap> {
  try {
    await dbConnect();
    const images = await SiteImage.find({}).lean() as any[];
    const map: SiteImageMap = {};
    for (const img of images) {
      if (img.zoneId && img.url) map[img.zoneId] = img.url;
    }
    return map;
  } catch {
    return {};
  }
}
