export type format = (param: ReturnType<typeof param>) => any

export type BodyType = Record<string, any>

export type fetchMethod =
  | 'POST'
  | 'post'
  | 'DELETE'
  | 'delete'
  | 'PUT'
  | 'put'
  | 'PATCH'
  | 'patch'

export interface QObjectParams {
  URL?: string
  header?: string
}

export interface GetQParams {
  path: string
  header?: string
  format?: format
}

export interface GetQsParams {
  paths?: string[]
  header?: string
  createPathsFn?: () => string[]
  format?: format
}

export interface MutateQParams {
  path: string
  header?: string
  method?: fetchMethod
  format?: format
}
