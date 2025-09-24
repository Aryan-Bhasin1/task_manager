const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const User = require('./models/User'); // make sure path matches your project
require('dotenv').config();

mongoose.connect(process.env.MONGO_URI, { useNewUrlParser: true, useUnifiedTopology: true });

async function seed() {
  try {
    const hashedPassword = await bcrypt.hash('password123', 10); // your chosen password
    const user = new User({ username: 'admin', password: hashedPassword });
    await user.save();
    console.log('✅ User created: admin / password123');
  } catch (err) {
    console.error(err);
  } finally {
    mongoose.disconnect();
  }
}

seed();