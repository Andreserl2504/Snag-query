import type { format, fetchMethod, BodyType } from '../../global.d.ts'

type MutateQParams = {
  url: string
  header: string
  QHeader: string
  method: fetchMethod
  body: BodyType
  format?: format
}

export default <DataType>({
  url,
  header,
  QHeader,
  method,
  body,
  format
}: MutateQParams) =>
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
      body: JSON.stringify(body)
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
