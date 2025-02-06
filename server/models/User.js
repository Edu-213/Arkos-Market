const mongoose = require('mongoose');

const UserSchema = new mongoose.Schema({
    name: {type: String, required: true},
    email: {type: String, required: true, unique: true},
    password: {type: String},
    phone: {type: String},
    cpf: {type: String},
    birthDate: {type: Date},
    gender: {type: String},
    googleId: {type: String, unique: true, sparse: true}
});

UserSchema.index({googleId: 1}, {unique: true, sparse: true});

module.exports = mongoose.model('User', UserSchema);