var https = require('https')
var parseString = require('xml2js').parseString
var ical = require('ical.js')

/**
   * Get a list of Events from a given Calendarurl
   *
   * @param  {String} url
   * @param  {String} user
   * @param  {String} pass
   * @param  {String} date from which to start like 20140101T120000Z
   * @param  {String} date from which to stop like 20140102T120000Z, optional (can be undefined)
   * @param  {function} cb

   */
function getEvents(url, user, pass, start, end, cb) {
  var urlparts = /(https?)\:\/\/(.*?):?(\d*)?(\/.*\/?)/gi.exec(url)
  var protocol = urlparts[1]
  var host = urlparts[2]
  var port = urlparts[3] || (protocol === 'https' ? 443 : 80)
  var path = urlparts[4]
  var endTimeRange = end ? ' end="' + end + '"' : ''

  var xml =
    '<?xml version="1.0" encoding="utf-8" ?>\n' +
    '<C:calendar-query xmlns:D="DAV:" xmlns:C="urn:ietf:params:xml:ns:caldav">\n' +
    '  <D:prop><C:calendar-data></C:calendar-data></D:prop>\n' +
    '  <C:filter>\n' +
    '    <C:comp-filter name="VCALENDAR">\n' +
    '      <C:comp-filter name="VEVENT">\n' +
    '        <C:time-range start="' +
    start +
    '"' +
    endTimeRange +
    '/>\n' +
    '      </C:comp-filter>\n' +
    '    </C:comp-filter>\n' +
    '  </C:filter>\n' +
    '</C:calendar-query>'

  var options = {
    rejectUnauthorized: false,
    hostname: host,
    port: port,
    path: path,
    method: 'REPORT',
    headers: {
      'Content-type': 'text/xml',
      'Content-Length': xml.length,
      'User-Agent': 'calDavClient',
      Connection: 'close',
      Depth: '1',
    },
  }

  if (user && pass) {
    var userpass = new Buffer(user + ':' + pass).toString('base64')
    options.headers['Authorization'] = 'Basic ' + userpass
  }

  var req = https.request(options, (res) => {
    var s = ''
    res.on('data', (chunk) => {
      s += chunk
    })

    req.on('close', () => {
      var reslist = {}
      try {
        parseString(s, (err, result) => {
          var data = result.multistatus.response
          if (data) {
            data.map((event) => {
              let href = event.href[0]
              href = href.replace(/\//g, '\\')
              href = href.replace(/\./g, '@')
              var ics = event.propstat[0].prop[0]['calendar-data'][0]._
              var jcalData = ical.parse(ics)
              var vcalendar = new ical.Component(jcalData)
              var vevent = vcalendar.getFirstSubcomponent('vevent')
              // let dstart = vevent.getFirstPropertyValue('dtstart')

              let dtstart = vevent.jCal[1]
                .find((entry) => entry[0] === 'dtstart')
                .pop()
              let dtend = vevent.jCal[1]
                .find((entry) => entry[0] === 'dtend')
                .pop()
              let summary = vevent.jCal[1]
                .find((entry) => entry[0] === 'summary')
                .pop()
              let created = vevent.jCal[1]
                .find((entry) => entry[0] === 'created')
                .pop()

              reslist[href] = {
                created,
                dtstart,
                dtend,
                summary,
              }
            })
          }

          cb(reslist)
        })
      } catch (e) {
        console.log('Error parsing response')
        console.log(e)
      }
    })
  })

  req.end(xml)

  req.on('error', function (e) {
    console.log('problem with request: ' + e.message)
  })
}

module.exports = getEvents
