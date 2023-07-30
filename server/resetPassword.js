const mongoose = require('mongoose');
const bcrypt = require('bcrypt');
const User = require('./models/User');

/* This file is to reset the password of the testing user, 'c'. */ 

// MongoDB connection setup
mongoose.connect('mongodb://127.0.0.1:27017/sampleapp', {
    useNewUrlParser: true,
    useCreateIndex: true,
    useUnifiedTopology: true,
    useFindAndModify: false
});

mongoose.connection.on('connected', async () => {
    console.log('Connected to MongoDB!');

    const userEmail = 'c@c.com';
    const newPassword = 'c'; 

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(newPassword, salt);

    await User.updateOne({ email: userEmail }, { $set: { password: hashedPassword } });
    process.exit(0);
});

mongoose.connection.on('error', (err) => {
    console.error(`MongoDB connection error: ${err}`);
    process.exit(1);
});
