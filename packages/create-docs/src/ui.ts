const useColor = process.stdout.isTTY && !process.env.NO_COLOR

/** Built at runtime so no escape byte ever sits in the source. */
const ESC = String.fromCharCode(27)

const wrap = (code: string) => (text: string) =>
  useColor ? ESC + '[' + code + 'm' + text + ESC + '[0m' : text

export const color = {
  bold: wrap('1'),
  dim: wrap('2'),
  green: wrap('32'),
  red: wrap('31'),
  cyan: wrap('36'),
}

export function info(message = '') {
  console.log(message)
}

export function success(message: string) {
  console.log(color.green('OK') + ' ' + message)
}

export function fail(message: string) {
  console.error(color.red('Error') + ' ' + message)
}
