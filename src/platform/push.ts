/**
 * 消息触达：小程序用「订阅消息」（一次性），App 用 uniPush / 厂商推送。
 * 两端的模板 ID 与后端发送接口都不一样，统一从这里暴露。
 */
export function requestSubscribeMessage(tmplIds: string[]): Promise<string[]> {
  return new Promise((resolve, reject) => {
    // #ifdef MP-WEIXIN
    uni.requestSubscribeMessage({
      tmplIds,
      success: (res) => {
        const accepted = tmplIds.filter(
          (id) => (res as unknown as Record<string, string>)[id] === 'accept',
        )
        resolve(accepted)
      },
      fail: (error) => reject(new Error(error.errMsg || '订阅消息授权失败')),
    })
    // #endif

    // #ifndef MP-WEIXIN
    resolve([])
    // #endif
  })
}

/** App 端获取推送 clientId，交给后端绑定 */
export function getPushClientId(): Promise<string> {
  return new Promise((resolve, reject) => {
    // #ifdef APP-PLUS
    uni.getPushClientId({
      success: (res) => resolve(res.cid),
      fail: (error) => reject(new Error(error.errMsg || '获取推送标识失败')),
    })
    // #endif

    // #ifndef APP-PLUS
    reject(new Error('当前平台不支持推送标识'))
    // #endif
  })
}
