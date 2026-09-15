export interface ShareContent {
  title: string
  /** 小程序分享路径，例如 /pagesSub/moment/detail?id=xxx */
  path?: string
  /** H5 / App 分享链接 */
  link?: string
  imageUrl?: string
  summary?: string
}

/**
 * 主动唤起分享。
 * 小程序端不支持主动分享，需要在页面里声明 onShareAppMessage / onShareTimeline，
 * 这里只负责把分享内容存到全局，页面声明时读取。
 */
const shareCache = new Map<string, ShareContent>()

export function cacheShareContent(path: string, content: ShareContent): void {
  shareCache.set(path, content)
}

export function getShareContent(path: string): ShareContent | undefined {
  return shareCache.get(path)
}

export function shareToFriend(content: ShareContent): Promise<void> {
  // #ifdef MP-WEIXIN
  return Promise.resolve()
  // #endif

  // #ifndef MP-WEIXIN
  return new Promise((resolve, reject) => {
    uni.share({
      provider: 'weixin',
      scene: 'WXSceneSession',
      type: 5,
      href: content.link,
      title: content.title,
      summary: content.summary,
      imageUrl: content.imageUrl,
      success: () => resolve(),
      fail: (error) => reject(new Error(error.errMsg || '分享失败')),
    })
  })
  // #endif
}
