const getEvents = require('./getEvents')

const ICLOUD_CAL_IDS = [
  { name: 'Creatine', id: '85977545-DD46-4B44-A717-F37CEA6FAB11' },
  // { name: 'Personal', id: '7CD22FC7-4098-4259-93CE-4EA212474385' },
]
const ICLOUD_USERNAME = 'piccirilloj1@gmail.com'
const ICLOUD_PASSWORD = 'qstv-bwaw-goue-nvrx'
const ICLOUD_URL = 'https://p66-caldav.icloud.com/1084344016/calendars'

function formatDateForCaldav(d8) {
  d8 = new Date(d8)
  let y = d8.getFullYear()
  let m = String(d8.getMonth() + 1).padStart(2, '0')
  let d = String(d8.getDate()).padStart(2, '0')
  return `${y}${m}${d}T060000Z`
}

module.exports.getEvents = (start, end, callback) => {
  ICLOUD_CAL_IDS.forEach(({ name, id }) => {
    getEvents(
      `${ICLOUD_URL}/${id}/`,
      ICLOUD_USERNAME,
      ICLOUD_PASSWORD,
      formatDateForCaldav(start),
      formatDateForCaldav(end),
      (results) => callback(results, name),
    )
  })
}
