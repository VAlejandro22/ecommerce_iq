import 'server-only';

// Environment variables (configure in .env.local)
// BACKEND_API_URL=https://backendiq-production.up.railway.app
// STRAPI_TOKEN=xxxx

const API_URL = process.env.BACKEND_API_URL!;
const TOKEN = process.env.STRAPI_TOKEN!;

if (!API_URL) {
  console.warn('[strapi] Missing BACKEND_API_URL env var');
}
if (!TOKEN) {
  console.warn('[strapi] Missing STRAPI_TOKEN env var');
}

interface StrapiImageFormat {
  ext: string; url: string; width: number; height: number; size: number; mime: string;
}
interface StrapiImage {
  id: number;
  documentId: string;
  name: string;
  url: string;
  width: number; height: number; size: number; mime: string;
  formats?: { thumbnail?: StrapiImageFormat; small?: StrapiImageFormat; medium?: StrapiImageFormat; large?: StrapiImageFormat };
}

export interface CollectionDTO {
  id: number;
  documentId: string;
  nombre: string;
  descripcion: string | null;
  precio: number | null;
  fecha_lanzamiento?: string | null;
  imagen?: StrapiImage;
  disenos?: DesignDTO[];
}

export interface DesignDTO {
  id: number;
  documentId: string;
  nombre: string;
  descripcion?: string | null;
  precio: number;
  imagen?: StrapiImage;
  createdAt?: string; // timestamp from Strapi
  coleccion?: {
    documentId: string;
    nombre?: string;
    descripcion?: string | null;
    imagen?: StrapiImage; // when populated with coleccion.imagen
  } | null;
}

export interface NormalizedCollection {
  id: string; // documentId
  name: string;
  description: string | null;
  price?: number | null;
  image: string | null; // best image url
  imageFormats?: StrapiImage['formats'];
  launchDate?: string | null;
}

export interface NormalizedDesign {
  id: string; // documentId
  name: string;
  description: string | null;
  price: number;
  image: string | null;
  imageFormats?: StrapiImage['formats'];
  collectionId?: string;
  collection?: {
    id: string;
    name?: string;
    description?: string | null;
    image?: string | null;
  };
  createdAt?: string;
}

function pickBestImage(img?: StrapiImage): { url: string | null; formats?: StrapiImage['formats'] } {
  if (!img) return { url: null, formats: undefined };
  // Prefer large -> medium -> small -> original
  const url = img.formats?.large?.url || img.formats?.medium?.url || img.formats?.small?.url || img.url || null;
  return { url, formats: img.formats };
}

function isTransientStatus(status?: number) {
  // Retry on common transient HTTP statuses
  return !!status && [408, 425, 429, 500, 502, 503, 504].includes(status);
}

function isTransientError(err: unknown): boolean {
  // Narrow unknown to an object shape with optional fields
  const e = err as { code?: string; name?: string; message?: string; cause?: { code?: string; name?: string } } | null | undefined;
  const code: string | undefined = e?.code ?? e?.cause?.code;
  const name: string | undefined = e?.name ?? e?.cause?.name;
  const message: string | undefined = e?.message;
  // undici/Node fetch timeout and connection resets
  if (code === 'UND_ERR_CONNECT_TIMEOUT' || code === 'ECONNRESET' || code === 'ETIMEDOUT') return true;
  // Generic timeouts
  if (name?.toLowerCase().includes('timeout')) return true;
  if (message?.toLowerCase().includes('timeout')) return true;
  return false;
}

async function fetchWithRetry(url: string, init: RequestInit, { retries = 2, timeoutMs = 6000 }: { retries?: number; timeoutMs?: number }) {
  let lastErr: unknown;
  for (let attempt = 0; attempt <= retries; attempt++) {
    const controller = new AbortController();
    const timer = setTimeout(() => controller.abort(), timeoutMs);
    try {
      const res = await fetch(url, { ...init, signal: controller.signal });
      clearTimeout(timer);
      if (!res.ok) {
        if (isTransientStatus(res.status) && attempt < retries) {
          // small backoff with jitter
          const backoff = 250 * Math.pow(2, attempt) + Math.random() * 150;
          await new Promise(r => setTimeout(r, backoff));
          continue;
        }
        throw new Error(`[strapi] ${res.status} ${res.statusText} fetching ${url}`);
      }
      return res;
    } catch (err) {
      clearTimeout(timer);
      lastErr = err;
      if (attempt < retries && isTransientError(err)) {
        const backoff = 250 * Math.pow(2, attempt) + Math.random() * 150;
        await new Promise(r => setTimeout(r, backoff));
        continue;
      }
      throw err;
    }
  }
  throw lastErr;
}

async function strapiFetch<T>(path: string, query?: string, opts: RequestInit = {}): Promise<T> {
  const url = `${API_URL.replace(/\/$/, '')}${path}${query ? (path.includes('?') ? '&' : '?') + query : ''}`;
  const headers: Record<string, string> = {
    'Content-Type': 'application/json',
    ...(opts.headers as Record<string, string> | undefined),
  };
  if (TOKEN) headers.Authorization = `Bearer ${TOKEN}`;

  const res = await fetchWithRetry(
    url,
    {
      ...opts,
      headers,
      // Basic caching: allow ISR to control revalidate outside
      next: { revalidate: 60 },
    },
    { retries: 2, timeoutMs: 6000 }
  );
  const json = await res.json();
  return json as T;
}

