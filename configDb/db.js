require('dotenv').config();
const mongoose = require('mongoose');


const connectedDb = ()=>{
    mongoose.connect(process.env.DATA_BASE).then(()=>console.log(`Database connected on ${mongoose.connection.host} `)).catch(()=> console.log('Database disconnected'));
}
module.exports = connectedDb;  