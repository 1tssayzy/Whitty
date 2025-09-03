const mongoose = require("mongoose");
const bcrypt = require('bcrypt');
const userSchema = new mongoose.Schema({
    login: {
        type: String,
        required: true,
        unique: true,
    },
    password: {
        type: String,
        required: true,
    },
    avatar: {
        type: String,
    }
});
userSchema.pre('save', async function(next) {
    if (!this.isModified('password')) return next(); 
    next();
});
module.exports = mongoose.model('User', userSchema);
