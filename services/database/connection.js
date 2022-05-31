const mongoose = require("mongoose")

const connectionDB = async () => {
    try {
        const conn = await mongoose.connect(process.env.MONGODB_URI)
        console.log(`MongoDB conncected: ${conn.connection.host}`)
    } 
    catch (err) {
        console.log(err)
        process.exit(1)
    }
}

module.exports = connectionDB