require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const stockRoutes = require('./routes/stocks');
const authRoutes = require('./routes/auth');
const auth = require('./middleware/auth');

const app = express();
app.use(cors(), express.json());

console.log('ENV FILE LOADED:', require('dotenv').config());
console.log('MONGODB_URI is', process.env.MONGODB_URI);


mongoose.connect(process.env.MONGODB_URI, {
    useNewUrlParser : true, 
    useUnifiedTopology: true
})
.then(() => console.log('MongoDB connected'))
.catch(err => console.error(err));

app.use('/api/stocks', authRoutes);
app.user('/api/stocks', auth, stockRoutes)

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
