let mongoose = require('mongoose')
let path = require('path')
let Schema = mongoose.Schema

let gallerySchema = new Schema({
    title: {type: String, required: true, max:1000},
    parentdirId: {type: mongoose.Types.ObjectId, ref: 'dirModel',required: true},
    filename: {type: String, required: true}
})

gallerySchema.virtual('url')
.get(function(){
    return path.join(process.env.galleryUrl, this._id.toString())
})

gallerySchema.virtual('diskpath')
.get(function(){
    return path.join(process.env.dirpath, this.filename)
})

module.exports = mongoose.model('galleryModel', gallerySchema)