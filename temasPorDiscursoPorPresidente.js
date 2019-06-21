/* eslint-disable no-console */
const path = require('path')
const fs = require('fs')

const {
  readMeta
} = require('./util')

const temasJSON = require('./temas-b-p-f-k-m')
let temasJSONCounter = 0
const maxTemas = temasJSON.reduce((prev, curr) => Math.max(prev, curr.length), 0)

const processed_text_parent_dir = process.argv[2]

const presidents = ['bachelet', 'piñera', 'fernandez', 'kirchner', 'macri']

const discursos = {}

let headers = ['Filename', 'Date', 'Título', 'Presidente', 'Año', 'Mes']

for (let i = 1; i <= maxTemas; i++) {
  headers.push('tema'+i)
}

let output = headers.join('\t')

presidents.forEach(p => {
  const capitalizedPresident = p.charAt(0).toUpperCase() + p.slice(1)
  const processed_text_dir = path.join(processed_text_parent_dir, 'processed_text_' + p)
  const meta = readMeta(processed_text_dir)
  meta.forEach(d => {
    d.temas = temasJSON[temasJSONCounter++]
    const dateSplit = d.date.split('_', 2)
    const filledTemas = []
    for (let i = 0; i < maxTemas; i++) {
      if (i < d.temas.length) {
        filledTemas.push(d.temas[i])
      } else {
        filledTemas.push('NULL')
      }
    }
    output += '\n'+d.fileName+'\t'+d.date+'\t'+d.title+'\t'+capitalizedPresident+'\t'+dateSplit[0]+'\t'+dateSplit[1]+'\t'+filledTemas.join('\t')
  })
  discursos[p] = meta
})

fs.writeFileSync('./output/temas_all_por_discurso.txt', output)
console.log('temas_all_por_discurso.txt done!')

// Juntar los discursos para que se vean por mes
const temasSet = new Set(temasJSON.reduce((acc, curr) => acc.concat(curr)))
const allTemas = Array.from(temasSet).sort()

let headers2 = ['Presidente', 'Año', 'Mes']

for (let i = 0; i < allTemas.length; i++) {
  headers2.push(allTemas[i])
}

let output2 = headers2.join('\t')

presidents.forEach(p => {
  const capitalizedPresident = p.charAt(0).toUpperCase() + p.slice(1)
  const mapByMonth = {}

  discursos[p].forEach(d => {
    const month = d.date.split('_', 2).join('_')
    if (!mapByMonth[month]) {
      const map = {}
      allTemas.forEach(t => {
        map[t] = 0
      })
      mapByMonth[month] = map
    }
    const map = mapByMonth[month]
    d.temas.forEach(t => {
      map[t]++
    })
  })

  Object.keys(mapByMonth).sort().forEach(k => {
    const [year, month] = k.split('_')
    const map = mapByMonth[k]
    const outputArray = [capitalizedPresident, year, month].concat(allTemas.map(t => map[t]))
    output2 += '\n' + outputArray.join('\t')
  })
})

fs.writeFileSync('./output/temas_all_por_mes.txt', output2)
console.log('temas_all_por_mes.txt done!')
