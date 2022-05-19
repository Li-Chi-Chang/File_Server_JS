let mongoose = require('mongoose')
let path = require('path')
let Schema = mongoose.Schema

let chapterSchema = new Schema({
    title: {type: String, required: true, max:1000},
    parentnovelId: {type: mongoose.Types.ObjectId, ref: 'novelModel',required: true},
    filename: {type: String, required: true},
    ordinal: {type: Number, required: true}
})

chapterSchema.virtual('url')
.get(function(){
    return path.join(process.env.novelUrl, this.parentnovelId.toString(), this._id.toString())
})

chapterSchema.virtual('diskpath')
.get(function(){
    return this.filename
})

module.exports = mongoose.model('chapterModel', chapterSchema)