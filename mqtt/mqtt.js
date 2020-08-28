const mqtt = require('mqtt');
const express = require('express');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
const Device = require('./models/device');
const dotenv = require('dotenv'); 
dotenv.config()
var randomCoordinates = require('random-coordinates');
const rand = require('random-int');
const app = express();
const port = process.env.PORT || 5001;
mongoose.connect(process.env.MONGO_URL, { useNewUrlParser: true, useUnifiedTopology: true });
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({
    extended: true
}));
app.use((req, res, next) => {
    res.header("Access-Control-Allow-Origin", "*");
    res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
    res.header("Access-Control-Allow-Headers: X-API-KEY, Origin, X-Requested-With, Content-Type, Accept, Access-Control-Request-Method");
    res.header("Access-Control-Allow-Methods: GET, POST, OPTIONS, PUT, DELETE");
    res.header("Allow: GET, POST, OPTIONS, PUT, DELETE");
    next();
});
const client = mqtt.connect("mqtt://broker.hivemq.com:1883");
client.on('connect', () => {
    console.log('mqtt connected');
    client.subscribe('/sensorData');
});
app.post('/send-command', (req, res) => {
    const { deviceId, command } = req.body;
    const topic = `/218547808/command/${deviceId}`;
    client.publish(topic, command, () => {
        res.send('published new message');
    });
});
client.on('message', (topic, message) => {
    if (topic == '/sensorData') {
        const data = JSON.parse(message);
        Device.findOne({"name": data.deviceId }, (err, device) => {
            if (err) {
                console.log(err)
            }
            const { sensorData } = device;
            const { ts, loc, temp } = data;
            sensorData.push({ ts, loc, temp });
            device.sensorData = sensorData;
            device.save(err => {
            if (err) {
                console.log(err)
                }
            });
        });
    }
});
app.put('/sensor-data', (req, res) => {
    const { deviceId } = req.body;
    const [lat, lon] = randomCoordinates().split(", ");
    const ts = new Date().getTime();
    const loc = { lat, lon };
    const temp = rand(20, 50);
    const topic = `/sensorData`;
    const message = JSON.stringify({ deviceId, ts, loc, temp });
    client.publish(topic, message, () => {
        res.send('published new message');
    });
});
app.listen(port, () => {
    console.log(`listening on port ${port}`);
});
