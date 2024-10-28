//consumming packages from NPM
require('dotenv').config()
const express = require('express');
const connectedDb = require('./configDb/db');
const app = express();
const http = require('http');
const server = http.createServer(app)
const port = process.env.PORT || 5500
const allRoutes = require('./routes/route')
const cookieParser = require('cookie-parser')
const cors = require('cors');

//database connection
connectedDb()
const session = require('express-session');
const MongoDBStore = require('connect-mongodb-session')(session);

//store session on mongodb
const store = new MongoDBStore({
    uri: process.env.DATA_BASE,
    collection: 'Socialweb',
    expires: 1800000, 
    connectionOptions: {
        serverSelectionTimeoutMS: 100000
    }
}); 
//use session for protected routes
app.use(session({
    secret: process.env.SESSION_KEY,
    name: process.env.SESSION_NAME,
    resave: false,
    saveUninitialized: false,
    cookie: {
        maxAge: 1800000,
        httpOnly: true
    },
    store: store
}));

//app middleware and session  here 
app.use(express.json());
app.use(cookieParser());
app.use(express.urlencoded({ extended: true })); 
app.use(cors({
    origin: "http://localhost:3000",
    methods: ['POST', 'GET', 'PUT', 'DELETE'],
    credentials: true 
}));    
app.use(allRoutes);
//listening on port 
server.listen((port), () => {

    console.log(`Server running on port:${port}`)
});      