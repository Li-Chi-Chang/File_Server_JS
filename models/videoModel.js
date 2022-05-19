let mongoose = require('mongoose')
let path = require('path')
let Schema = mongoose.Schema

let videoSchema = new Schema({
    title: {type: String, required: true, max:1000},
    parentdirId: {type: mongoose.Types.ObjectId, ref: 'dirModel',required: true},
    filename: {type: String, required: true},
    postername: {type: String, required: true},
    videoname: {type: String, required: true},
    filesize: {type: Number, required: true}
})


videoSchema.virtual('url')
.get(function(){
    return path.join(process.env.videoUrl, this._id.toString())
})

videoSchema.virtual('url_video')
.get(function(){
    return path.join(process.env.videoUrl, this._id.toString(), process.env.videoViewUrl)
})

videoSchema.virtual('url_poster')
.get(function(){
    return path.join(process.env.videoUrl, this._id.toString(), process.env.videoPosterUrl)
})

videoSchema.virtual('diskpath')
.get(function(){
    return path.join(process.env.dirpath, this.filename)
})

videoSchema.virtual('diskpath_video')
.get(function(){
    return path.join(process.env.dirpath, this.filename, this.videoname)
})

videoSchema.virtual('diskpath_poster')
.get(function(){
    return path.join(process.env.dirpath, this.filename, this.postername)
})

module.exports = mongoose.model('videoModel', videoSchema)