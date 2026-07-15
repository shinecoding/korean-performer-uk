import { ref, uploadBytes, getDownloadURL, deleteObject } from 'firebase/storage'
import { storage } from '../firebase'

export async function uploadImage(path, file) {
  const fileRef = ref(storage, `${path}/${Date.now()}-${file.name}`)
  await uploadBytes(fileRef, file)
  return getDownloadURL(fileRef)
}

export async function deleteImageByUrl(url) {
  try {
    const fileRef = ref(storage, url)
    await deleteObject(fileRef)
  } catch {
    // image may already be gone or URL isn't a storage ref — ignore
  }
}
