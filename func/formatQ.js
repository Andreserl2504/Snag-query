export function formatQ(schema, data) {
  let obQ = {}
  for (let param in schema) {
    try {
      if (typeof schema[param] === 'function') {
        try {
          if (data !== undefined) {
            obQ[param] = schema[param](data)
          } else {
            throw new Error('Something went wrong with data fetching')
          }
        } catch (e) {
          throw e
        }
      }
      else {
        throw new Error('Something went wrong with properties')
      }
    } catch (e) {
      throw e
    }
  }
  return obQ
}
