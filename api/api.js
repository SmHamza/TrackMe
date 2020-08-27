const mongoose = require('mongoose');
const Device = require('./models/device');
const User = require('./models/user'); 
const express = require('express');
const app = express(); 
const bodyParser = require('body-parser'); 
const port = process.env.PORT || 5000;
//mongoose.connect(process.env.MONGO_URL, { useNewUrlParser: true, useUnifiedTopology: true });
mongoose.connect('mongodb+srv://syHamza:Hamzano123@cluster0.rvk7t.mongodb.net', {useNewUrlParser: true, useUnifiedTopology: true });
app.use(bodyParser.urlencoded({ extended: false })) 
app.use(bodyParser.json())
app.use(express.static('public'));
app.use((req, res, next) => {
    res.header("Access-Control-Allow-Origin", "*");
    res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
    res.header("Access-Control-Allow-Headers: X-API-KEY, Origin, X-Requested-With, Content-Type, Accept, Access-Control-Request-Method");
    res.header("Access-Control-Allow-Methods: GET, POST, OPTIONS, PUT, DELETE");
    res.header("Allow: GET, POST, OPTIONS, PUT, DELETE");
    next();
});
app.use(express.static(`${__dirname}/public/generated-docs`));
app.get('/docs', (req, res) => {
    res.sendFile(`${__dirname}/public/generated-docs/index.html`);
});
app.get('/api/test', (req, res) => { 
    res.send('The API is working!');
});
/**
* @api {get} /api/devices AllDevices An array of all devices
* @apiGroup Device
* @apiSuccessExample {json} Success-Response:
*   [
*       {
*           "_id": "dsohsdohsdofhsofhosfhsofh",
*           "name": "Mary's iPhone",
*           "user": "mary",
*           "sensorData": [
*           {
*               "ts": "1529542230",
*               "temp": 12,
*               "loc": {
*                   "lat": -37.84674,
*                   "lon": 145.115113
*               }
*            },
*            {
*               "ts": "1529572230",
*               "temp": 17,
*               "loc": {
*                   "lat": -37.850026,
*                   "lon": 145.117683
*               }
*           }
*       ]
*   }
*]
* @apiErrorExample {json} Error-Response:
*   {
*       "User does not exist"
*   }
*/
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
/**
* @api {post} /api/devices/ Posting Devices
* @apiName PostDevice
* @apiGroup Devices
*
* @apiParam {String} nameName of Device.
* @apiParam {String} userName of user.
* @apiParam {JSON} sensorDatasensor data.
*
* @apiSuccessExample Success-Response:
*HTTP/1.1 200 OK
* {"Successfully posted devices"}
*
*/
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
/**
* @api {post} /api/authenticating/ Authenticating Devices
* @apiName Postauthenticate
* @apiGroup Users
*
* @apiParam {String} userName of user.
* @apiParam {Password} password of user.
*
* @apiSuccessExample Success-Response:
*HTTP/1.1 200 OK
* {"Successfully authenticated User"}
*
*/
/*app.post('/api/authenticate', (req, res) => { 
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
});*/
/**
* @api {post} /api/registration/ Registering Users
* @apiName UserRegistration
* @apiGroup Registrations
*
* @apiParam {String} userName of user.
* @apiParam {Password} userPassword of user.
* @apiParam {Boolean} verification check of user.
*
* @apiSuccessExample Success-Response:
*HTTP/1.1 200 OK
* {"Successfully Registered User"}
*
*/
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
app.listen(port, () => { 
    console.log(`listening on port ${port}`); 
});