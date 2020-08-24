const mongoose = require('mongoose');
var Schema = mongoose.Schema;

var stripeLogSchema = new Schema({
    userId:{
        type: mongoose.Schema.Types.ObjectId,
        required: true,
        ref: 'users'
    },
    logs: {
        type: String
    },
    type: {
        type: String
    },
    created_at: {
        type: String,
    },
    updated_at: {
        type: String,
    },
    deleted_at: {
        type: String,
        default: null,
    }
});

//Define user model
var StripeLog = mongoose.model('stripeLogs', stripeLogSchema);
module.exports = StripeLog;