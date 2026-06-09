import crypto from 'crypto';

type AnyRecord = Record<string, unknown>;

const HASH_BYTES = 64;

export interface PublicUser {
  _id: string;
  name: string;
  email: string;
  phone: string;
  location: string;
  latitude?: number | null;
  longitude?: number | null;
  joinDate: string;
  rating: number;
  avatarUrl?: string;
  bio?: string;
  favoriteCategories?: string[];
  portfolioPhotos?: string[];
  offerDetails?: Array<{
    title: string;
    description: string;
    badge?: string;
    active?: boolean;
  }>;
}

export function hashPassword(password: string) {
  const salt = crypto.randomBytes(16).toString('hex');
  const hash = crypto.scryptSync(password, salt, HASH_BYTES).toString('hex');
  return `${salt}:${hash}`;
}

export function verifyPassword(password: string, storedPassword: string) {
  const [salt, storedHash] = storedPassword.split(':');

  if (!salt || !storedHash) {
    return false;
  }

  const derivedHash = crypto.scryptSync(password, salt, HASH_BYTES);
  const storedBuffer = Buffer.from(storedHash, 'hex');

  if (storedBuffer.length !== derivedHash.length) {
    return false;
  }

  return crypto.timingSafeEqual(storedBuffer, derivedHash);
}

export function toPublicUser(user: AnyRecord): PublicUser {
  const source = typeof user?.toObject === 'function' ? user.toObject() : user;
  const record = source as AnyRecord;

  const asString = (value: unknown, fallback = '') => (typeof value === 'string' ? value : fallback);
  const asNumber = (value: unknown, fallback = 0) => (typeof value === 'number' ? value : fallback);
  const asStringArray = (value: unknown) =>
    Array.isArray(value) ? value.filter((item): item is string => typeof item === 'string') : [];

  return {
    _id: record._id?.toString?.() ?? String(record._id ?? ''),
    name: asString(record.name),
    email: asString(record.email),
    phone: asString(record.phone),
    location: asString(record.location),
    latitude: typeof record.latitude === 'number' ? record.latitude : null,
    longitude: typeof record.longitude === 'number' ? record.longitude : null,
    joinDate: record.joinDate ? new Date(record.joinDate as string | number | Date).toISOString() : new Date().toISOString(),
    rating: asNumber(record.rating),
    avatarUrl: asString(record.avatarUrl),
    bio: asString(record.bio),
    favoriteCategories: asStringArray(record.favoriteCategories),
    portfolioPhotos: asStringArray(record.portfolioPhotos),
    offerDetails: Array.isArray(record.offerDetails)
      ? record.offerDetails.map((offer) => {
          const offerRecord = offer as Record<string, unknown>;
          return {
            title: asString(offerRecord.title),
            description: asString(offerRecord.description),
            badge: asString(offerRecord.badge),
            active: typeof offerRecord.active === 'boolean' ? offerRecord.active : true,
          };
        })
      : [],
  };
}
