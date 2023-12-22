const mongoose = require('mongoose');
const connect = async(uri)=>{
    try {
        console.log("db is connected");
        mongoose.connect(uri);
    } catch (error) {
        console.log(error)
    }
}

module.exports = connect;