// Collections
export async function fetchCollections() {
  type Resp = { data: CollectionDTO[] } | { data: CollectionDTO };
  try {
    const r = await strapiFetch<Resp>('/api/colecciones', 'populate=imagen');
    const arr = Array.isArray(r.data) ? r.data : [r.data];
    return arr.map(normalizeCollection);
  } catch (err) {
    console.warn('[strapi] fetchCollections failed, returning empty list:', err);
    return [];
  }
}

export async function fetchCollectionsPage(page: number, pageSize: number = 24) {
  if (page < 1) page = 1;
  type Resp = { data: CollectionDTO[]; meta: { pagination: { page: number; pageSize: number; pageCount: number; total: number } } };
  const query = new URLSearchParams();
  query.set('populate', 'imagen');
  query.set('pagination[page]', String(page));
  query.set('pagination[pageSize]', String(pageSize));
  query.set('sort', 'fecha_lanzamiento:desc');
  try {
    const r = await strapiFetch<Resp>('/api/colecciones', query.toString());
    const arr = Array.isArray(r.data) ? r.data : [r.data];
    return {
      collections: arr.map(normalizeCollection),
      pagination: r.meta.pagination,
    };
  } catch (err) {
    console.warn('[strapi] fetchCollectionsPage failed, returning empty page:', err);
    return {
      collections: [],
      pagination: { page, pageSize, pageCount: 1, total: 0 },
    };
  }
}

export async function fetchCollection(documentId: string) {
  type Resp = { data: CollectionDTO };
  const r = await strapiFetch<Resp>(`/api/colecciones/${documentId}`, 'populate[0]=imagen&populate[1]=disenos.imagen');
  const c = normalizeCollection(r.data);
  const designs = (r.data.disenos || []).map(normalizeDesign);
  return { collection: c, designs };
}

// Designs
export async function fetchDesigns() {
  type Resp = { data: DesignDTO[] } | { data: DesignDTO };
  try {
    const r = await strapiFetch<Resp>(
      '/api/disenos',
      'populate[0]=imagen&populate[1]=coleccion&populate[2]=coleccion.imagen'
    );
    const arr = Array.isArray(r.data) ? r.data : [r.data];
    return arr.map(normalizeDesign);
  } catch (err) {
    console.warn('[strapi] fetchDesigns failed, returning empty list:', err);
    return [];
  }
}

// Paginated designs fetch
export async function fetchDesignsPage(page: number, pageSize: number = 24) {
  if (page < 1) page = 1;
  type Resp = { data: DesignDTO[]; meta: { pagination: { page: number; pageSize: number; pageCount: number; total: number } } };
  const query = new URLSearchParams();
  query.set('populate[0]', 'imagen');
  query.set('populate[1]', 'coleccion');
  query.set('populate[2]', 'coleccion.imagen');
  query.set('pagination[page]', String(page));
  query.set('pagination[pageSize]', String(pageSize));
  query.set('sort', 'createdAt:desc');
  try {
    const r = await strapiFetch<Resp>('/api/disenos', query.toString());
    const arr = Array.isArray(r.data) ? r.data : [r.data];
    return {
      designs: arr.map(normalizeDesign),
      pagination: r.meta.pagination,
    };
  } catch (err) {
    console.warn('[strapi] fetchDesignsPage failed, returning empty page:', err);
    return {
      designs: [],
      pagination: { page, pageSize, pageCount: 1, total: 0 },
    };
  }
}

export async function fetchDesign(documentId: string) {
  type Resp = { data: DesignDTO };
  const r = await strapiFetch<Resp>(
    `/api/disenos/${documentId}`,
    'populate[0]=imagen&populate[1]=coleccion&populate[2]=coleccion.imagen'
  );
  return normalizeDesign(r.data);
}

// Normalizers
export function normalizeCollection(c: CollectionDTO): NormalizedCollection {
  const { url, formats } = pickBestImage(c.imagen);
  return {
    id: c.documentId,
    name: c.nombre,
    description: c.descripcion || null,
    price: c.precio ?? null,
    image: url,
    imageFormats: formats,
    launchDate: c.fecha_lanzamiento || null,
  };
}

// Helper: fetch collections with designs (for home trending by latest launch date)
export async function fetchCollectionsWithDesigns() {
  type Resp = { data: CollectionDTO[] } | { data: CollectionDTO };
  try {
    const r = await strapiFetch<Resp>(
      '/api/colecciones',
      'populate[0]=imagen&populate[1]=disenos.imagen&sort=fecha_lanzamiento:desc'
    );
    const arr = Array.isArray(r.data) ? r.data : [r.data];
    return arr.map(c => ({ collection: normalizeCollection(c), designs: (c.disenos||[]).map(normalizeDesign) }));
  } catch (err) {
    console.warn('[strapi] fetchCollectionsWithDesigns failed, returning empty list:', err);
    return [] as Array<{ collection: NormalizedCollection; designs: NormalizedDesign[] }>;
  }
}

export function normalizeDesign(d: DesignDTO): NormalizedDesign {
  const { url, formats } = pickBestImage(d.imagen);
  let collection;
  if (d.coleccion) {
    const cImg = pickBestImage(d.coleccion.imagen);
    collection = {
      id: d.coleccion.documentId,
      name: d.coleccion.nombre,
      description: d.coleccion.descripcion || null,
      image: cImg.url,
    };
  }
  return {
    id: d.documentId,
    name: d.nombre,
    description: d.descripcion || null,
    price: d.precio,
    image: url,
    imageFormats: formats,
    collectionId: d.coleccion?.documentId,
    collection,
    createdAt: d.createdAt,
  };
}
