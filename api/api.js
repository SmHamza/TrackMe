const mongoose = require('mongoose');
const Device = require('./models/device');
const User = require('./models/user'); 
const express = require('express');
const app = express(); 
const bodyParser = require('body-parser'); 
const port = process.env.PORT || 5000;
mongoose.connect(process.env.MONGO_URL, { useNewUrlParser: true, useUnifiedTopology: true });
app.use(bodyParser.urlencoded({ extended: false })) 
app.use(bodyParser.json())
app.use(express.static('public'));
app.use(function(req, res, next) {
    res.header("Access-Control-Allow-Origin", "*");
    res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
    next();
});
app.get('/api/test', (req, res) => { 
    res.send('The API is working!');
});
app.get('/api/devices', (req, res) => {
    Device.find({}, (err, devices) => {
    if (err == true) {
    return res.send(err);
    } else {
    return res.send(devices);
    } 
    });
});
app.get('/api/devices/:deviceId/device-history', (req, res)=> {
    const{ deviceId }= req.params;
    Device.findOne({"_id": deviceId }, (err, devices)=> {
        const{ sensorData }= devices;
        return err
        ? res.send(err)
        : res.send(sensorData);
    });
});
app.get('/api/users/:user/devices', (req, res) => { 
    const { user } = req.params; 
    Device.find({ 
        "user": user }, (err, devices) => { 
            return err ? 
            res.send(err) : 
            res.send(devices); 
        }); 
    });
app.post('/api/devices', (req, res) => { 
    const { name, user, sensorData } = req.body; 
    const newDevice = new Device({ 
        name, 
        user, 
        sensorData 
    }); 
    newDevice.save(err => { 
        return err 
        ? res.send(err) 
        : res.send('successfully added device and data'); 
    }); 
});
app.post('/api/authenticate', (req, res) => { 
    const { name, password } = req.body; 
    User.findOne({name, password}, (error, user) =>
    {
        if (user == null){
            return res.json({error: "No such User exists" , user: user});
        }
        else{
            return res.json({ 
                success: true, 
                message: 'Authenticated successfully', 
                isBoolean: user.isBoolean });
        }
    });
});
app.post('/api/registration', (req, res)=> {
    const{ name, password, isBoolean } = req.body;
    User.findOne({ name: name }, (error, username)=> {
        if(username==null) {
            const newUser=new User({
                name, 
                password,
                isBoolean
            });
            newUser.save(err=> {
                return err
                ? res.send(err)
                : res.json({
                    success: true,
                    message: 'Created new user'
                });
            });
        }else{
            return res.json({ error:"User already exists"})
        }
    })
});
app.post('/api/send-command', (req, res) => { 
    console.log(req.body); 
});
app.listen(port, () => { 
    console.log(`listening on port ${port}`); 
});