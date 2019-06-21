const fs = require('fs')
const path = require('path')
const stopwords = new Set(require('stopwords-es'))

const monthNameMap = {
  '01': 'enero',
  '02': 'febrero',
  '03': 'marzo',
  '04': 'abril',
  '05': 'mayo',
  '06': 'junio',
  '07': 'julio',
  '08': 'agosto',
  '09': 'septiembre',
  '10': 'octubre',
  '11': 'noviembre',
  '12': 'diciembre'
}

function readMeta(processed_text_dir) {
  const filePath = path.join(processed_text_dir, 'meta.txt')

  return fs.readFileSync(filePath, 'utf-8').split(/\r?\n/).filter(line => line.length).map(line => {
    const split = line.split('\t')
    return {
      fileName: split[0],
      filePath: path.join(processed_text_dir, 'discursos_limpios', split[0] + '.txt'),
      date: split[1],
      title: split[2]
    }
  })
}

function wordCountMap(filePath) {
  const text = fs.readFileSync(filePath, 'utf-8')
  const words = text.split(/[\.,;:`'"()\s\n¿\?¡!]+/)

  const map = {}

  words.forEach(word => {
    if (word.startsWith('-')){
      word = word.slice(1)
    }
    if (word.endsWith('-')){
      word = word.slice(0, -1)
    }
    word = word.toLocaleLowerCase('es')
    if (stopwords.has(word) || !word.length) {
      return
    }
    if (map[word]) {
      map[word]++
    } else {
      map[word] = 1
    }
  })

  return map
}

function wordCountMapToArray(map) {
  return Object.keys(map)
    .map(word => ({word, count: map[word]}))
    .sort((a, b) => {
      if (b.count !== a.count) {
        return b.count - a.count
      } else if (a.word > b.word) {
        return 1
      } else {
        return -1
      }
    })
}

function getMapByMonth(meta) {
  const mapByMonth = {}
  meta.forEach(discurso => {
    const month = discurso.date.split('_', 2).join('_')
    const map = wordCountMap(discurso.filePath)
    if (!mapByMonth[month]) {
      mapByMonth[month] = {}
    }
    const monthMap = mapByMonth[month]
    Object.keys(map).forEach(k => {
      if (!monthMap[k]) {
        monthMap[k] = map[k]
      } else {
        monthMap[k] += map[k]
      }
    })
  })
  return mapByMonth
}

exports.getMapByMonth = getMapByMonth
exports.monthNameMap = monthNameMap
exports.readMeta = readMeta
exports.wordCountMap = wordCountMap
exports.wordCountMapToArray = wordCountMapToArray
