const mongoose = require('mongoose');
const Schema = mongoose.Schema;

let userSchema = new Schema({
    id: {
        type: String,
    },
    username: {
        type: String,
        minlength: 3,
        maxlength: 20,
        required: true
    },
    email: {
        type: String,
        minlength: 3,
        maxlength: 200,
        required: true,
        unique: true
    },
    password: {
        type: String,
        required: true,
        minlength: 6,
        maxlength: 200
    },
    verifiy: {
        type: Boolean,
        default: false
    },
    verificationCode: { type: String },
    codeExpiresAt: { type: Date },
}, {
    collection: 'users'
}
    , {
        timestamps: true
    }
);
const User = mongoose.model('User', userSchema);
module.exports = User;