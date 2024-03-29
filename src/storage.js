var mqtt = require('mqtt')
var mysql = require('mysql')

console.log('Connecting..')

var connection = mysql.createConnection({
	host: 'mariadb',
	user: process.env['MYSQL_USER'],
	password: process.env['MYSQL_PASSWORD'],
	database: process.env['MYSQL_STORAGE_DATABASE'],
})
connection.connect(function (err) {
	if (err) return console.error('Error connecting to MariaDB:', err)
	console.log('Connected to MariaDB.')

	// Keep alive
	setInterval(function () {
		connection.query('SELECT 1')
	}, 5000)
})

var receiver = mqtt.connect('mqtt://' + process.env['MQTT_HOST'])

receiver.on('connect', function () {
	console.log('Connected to receiver.')
	receiver.subscribe('concava/+')
})

receiver.on('message', function (topic, message) {
	console.log('Received:', topic, message.toString())

	var data = JSON.parse(message.toString())
	var deviceId = topic.replace('concava/', '')
	var table = deviceId
	var query = 'REPLACE INTO ?? SET ?'
	var params = [table, data]

	Object.keys(data).forEach(function (key) {
		if (key.toLowerCase().indexOf('timestamp') === -1) return
		query += ', `' + key + '` = FROM_UNIXTIME(?)'
		params.push(data[key])
		delete data[key]
	})

	connection.query(query, params, function (err, result) {
		if (err) return console.error(err)
	})
})
