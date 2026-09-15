/** 全局类型：仅在需要给 uni 的全局对象补充声明时使用 */
declare type Nullable<T> = T | null | undefined

declare type Recordable<T = unknown> = Record<string, T>
