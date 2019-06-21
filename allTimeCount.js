/* eslint-disable no-console */
const path = require('path')

const {
  readMeta,
  wordCountMap,
  wordCountMapToArray
} = require('./util')

const maxWords = 15

const presidents = ['allende', 'bachelet', 'fernandez', 'kirchner', 'macri', 'piñera']

const ignore = new Set([
  'país',
  'chile',
  'pais',
  'año',
  'personas',
  'gobierno',
  'año',
  'importante',
  'quiero',
  'salud',
  'mil',
  'region',
  'argentina',
  'pais',
  'argentinos',
  'año',
  'quiero',
  'mundo',
  'millones',
  'años',
  'importante',
  'ciente',
  'republica',
  'seguir',
  'gracias',
  'materia',
  'nacional',
  'argentina',
  'argentinos',
  'pais',
  'gracias',
  'señor',
  'señores',
  'importante',
  'argentino',
  'presidente',
  'seguir',
  'argentina',
  'argentinos',
  'pais',
  'gaños',
  'aca',
  'juntos',
  'gracias',
  'importante',
  'camino',
  'quiero',
  'gobierno',
  'realmente',
  'pais',
  'chile',
  'año',
  'chilenos',
  'quiero',
  'años',
  'mil',
  'forma'
])

function main() {
  const encabezado = ['presidente']
  for (let i = 1; i <= maxWords; i++) {
    encabezado.push('palabra ' + i)
    encabezado.push('cantidad palabra ' + i)
  }
  console.log(encabezado.join('\t'))

  presidents.forEach(p => printAlltimeCount(p))
}

function printAlltimeCount(president) {
  const processed_text_parent_dir = process.argv[2]
  const processed_text_dir = path.join(processed_text_parent_dir, 'processed_text_' + president)
  const meta = readMeta(processed_text_dir)

  const fullMap = {}
  meta.forEach(discurso => {
    const map = wordCountMap(discurso.filePath)
    Object.keys(map).forEach(k => {
      if (!fullMap[k]) {
        fullMap[k] = map[k]
      } else {
        fullMap[k] += map[k]
      }
    })
  })

  const wordsCount = wordCountMapToArray(fullMap).filter(w => !ignore.has(w.word)).slice(0, maxWords)

  for (let i = wordsCount.length + 1; i <= maxWords; i++) {
    wordsCount.push({word: 'NULL', count: 0})
  }
  const formattedCount = wordsCount.map(word => word.word + '\t' + word.count).join('\t')
  console.log(president + '\t' + formattedCount)
}

main()
