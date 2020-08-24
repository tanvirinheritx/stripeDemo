const mongoose = require('mongoose');
var Schema = mongoose.Schema;

// const bcrypt = require('bcryptjs');
// const sendMail = require('../services/email.services')

var userSchema = new Schema({
    email: {
        type: String,
        required: true,
        trim: true,
        lowercase: true,
    },
    firstName: {
        type: String
    },
    lastName: {
        type: String
    },
    password:{
        type: String,
        required: true,
        minlength: 6,
    },
    created_at: {
        type: Number,
        default: Date.now(),
    },
    updated_at: {
        type: Number,
        default: Date.now(),
    },
    deleted_at: {
        type: String,
        default: null,
    },
    tokenId: {
        type: String,
    },
    customerId: {
        type: String
    }
});

userSchema.pre('save', async function(next) {
    var user = this;
    user.password = await bcrypt.hash(user.password, 10);
    next();
});

var User = mongoose.model('users', userSchema);

module.exports = User;