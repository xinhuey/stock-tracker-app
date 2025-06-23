const mongoose = require('mongoose');
const bycrypt = require('bycryptjs');

const userSchema = new mongoose.Schema({
    email: {type: String, required: true, unique: true, lowercase: true, trim: true},
    password: {type: String, required: true}
});

userSchema.pre('save', async function(next){
    if (!this.isModified('password')) return next();
    this.password = await bycrypt.hash(this.password, 10);
    next();
});

userSchema.methods.comparePassword = function(candidate){
    return bycrypt.compare(candidate, this.password);
};

module.exports = mongoose.model('User', userSchema);