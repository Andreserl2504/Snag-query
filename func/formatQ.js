export function formatQ(schema, data) {
  let obQ = {}
  for (let param in schema) {
    if (typeof schema[param] === 'function') {
      try {
        obQ[param] = schema[param](data)
      } catch (e) {
        return new Error('Something went wrong with properties')
      }
    }
  }
  return obQ
}
