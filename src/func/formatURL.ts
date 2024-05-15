export default (urlBase: string | undefined, path: string) => urlBase
? urlBase[urlBase.length - 1] !== '/' && path[0] !== '/'
  ? `${urlBase}/${path}`
  : urlBase[urlBase.length - 1] === '/' && path[0] === '/'
  ? `${urlBase.slice(0, -1)}/${path.slice(1)}`
  : urlBase + path
: path