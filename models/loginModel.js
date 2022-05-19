let mongoose = require('mongoose')
let Schema = mongoose.Schema

let loginSchema = new Schema({
    account: {type: String, required: true, max:1000},
    password: {type: String, required: true, max:1000},
})

module.exports = mongoose.model('loginModel', loginSchema)