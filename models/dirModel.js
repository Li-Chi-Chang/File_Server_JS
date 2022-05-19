let mongoose = require('mongoose')
let Schema = mongoose.Schema

let dirSchema = new Schema({
    title: {type: String, required: true, max:1000},
    parentdirId: {type: mongoose.Types.ObjectId, ref: 'dirModel', required: true},
})

dirSchema.virtual('url')
.get(function(){
    return process.env.dirUrl + this._id + '/'
})

module.exports = mongoose.model('dirModel', dirSchema)