// Supplied artwork, kept intact while splitting columns for per-letter animation.
const firstNameRows = [
  '  ______ _   _',
  ' |  ____| | | |',
  ' | |__  | |_| |__   __ _ _ __',
  ' |  __| | __| \'_ \\ / _` | \'_ \\',
  ' | |____| |_| | | | (_| | | | |',
  ' |______|\\__|_| |_|\\__,_|_| |_|',
]

const lastNameRows = [
  '  ____         _    _ __  __          _   _ _   _',
  ' |  _ \\   /\\  | |  | |  \\/  |   /\\   | \\ | | \\ | |',
  ' | |_) | /  \\ | |  | | \\  / |  /  \\  |  \\| |  \\| |',
  ' |  _ < / /\\ \\| |  | | |\\/| | / /\\ \\ | . ` | . ` |',
  ' | |_) / ____ \\ |__| | |  | |/ ____ \\| |\\  | |\\  |',
  ' |____/_/    \\_\\____/|_|  |_/_/    \\_\\_| \\_|_| \\_|',
]

function splitLetters(rows: string[], widths: number[]) {
  const totalWidth = widths.reduce((sum, width) => sum + width, 0)
  const paddedRows = rows.map(row => row.padEnd(totalWidth))
  let column = 0

  return widths.map(width => {
    const letter = paddedRows.map(row => row.slice(column, column + width)).join('\n')
    column += width
    return letter
  })
}

export const firstName = splitLetters(firstNameRows, [9, 4, 6, 6, 6])
export const lastName = splitLetters(lastNameRows, [7, 9, 5, 8, 9, 6, 6])
