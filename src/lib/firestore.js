import {
  collection,
  doc,
  addDoc,
  updateDoc,
  deleteDoc,
  getDoc,
  getDocs,
  setDoc,
  query,
  where,
  serverTimestamp,
} from 'firebase/firestore'
import { db } from '../firebase'

export const PUBLIC_PAGE_SIZE = 9
export const ADMIN_PAGE_SIZE = 10

// ---------- Performers ----------
const performersCol = collection(db, 'performers')

function mapDocs(docs) {
  return docs.map((d) => ({ id: d.id, ...d.data() }))
}

function sortByCreatedAtAsc(items) {
  return [...items].sort((a, b) => {
    const aTime = a.createdAt?.toMillis?.() ?? 0
    const bTime = b.createdAt?.toMillis?.() ?? 0
    return aTime - bTime
  })
}

function sortByCreatedAtDesc(items) {
  return [...items].sort((a, b) => {
    const aTime = a.createdAt?.toMillis?.() ?? 0
    const bTime = b.createdAt?.toMillis?.() ?? 0
    return bTime - aTime
  })
}

/**
 * Offset pagination (no composite index required).
 * `startAfterDoc` is a numeric offset (0, pageSize, …) or null.
 */
export async function listPerformersPage({
  category,
  pageSize = PUBLIC_PAGE_SIZE,
  startAfterDoc = null,
} = {}) {
  const constraints = []
  if (category && category !== 'all') {
    constraints.push(where('category', '==', category))
  }

  const snap = await getDocs(
    constraints.length ? query(performersCol, ...constraints) : query(performersCol),
  )
  const all = sortByCreatedAtAsc(mapDocs(snap.docs))
  const offset = typeof startAfterDoc === 'number' ? startAfterDoc : 0
  const pageItems = all.slice(offset, offset + pageSize)
  const nextOffset = offset + pageSize

  return {
    items: pageItems,
    lastDoc: nextOffset < all.length ? nextOffset : null,
    hasMore: nextOffset < all.length,
  }
}

export async function listPerformers(category) {
  const { items } = await listPerformersPage({
    category,
    pageSize: 500,
  })
  return items
}

export async function getPerformer(id) {
  const snap = await getDoc(doc(db, 'performers', id))
  return snap.exists() ? { id: snap.id, ...snap.data() } : null
}

export function createPerformer(data) {
  return addDoc(performersCol, { ...data, createdAt: serverTimestamp() })
}

export function updatePerformer(id, data) {
  return updateDoc(doc(db, 'performers', id), data)
}

export function deletePerformer(id) {
  return deleteDoc(doc(db, 'performers', id))
}

// ---------- Gallery ----------
const galleryCol = collection(db, 'gallery')

export async function listGalleryPage({
  pageSize = PUBLIC_PAGE_SIZE,
  startAfterDoc = null,
} = {}) {
  const snap = await getDocs(query(galleryCol))
  const all = sortByCreatedAtDesc(mapDocs(snap.docs))
  const offset = typeof startAfterDoc === 'number' ? startAfterDoc : 0
  const pageItems = all.slice(offset, offset + pageSize)
  const nextOffset = offset + pageSize

  return {
    items: pageItems,
    lastDoc: nextOffset < all.length ? nextOffset : null,
    hasMore: nextOffset < all.length,
  }
}

export async function listGallery() {
  const { items } = await listGalleryPage({ pageSize: 500 })
  return items
}

export async function getGalleryItem(id) {
  const snap = await getDoc(doc(db, 'gallery', id))
  return snap.exists() ? { id: snap.id, ...snap.data() } : null
}

export function createGalleryItem(data) {
  return addDoc(galleryCol, { ...data, createdAt: serverTimestamp() })
}

export function updateGalleryItem(id, data) {
  return updateDoc(doc(db, 'gallery', id), data)
}

export function deleteGalleryItem(id) {
  return deleteDoc(doc(db, 'gallery', id))
}

// ---------- Site content (singleton doc) ----------
const contentRef = doc(db, 'content', 'site')

export async function getSiteContent() {
  const snap = await getDoc(contentRef)
  return snap.exists() ? snap.data() : null
}

export function saveSiteContent(data) {
  return setDoc(contentRef, data, { merge: true })
}

// ---------- Social settings (singleton doc) ----------
const socialRef = doc(db, 'settings', 'social')

export async function getSocialSettings() {
  const snap = await getDoc(socialRef)
  return snap.exists() ? snap.data() : null
}

export function saveSocialSettings(data) {
  return setDoc(socialRef, data, { merge: true })
}
