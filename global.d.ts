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
