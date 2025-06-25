// Mongoose model 
const mongoose = require('mongoose');

const stockSchema = new mongoose.Schema({
    user:{type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true, index: true},
    symbol: { type: String, required : true, uppercase: true, unique: true},
    createdAt: { type: Date, default: Date.now}
});

module.exports = mongoose.model('Stock', stockSchema)
