require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const stockRoutes = require('./routes/stocks');

const app = express();
app.use(cors(), express.json());

mongoose.connect(process.env_MONGODB_URI, {
    useNewUrlParser : true, useUnifiedTopology: true
})
.then(() => console.log('MongoDB connected'))
.catch(err => console.error(err));

app.use('/api/stocks', stockRoutes);

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));