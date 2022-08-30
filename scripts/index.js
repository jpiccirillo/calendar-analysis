/**
 * 1) Get all events between 15 and 14 days ago from caldav
 * 2) Insert these into the relevant calendar key in firebase
 */

const { getEvents } = require('./caldav')
const { insertEvents } = require('./firebase')

function callback(results) {
  if (Object.keys(results).length) insertEvents(results)
}

let d = new Date()
let start = new Date().setDate(d.getDate() - 15)
let end = new Date().setDate(d.getDate() - 14)
getEvents(start, end, callback)
