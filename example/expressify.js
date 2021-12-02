import util from 'util'

const { isAsyncFunction } = util.types

const nextAsync = (promFn) => (req, res, next) =>
  promFn(req, res)
    .then(() => { if (!req.writableEnded) next() })
    .catch((err) => next(err))

export function expressify (...mws) {
  return mws.map(fn => {
    if (typeof fn !== 'function') {
      return fn
    }
    return (fn.length === 2 && isAsyncFunction(fn))
      ? nextAsync(fn)
      : fn
  })
}
