/* eslint-disable no-console */
const {
  getMapByMonth,
  monthNameMap,
  readMeta,
  wordCountMapToArray
} = require('./util')

function main() {
  const processed_text_dir = process.argv[2]
  const meta = readMeta(processed_text_dir)
  printDataByMonth(getMapByMonth(meta))
}

function printDataByMonth(mapByMonth) {
  const maxWords = 15
  const encabezado = ['mes discurso', 'año discurso']
  for (let i = 1; i <= maxWords; i++) {
    encabezado.push('palabra ' + i)
    encabezado.push('cantidad palabra ' + i)
  }
  console.log(encabezado.join('\t'))

  Object.keys(mapByMonth).sort().forEach(k => {
    const wordsCount = wordCountMapToArray(mapByMonth[k]).slice(0, maxWords)
    // rellenar el arreglo para que tenga maxWords palabras
    for (let i = wordsCount.length + 1; i <= maxWords; i++) {
      wordsCount.push({word: 'NULL', count: 0})
    }
    const formattedCount = wordsCount.map(word => word.word + '\t' + word.count).join('\t')
    console.log(monthNameMap[k.split('_')[1]] + '\t' + k.split('_')[0] + '\t' + formattedCount)
  })
}

main()
