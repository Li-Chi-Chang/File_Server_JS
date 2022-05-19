let mongoose = require('mongoose')
let Schema = mongoose.Schema

let imageSchema = new Schema({
    parentgalleryId: {type: mongoose.Types.ObjectId, ref: 'galleryModel',required: true},
    filename: {type: String, required: true},
    ordinal: {type: Number, required: true}
})

imageSchema.virtual('url')
.get(function(){
    return process.env.galleryUrl + this.parentgalleryId + '/' + this._id
})

imageSchema.virtual('diskpath')
.get(function(){
    return this.filename
})

module.exports = mongoose.model('imageModel', imageSchema)