/** 登录凭证：小程序走微信 code，App 可以走手机号 / 一键登录 / Apple */
export interface AuthCredential {
  type: 'weixin' | 'phone' | 'apple'
  /** 需要拿到服务端校验的凭证：微信 code / 短信验证码 / Apple identityToken */
  code: string
  /** 手机号登录时带上手机号 */
  phone?: string
}

function loginByWeixin(): Promise<string> {
  return new Promise((resolve, reject) => {
    // 小程序端等价于 wx.login，App 端会调起微信 SDK
    uni.login({
      provider: 'weixin',
      success: (res) => resolve(res.code),
      fail: (error) => reject(new Error(error.errMsg || '微信授权失败')),
    })
  })
}

/** 微信授权：拿到 code 后交给服务端换 openid / unionid */
export async function getWeixinCredential(): Promise<AuthCredential> {
  const code = await loginByWeixin()
  return { type: 'weixin', code }
}

/** 手机号 + 短信验证码登录（App 端常用，需要后端发码接口） */
export async function getPhoneCredential(phone: string, smsCode: string): Promise<AuthCredential> {
  return { type: 'phone', code: smsCode, phone }
}

/** 按平台给出默认登录方式：小程序默认微信授权，App 默认手机号 */
export function defaultLoginType(): AuthCredential['type'] {
  // #ifdef MP-WEIXIN
  return 'weixin'
  // #endif
  // #ifndef MP-WEIXIN
  return 'phone'
  // #endif
}
