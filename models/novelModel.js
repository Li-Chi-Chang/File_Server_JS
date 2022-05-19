let mongoose = require('mongoose')
let path = require('path')
let Schema = mongoose.Schema

let novelSchema = new Schema({
    title: {type: String, required: true, max:1000},
    parentdirId: {type: mongoose.Types.ObjectId, ref: 'dirModel',required: true},
    filename: {type: String, required: true}
})

novelSchema.virtual('url')
.get(function(){
    return path.join(process.env.novelUrl, this._id.toString())
})


novelSchema.virtual('diskpath')
.get(function(){
    return path.join(process.env.dirpath, this.filename)
})

module.exports = mongoose.model('novelModel', novelSchema)