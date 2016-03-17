import Sync from 'sync-plus'

export function syncPromise<T>(binding: any, obj: any, options: any = {}) {
  let bl = EXCLUDE_STD_LIST
  let include = (m) => true
  let exclude = (m) => bl.indexOf(m) < 0
  if (Array.isArray(options.include)) {
    bl = bl.concat(options.include)
    include = (m) => bl.indexOf(m) >= 0
  }
  if (Array.isArray(options.exclude)) {
    bl = bl.concat(options.exclude)
  }
  let methods = getAllPropertyNames(obj).filter(m => (typeof obj[m] == 'function' && include(m) && exclude(m)))
  const src = {} as T
  for (let m of methods) {
    src[m] = Sync.promise(binding ? obj[m].bind(binding) : obj[m])
  }
  return src
}

const EXCLUDE_STD_LIST = [
  'constructor', 'toString', 'toLocaleString', 'valueOf', 'hasOwnProperty', 'isPrototypeOf', 'propertyIsEnumerable',
  '__defineGetter__', '__lookupGetter__', '__defineSetter__', '__lookupSetter__', '__proto__'
]

function getAllPropertyNames(obj) {
  let props = []
  do {
    for (let prop of Object.getOwnPropertyNames(obj)) {
      if (props.indexOf(prop) === -1) {
        props.push(prop)
      }
    }
  } while (obj = Object.getPrototypeOf(obj))
  return props
}
