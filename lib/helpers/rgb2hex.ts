export function rgb2hex(color: string): HexColor {
  if (typeof color !== 'string') {
    throw new Error('color has to be type of `string`');
  }
  if (color.substr(0, 1) === '#') {
    return {
      hex: color,
      alpha: 1
    }
  }

  let digits = /(.*?)rgb(a)*\((\d+),(\d+),(\d+)(,[0-9]*\.*[0-9]+)*\)/.exec(color.replace(/\s+/g, ''))

  if (!digits) {
    throw new Error('given color (' + color + ') isn\'t a valid rgb or rgba color');
  }

  let red = parseInt(digits[3])
  let green = parseInt(digits[4])
  let blue = parseInt(digits[5])
  let alpha: any = digits[6] ? /([0-9\.]+)/.exec(digits[6])[0] : '1'
  let rgb = ((blue | green << 8 | red << 16) | 1 << 24).toString(16).slice(1)

  if (alpha.substr(0, 1) === '.') {
    alpha = '0' + alpha
  }

  alpha = parseFloat(alpha)
  alpha = alpha > 1 ? 1 : alpha
  alpha = Math.round(alpha * 100) / 100

  return {
    hex: digits[1] + '#' + parseInt(rgb).toString(16),
    alpha: alpha
  }
}

export interface HexColor {
  hex: string
  alpha: number
}
