export interface ChooseImagesOptions {
  count?: number
  /** 是否允许拍照 */
  camera?: boolean
}

/** 选择图片：小程序走 chooseMedia，App 走 chooseImage */
export function chooseImages(options: ChooseImagesOptions = {}): Promise<string[]> {
  const { count = 9, camera = true } = options
  const sourceType = camera ? (['album', 'camera'] as const) : (['album'] as const)

  return new Promise((resolve, reject) => {
    // #ifdef MP-WEIXIN
    uni.chooseMedia({
      count,
      mediaType: ['image'],
      sourceType: sourceType as unknown as Array<'album' | 'camera'>,
      success: (res) => resolve(res.tempFiles.map((file) => file.tempFilePath)),
      fail: (error) => reject(new Error(error.errMsg || '选择图片失败')),
    })
    // #endif

    // #ifndef MP-WEIXIN
    uni.chooseImage({
      count,
      sourceType: sourceType as unknown as Array<'album' | 'camera'>,
      success: (res) => resolve(res.tempFilePaths as string[]),
      fail: (error) => reject(new Error(error.errMsg || '选择图片失败')),
    })
    // #endif
  })
}

/** 预览图片 */
export function previewImage(urls: string[], current?: string): void {
  if (!urls.length) return
  uni.previewImage({
    urls,
    current: current ?? urls[0],
  })
}

/** 上传单个文件到业务后端，返回可访问的 URL */
export function uploadFile(
  filePath: string,
  uploadUrl: string,
  formData: Record<string, unknown> = {},
): Promise<string> {
  return new Promise((resolve, reject) => {
    uni.uploadFile({
      url: uploadUrl,
      filePath,
      name: 'file',
      formData,
      success: (res) => {
        try {
          const body = JSON.parse(res.data) as { data?: { url?: string } }
          const url = body?.data?.url
          if (url) resolve(url)
          else reject(new Error('上传返回格式不正确'))
        } catch {
          reject(new Error('上传返回解析失败'))
        }
      },
      fail: (error) => reject(new Error(error.errMsg || '上传失败')),
    })
  })
}
