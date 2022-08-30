const { getEvents } = require('./caldav')
require('./firebase')
const path = require('path')
const fs = require('fs')

// const events = require("./results/results-2022-08-28T04:46:45.851Z-11:46:45 PM.json")
// console.log(Object.keys(events).length)
getEvents('2016', 'August 14, 2022', writeToFS)

function writeToFS(contents, name, extension = '.json') {
  const folderStub = 'results'
  const d = new Date()
  const date = d.toISOString()
  const time = d.toLocaleTimeString()
  const title = `${name}-${date}-${time}${extension}`
  fs.writeFileSync(
    path.join(__dirname, folderStub, title),
    JSON.stringify(contents),
  )
}
