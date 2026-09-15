/**
 * 平台适配层出口。
 * 业务代码只从这里拿端能力，不要直接写 wx.* / plus.*。
 */
export * as auth from './auth'
export * as media from './media'
export * as pay from './pay'
export * as push from './push'
export * as share from './share'
export * as storage from './storage'

export type PlatformName = 'mp-weixin' | 'app' | 'h5' | 'unknown'

/** 当前运行平台，端差异用条件编译收在这里 */
export function getPlatformName(): PlatformName {
  // #ifdef MP-WEIXIN
  return 'mp-weixin'
  // #endif
  // #ifdef APP-PLUS
  return 'app'
  // #endif
  // #ifdef H5
  return 'h5'
  // #endif
  // #ifndef MP-WEIXIN || APP-PLUS || H5
  return 'unknown'
  // #endif
}

/** 是否运行在小程序里 */
export function isMiniProgram(): boolean {
  return getPlatformName() === 'mp-weixin'
}
