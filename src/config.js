const mongoose = require('mongoose');
const connect =mongoose.connect('mongodb://localhost:27017/Login-tut');

//check database connected or not
connect.then(()=>{
    console.log('Database connected successfully');
})
.catch(()=>{
    console.log('database cannot be connected');
});

//create a schema
const loginSchema = new mongoose.Schema({
    name:{
        type: String,
        required: true
    },
    password:{
        type: String,
        required: true
    }
});

//collection part
const collection = new mongoose.model('users',loginSchema);

//export this model
module.exports = collection;