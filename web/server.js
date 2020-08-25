const express = require('express'); 
const app = express();
const port = process.env.PORT || 3000;
const base = `${__dirname}/public`;
app.use(express.static('public'));
app.use((req, res, next) => {
    res.header("Access-Control-Allow-Origin", "*");
    res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
    res.header("Access-Control-Allow-Headers: X-API-KEY, Origin, X-Requested-With, Content-Type, Accept, Access-Control-Request-Method");
    res.header("Access-Control-Allow-Methods: GET, POST, OPTIONS, PUT, DELETE");
    res.header("Allow: GET, POST, OPTIONS, PUT, DELETE");
    next();
});
app.get('/', function (req, res) { 
    res.sendFile(`${base}/device-list.html`); 
});
app.get('/register-device', (req, res) => { 
    res.sendFile(`${base}/register-device.html`); 
});
app.get('/send-command', (req, res) => { 
    res.sendFile(`${base}/send-command.html`); 
});
app.get('/about', (req, res) => { 
    res.sendFile(`${base}/about-me.html`); 
});
app.get('/registration', (req, res) => { 
    res.sendFile(`${base}/registration.html`); 
})
app.get('/login', (req, res) => { 
    res.sendFile(`${base}/login.html`); 
})
app.listen(port, () => { 
    console.log(`listening on port ${port}`);
});
app.get('*', (req, res) => { 
    res.sendFile(`${base}/404.html`); 
});