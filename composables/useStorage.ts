import { ref } from 'vue'
import { uploadData, getUrl, remove } from 'aws-amplify/storage'

export function useStorage() {
  const isUploading = ref(false)
  const progress = ref(0)
  const error = ref<string | null>(null)
  const activeUploads = ref<Map<string, ReturnType<typeof uploadData>>>(
    new Map()
  )
  const isCancelled = ref(false)
  const isPaused = ref(false)

  /**
   * Upload a file to S3 storage with enhanced features
   * @param file File to upload
   * @param key S3 storage key (path)
   * @param options Additional upload options
   * @returns Object with status and data
   */
  async function uploadFile(
    file: File,
    key: string,
    options: {
      path?: string
      accessLevel?: 'public' | 'protected' | 'private'
      contentType?: string
      metadata?: Record<string, string>
      onProgress?: (progress: { loaded: number; total: number }) => void
      username?: string
      checksumAlgorithm?: 'crc-32'
      contentDisposition?: string
      resumeUploadId?: string
    } = {}
  ) {
    const {
      path = '',
      accessLevel = 'protected',
      contentType,
      metadata = {},
      onProgress,
      username,
      checksumAlgorithm,
      contentDisposition,
      resumeUploadId
    } = options

    let fullKey: string

    // Handle path construction based on access level and username
    if (accessLevel === 'protected' && username) {
      // For protected paths with username
      fullKey = path ? `${username}/${path}/${key}` : `${username}/${key}`
    } else {
      // For public or other paths
      fullKey = path ? `${path}/${key}` : key
    }

    const storageKey = `${accessLevel}/${fullKey}`

    isUploading.value = true
    progress.value = 0
    error.value = null
    isCancelled.value = false
    isPaused.value = false

    try {
      // Create upload with enhanced options - using the latest API based on new documentation
      // We need to use key instead of path to maintain compatibility with our Map
      const upload = uploadData({
        path: storageKey, // Use key parameter to be compatible with our Map type
        data: file,
        options: {
          contentType: contentType ?? file.type,
          metadata,
          checksumAlgorithm,
          contentDisposition,
          // Add upload ID for resuming if available
          ...(resumeUploadId ? { uploadId: resumeUploadId } : {}),
          // Handle progress tracking
          onProgress: (progressEvent) => {
            // Use updated progress properties
            const loaded = progressEvent.transferredBytes || 0
            const total = progressEvent.totalBytes ?? file.size

            const percentCompleted = Math.round((loaded * 100) / total)
            progress.value = percentCompleted

            if (onProgress) {
              onProgress({ loaded, total })
            }
          }
        }
      })

      // Store the upload for possible pause/resume/cancel operations
      activeUploads.value.set(storageKey, upload)

      // Wait for upload to complete
      await upload.result

      // Clean up after successful upload
      activeUploads.value.delete(storageKey)

      return {
        success: true,
        key: fullKey,
        uploadId: storageKey // Return the storage key as the upload ID for future reference
      }
    } catch (err: any) {
      console.error('Error uploading file:', err)

      // Check if this was a pause or cancel error
      if (isCancelled.value) {
        return {
          success: false,
          cancelled: true,
          uploadId: storageKey
        }
      }

      if (isPaused.value) {
        return {
          success: false,
          paused: true,
          uploadId: storageKey
        }
      }

      error.value = err.message ?? 'Failed to upload file'
      return {
        success: false,
        error: error.value
      }
    } finally {
      if (!isPaused.value) {
        isUploading.value = false
      }
    }
  }

  /**
   * Pause an in-progress upload
   * @param uploadId The ID of the upload to pause
   * @returns Success status
   */
  function pauseUpload(uploadId: string) {
    const upload = activeUploads.value.get(uploadId)
    if (!upload) {
      return { success: false, error: 'Upload not found' }
    }

    try {
      isPaused.value = true
      upload.pause()
      return { success: true }
    } catch (err: any) {
      console.error('Error pausing upload:', err)
      return { success: false, error: err.message ?? 'Failed to pause upload' }
    }
  }

  /**
   * Resume a paused upload
   * @param uploadId The ID of the upload to resume
   * @returns Success status
   */
  function resumeUpload(uploadId: string) {
    const upload = activeUploads.value.get(uploadId)
    if (!upload) {
      return { success: false, error: 'Upload not found' }
    }

    try {
      isPaused.value = false
      upload.resume()
      return { success: true }
    } catch (err: any) {
      console.error('Error resuming upload:', err)
      return { success: false, error: err.message ?? 'Failed to resume upload' }
    }
  }

  /**
   * Cancel an in-progress upload
   * @param uploadId The ID of the upload to cancel
   * @returns Success status
   */
  function cancelUpload(uploadId: string) {
    const upload = activeUploads.value.get(uploadId)
    if (!upload) {
      return { success: false, error: 'Upload not found' }
    }

    try {
      isCancelled.value = true
      upload.cancel()
      activeUploads.value.delete(uploadId)
      return { success: true }
    } catch (err: any) {
      console.error('Error cancelling upload:', err)
      return { success: false, error: err.message ?? 'Failed to cancel upload' }
    } finally {
      isUploading.value = false
    }
  }

  /**
   * Get a signed URL for a file
   * @param key The key of the file to get URL for
   * @param options Additional options
   * @returns The signed URL
   */
  async function getFileUrl(
    key: string,
    options: {
      accessLevel?: 'public' | 'protected' | 'private'
      expires?: number
      username?: string
    } = {}
  ) {
    const { accessLevel = 'protected', expires = 3600, username } = options

    let fullKey = key

    // Handle path construction based on access level and username
    if (accessLevel === 'protected' && username) {
      fullKey = key.includes(username) ? key : `${username}/${key}`
    }
    try {
      // Using updated signature for getUrl per the latest API
      const urlResult = getUrl({
        path: `${accessLevel}/${fullKey}`, // Continue using key for backwards compatibility
        options: {
          expiresIn: expires
        }
      })

      const result = await urlResult
      return result.url.toString()
    } catch (err: any) {
      console.error('Error getting file URL:', err)
      error.value = err.message ?? 'Failed to get file URL'
      throw err
    }
  }

  /**
   * Delete a file from storage
   * @param key The key of the file to delete
   * @param options Additional options
   * @returns Status of the operation
   */
  async function deleteFile(
    key: string,
    options: {
      accessLevel?: 'public' | 'protected' | 'private'
      username?: string
    } = {}
  ) {
    const { accessLevel = 'protected', username } = options

    let fullKey = key

    // Handle path construction based on access level and username
    if (accessLevel === 'protected' && username) {
      fullKey = key.includes(username) ? key : `${username}/${key}`
    }
    try {
      // Using updated signature for remove per the latest API
      const removeResult = remove({
        path: `${accessLevel}/${fullKey}`
      })

      await removeResult
      return { success: true }
    } catch (err: any) {
      console.error('Error deleting file:', err)
      error.value = err.message ?? 'Failed to delete file'
      return {
        success: false,
        error: error.value
      }
    }
  }

  return {
    isUploading,
    progress,
    error,
    uploadFile,
    getFileUrl,
    deleteFile,
    pauseUpload,
    resumeUpload,
    cancelUpload,
    isCancelled,
    isPaused
  }
}
