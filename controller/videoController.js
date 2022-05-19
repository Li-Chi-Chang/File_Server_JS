let path = require('path')
let fs = require('fs')
let mongoose = require('mongoose')

let modelFuncs = require('../models/allFunctions')
let videoModel = require('../models/videoModel')
let dirModel = require('../models/dirModel')

exports.videoShowPage = async (req,res,next)=>{
    try{
        if(!await modelFuncs.loginCheck(req.cookies)) return res.redirect(process.env.loginUrl)
        let id = req.params.videoid
        let thisvideo = await videoModel.findById(mongoose.Types.ObjectId(id))
        out = await getVideoPageInfo(thisvideo)
        
        res.render('videoview',out)
    } catch (err){
        next(err)
    }
}

exports.videoShowPoster = async (req,res,next)=>{
    try{
        if(!await modelFuncs.loginCheck(req.cookies)) return res.redirect(process.env.loginUrl)
        let id = req.params.videoid
        let thisvideo = await videoModel.findById(mongoose.Types.ObjectId(id))
        
        res.sendFile(thisvideo.diskpath_poster)
    } catch (err){
        next(err)
    }
}

exports.videoShowVideo = async (req,res,next)=>{
    try{
        if(!await modelFuncs.loginCheck(req.cookies)) return res.redirect(process.env.loginUrl)
        let id = req.params.videoid
        let thisvideo = await videoModel.findById(mongoose.Types.ObjectId(id))
        let videoPath = thisvideo.diskpath_video
        let videoSize = thisvideo.filesize

        let range = req.headers.range
        if(!range){
            res.status(400).send('Requires Range header')
        }
        range = range.replace('bytes=', '').split('-')
        
        let CHUNK_SIZE = 10 ** 6
        let start, end
        if(Number(range[0])){
            start = Number(range[0])
        }
        else{
            start = 0
        }
        if(Number(range[1])){
            end = Math.min(Number(range[1]), videoSize - 1)
        }
        else{
            end = Math.min(start + CHUNK_SIZE, videoSize - 1)
        }

        let contentLen = end - start + 1
        let headers = {
            'Content-Range': `bytes ${start}-${end}/${videoSize}`,
            'Accept-Ranges': 'bytes',
            'Content-Length': contentLen,
            'Content-Type': 'video/mp4'
        }

        res.writeHead(206, headers)
        let videoStream = fs.createReadStream(videoPath, {start,end})
        videoStream.pipe(res)
    } catch (err){
        next(err)
    }
}

exports.videoDelete = async (req,res,next)=>{
    try{
        if(!await modelFuncs.loginCheck(req.cookies)) return res.redirect(process.env.loginUrl)
        let id = req.params.videoid
        let thisvideo = await videoModel.findById(mongoose.Types.ObjectId(id))
        let deleteAwait = modelFuncs.deleteAVideo(thisvideo)
        let parentdirAwait = dirModel.findById(mongoose.Types.ObjectId(thisvideo.parentdirId))

        let [_, parentdir] = await Promise.all([deleteAwait,parentdirAwait])
        res.redirect(parentdir.url)
    } catch (err){
        next(err)
    }
}

async function getVideoPageInfo(thisvideo){
    let ancestorsAwait = modelFuncs.getDirAncestors(thisvideo)
    let [ancestors,] = await Promise.all([ancestorsAwait])

    let out = {}
    out.title = thisvideo.title
    out.ancestors = ancestors
    out.path = thisvideo.url
    out.posterurl = path.join(thisvideo.url, process.env.videoPosterUrl)
    out.viewurl = path.join(thisvideo.url, process.env.videoViewUrl)
    return out
}