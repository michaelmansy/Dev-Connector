const mongoose = require('mongoose');
const config = require('config');
const db = config.get('mongoURI');

const connectDB = async () => {
    try {
        await mongoose.connect(db, {
            useNewUrlParser: true,
            useCreateIndex: true
        });

        console.log('MongoDB Connected...');
    } catch (err) {
        console.error(err.message);
        console.log('wade7 en fi moshkela ya 7mar');

        //exit process with failure
        process.exit(1);
    }
}

module.exports = connectDB;