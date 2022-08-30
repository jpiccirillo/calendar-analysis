// Import the functions you need from the SDKs you need
var firebase = require('firebase-admin')
var serviceAccount = require('./serviceAccountKey.js')

let app = firebase.initializeApp({
  credential: firebase.credential.cert(serviceAccount),
  databaseURL: 'https://calendarevents-d04ba-default-rtdb.firebaseio.com',
})

module.exports.insertEvents = function (resultArr) {
  const db = firebase.database()
  const ref = db.ref('Creatine')
  let promise = new Promise((r, j) => {
    Object.keys(resultArr).forEach((newKey) => {
      ref.child(newKey).set(resultArr[newKey]).then(r)
    })
  })
  promise.then((resolvedValue) => {
    app.delete()
  })

  promise.catch((e) => {
    console.log(e)
    app.delete()
  })
}
