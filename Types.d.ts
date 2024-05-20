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

export interface SnagObjectParams {
  URL?: string
  header?: string
}

export interface GetSnagParams {
  path: string
  header?: string
  format?: format
}

export interface GetSnagsParams {
  paths?: string[]
  header?: string
  createPathsFn?: () => string[]
  format?: format
}

export interface MutateSnagParams {
  path: string
  header?: string
  method?: fetchMethod
  format?: format
}
