import type { format, fetchMethod, BodyType } from '../../Types.js'

type MutateSnagParams = {
  url: string
  header: string
  QHeader: string
  method: fetchMethod
  body?: BodyType
  format?: format
}

export default <DataType>({
  url,
  header,
  QHeader,
  method,
  body,
  format
}: MutateSnagParams) =>
  new Promise<DataType>((res, rej) =>
    fetch(url, {
      method:
        method.toLowerCase() === 'post'
          ? 'POST'
          : method.toLowerCase() === 'delete'
          ? 'DELETE'
          : method.toLowerCase() === 'patch'
          ? 'PATCH'
          : 'PUT',
      headers: {
        'Content-Type':
          !!header && header.toLowerCase() === 'json'
            ? 'application/json'
            : QHeader.toLowerCase() === 'json'
            ? 'application/json'
            : ''
      },
      body: body ? JSON.stringify(body) : JSON.stringify({})
    })
      .then((response) => {
        if (response.ok) {
          return response.json()
        } else {
          throw new Error("Something went wrong :'(")
        }
      })
      .then((json) => {
        if (format) {
          const info: DataType = format(json)
          if (info) {
            res(info)
          }
        } else {
          res(json)
        }
      })
      .catch((e) => {
        rej(new Error(e))
      })
  )
