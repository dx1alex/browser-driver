function parse(str) {
  return new CssParser(str).parse();
}

class CssParser {

  constructor(public str: string) {
  }

  skip(m) {
    this.str = this.str.slice(m[0].length)
  }

  comma(): CssParse | void {
    let m = /^, */.exec(this.str)
    if (!m) return
    this.skip(m)
    return {
      type: 'comma',
      string: ','
    }
  }

  ident(): CssParse | void {
    let m = /^([\w-]+) */.exec(this.str);
    if (!m) return
    this.skip(m)
    return {
      type: 'ident',
      string: m[1]
    }
  }

  int(): CssParse | void {
    let m = /^((\d+)(\S+)?) */.exec(this.str)
    if (!m) return
    this.skip(m)
    let n = ~~m[2]
    let u = m[3]
    return {
      type: 'number',
      string: m[1],
      unit: u || '',
      value: n
    }
  }

  float(): CssParse | void {
    let m = /^(((?:\d+)?\.\d+)(\S+)?) */.exec(this.str)
    if (!m) return
    this.skip(m)
    let n = parseFloat(m[2])
    let u = m[3]
    return {
      type: 'number',
      string: m[1],
      unit: u || '',
      value: n
    }
  }

  number() {
    return this.float() || this.int()
  }

  double(): CssParse | void {
    let m = /^"([^"]*)" */.exec(this.str)
    if (!m) return
    this.skip(m)
    return {
      type: 'string',
      quote: '"',
      string: '"' + m[1] + '"',
      value: m[1]
    }
  }

  single(): CssParse | void {
    let m = /^'([^']*)' */.exec(this.str)
    if (!m) return
    this.skip(m)
    return {
      type: 'string',
      quote: "'",
      string: "'" + m[1] + "'",
      value: m[1]
    }
  }

  string() {
    return this.single() || this.double()
  }

  value() {
    return this.number()
      || this.ident()
      || this.string()
      || this.comma()
  }

  parse(): CssParse[] {
    let vals = []
    while (this.str.length) {
      let obj = this.value()
      if (!obj) throw new Error('failed to parse near `' + this.str.slice(0, 10) + '...`')
      vals.push(obj)
    }
    return vals
  }
}

export default parse

export interface CssParse {
  type: string
  quote?: string
  unit?: string
  string?: string
  value?: any
}
