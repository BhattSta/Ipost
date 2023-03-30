const mongoose = require('mongoose');

mongoose.set('strictQuery', false);
mongoose.connect("mongodb://localhost:27017/studentsDetails");

const conn = mongoose.connection;
conn.on('open', () => console.log('connected'));