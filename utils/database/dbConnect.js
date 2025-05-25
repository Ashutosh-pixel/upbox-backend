const mongoose = require('mongoose')

async function connectDB(){
    try {
        await mongoose.connect(process.env.DB_KEY, {
            useNewUrlParser: true,
            useUnifiedTopology: true,
        });
        console.log('db connected 👌')
    }
    catch (error) {
        console.log("Error is =", error)
    }
}

module.exports = connectDB;