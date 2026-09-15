/** 微信小程序支付参数，由服务端统一下单后返回 */
export interface WeixinPayParams {
  timeStamp: string
  nonceStr: string
  package: string
  signType: 'MD5' | 'HMAC-SHA256' | 'RSA'
  paySign: string
}

/** 小程序：wx.requestPayment；App：需要开通支付模块后接入对应 SDK */
export function requestWeixinPay(params: WeixinPayParams): Promise<void> {
  return new Promise((resolve, reject) => {
    // #ifdef MP-WEIXIN
    uni.requestPayment({
      provider: 'wxpay',
      ...params,
      success: () => resolve(),
      fail: (error) => reject(new Error(error.errMsg || '支付取消或失败')),
    })
    // #endif

    // #ifndef MP-WEIXIN
    reject(new Error('App 支付需先在 manifest.json 中开通支付模块，并调用对应原生 SDK'))
    // #endif
  })
}

/** Apple 内购（iOS 上架若涉及虚拟内容，必须走内购而不是微信支付） */
export function requestApplePay(_productId: string): Promise<void> {
  return Promise.reject(new Error('Apple 内购待接入：请在 HBuilderX 中开启 Apple Pay / IAP 模块'))
}
