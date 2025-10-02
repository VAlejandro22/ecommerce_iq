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

async function strapiFetch<T>(path: string, query?: string, opts: RequestInit = {}): Promise<T> {
  const url = `${API_URL.replace(/\/$/, '')}${path}${query ? (path.includes('?') ? '&' : '?') + query : ''}`;
  const res = await fetch(url, {
    ...opts,
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${TOKEN}`,
      ...(opts.headers || {}),
    },
    // Basic caching: allow ISR to control revalidate outside
    next: { revalidate: 60 },
  });
  if (!res.ok) {
    throw new Error(`[strapi] ${res.status} ${res.statusText} fetching ${url}`);
  }
  const json = await res.json();
  return json as T;
}

// Collections
export async function fetchCollections() {
  type Resp = { data: CollectionDTO[] } | { data: CollectionDTO };
  const r = await strapiFetch<Resp>('/api/colecciones', 'populate=imagen');
  const arr = Array.isArray(r.data) ? r.data : [r.data];
  return arr.map(normalizeCollection);
}

export async function fetchCollectionsPage(page: number, pageSize: number = 24) {
  if (page < 1) page = 1;
  type Resp = { data: CollectionDTO[]; meta: { pagination: { page: number; pageSize: number; pageCount: number; total: number } } };
  const query = new URLSearchParams();
  query.set('populate', 'imagen');
  query.set('pagination[page]', String(page));
  query.set('pagination[pageSize]', String(pageSize));
  query.set('sort', 'fecha_lanzamiento:desc');
  const r = await strapiFetch<Resp>('/api/colecciones', query.toString());
  const arr = Array.isArray(r.data) ? r.data : [r.data];
  return {
    collections: arr.map(normalizeCollection),
    pagination: r.meta.pagination,
  };
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
  const r = await strapiFetch<Resp>(
    '/api/disenos',
    'populate[0]=imagen&populate[1]=coleccion&populate[2]=coleccion.imagen'
  );
  const arr = Array.isArray(r.data) ? r.data : [r.data];
  return arr.map(normalizeDesign);
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
  const r = await strapiFetch<Resp>('/api/disenos', query.toString());
  const arr = Array.isArray(r.data) ? r.data : [r.data];
  return {
    designs: arr.map(normalizeDesign),
    pagination: r.meta.pagination,
  };
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
  const r = await strapiFetch<Resp>(
    '/api/colecciones',
    'populate[0]=imagen&populate[1]=disenos.imagen&sort=fecha_lanzamiento:desc'
  );
  const arr = Array.isArray(r.data) ? r.data : [r.data];
  return arr.map(c => ({ collection: normalizeCollection(c), designs: (c.disenos||[]).map(normalizeDesign) }));
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
