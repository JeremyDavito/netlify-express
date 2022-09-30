const mongoose = require("mongoose");

mongoose
.connect(process.env.MONGODB_URI)
.then(()=>console.log('Connect to MongoDB'))
.catch((err)=>console.log('Fail to connect to MongoDB', err))

