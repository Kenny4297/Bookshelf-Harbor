const mongoose = require('mongoose');
const bcrypt = require('bcrypt');
const User = require('./models/User'); // adjust this path to match your actual file structure

// MongoDB connection setup
mongoose.connect('mongodb://127.0.0.1:27017/sampleapp', {
    useNewUrlParser: true,
    useCreateIndex: true,
    useUnifiedTopology: true,
    useFindAndModify: false
});

mongoose.connection.on('connected', async () => {
    console.log('Connected to MongoDB!');

    const userEmail = 'c@c.com'; // the email of the user who's password you want to change
    const newPassword = 'c'; // the new password

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(newPassword, salt);

    await User.updateOne({ email: userEmail }, { $set: { password: hashedPassword } });
    process.exit(0);
});

mongoose.connection.on('error', (err) => {
    console.error(`MongoDB connection error: ${err}`);
    process.exit(1);
});
