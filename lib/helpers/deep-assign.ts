function isObject(x) {
  let type = typeof x
  return x !== null && (type === 'object' || type === 'function')
}

function toObject(val) {
  if (val === null || val === undefined) throw new TypeError('Sources cannot be null or undefined')
  return Object(val)
}

function assignKey(to, from, key) {
  var val = from[key];

  if (val === undefined || val === null) {
    return;
  }

  if (Object.hasOwnProperty.call(to, key)) {
    if (to[key] === undefined || to[key] === null) {
      throw new TypeError('Cannot convert undefined or null to object (' + key + ')');
    }
  }

  if (!Object.hasOwnProperty.call(to, key) || !isObject(val)) {
    to[key] = val;
  } else {
    to[key] = assign(Object(to[key]), from[key]);
  }
}

function assign(to, from) {
  if (to === from) return to
  from = Object(from)

  for (let key in from) {
    if (Object.hasOwnProperty.call(from, key)) {
      assignKey(to, from, key);
    }
  }

  if (Object.getOwnPropertySymbols) {
    let symbols = Object.getOwnPropertySymbols(from);

    for (let i = 0; i < symbols.length; i++) {
      if (Object.propertyIsEnumerable.call(from, symbols[i])) {
        assignKey(to, from, symbols[i]);
      }
    }
  }

  return to;
}

export function deepAssign(target, ...args) {
  target = toObject(target)

  for (let s = 0; s < args.length; s++) {
    assign(target, args[s])
  }

  return target
}

export default deepAssign
