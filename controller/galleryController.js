let mongoose = require('mongoose')
let path = require('path')

let dirModel = require('../models/dirModel')
let galleryModel = require('../models/galleryModel')
let imageModel = require('../models/imageModel')
let modelFuncs = require('../models/allFunctions')

exports.galleryShow = async (req,res,next)=>{
    try{
        if(!await modelFuncs.loginCheck(req.cookies)) return res.redirect(process.env.loginUrl)
        let id = req.params.galleryid
        let thisgallery = await galleryModel.findById(mongoose.Types.ObjectId(id))
        let out = await getGalleryPageInfo(thisgallery)
        
        res.render('galleryview',out)
    } catch (err){
        next(err)
    }
}

exports.galleryDelete = async (req,res,next)=>{
    try{
        if(!await modelFuncs.loginCheck(req.cookies)) return res.redirect(process.env.loginUrl)
        let id = req.params.galleryid
        let thisgallery = await galleryModel.findById(mongoose.Types.ObjectId(id))
        let deleteAwait = modelFuncs.deleteAGallery(thisgallery)
        let parentdirAwait = dirModel.findById(mongoose.Types.ObjectId(thisgallery.parentdirId))

        let [_, parentdir] = await Promise.all([deleteAwait,parentdirAwait])
        res.redirect(parentdir.url)
    } catch (err){
        next(err)
    }
}

exports.galleryShowSingleImg = async (req,res,next)=>{
    try{
        if(!await modelFuncs.loginCheck(req.cookies)) return res.redirect(process.env.loginUrl)
        let id = req.params.imgid
        let galleryid = req.params.galleryid
        let galleryAwait = galleryModel.findById(mongoose.Types.ObjectId(galleryid))
        let imageAwait = imageModel.findById(mongoose.Types.ObjectId(id))
        
        let [gallery,image] = await Promise.all([galleryAwait,imageAwait])
        res.sendFile(path.join(gallery.diskpath, image.diskpath))
    } catch (err){
        next(err)
    }
}

async function getGalleryPageInfo(thisgallery){
    let ancestorsAwait = modelFuncs.getDirAncestors(thisgallery)
    let chaptersAwait = modelFuncs.getGalleryImages(thisgallery)
    let [ancestors,images] = await Promise.all([ancestorsAwait,chaptersAwait])

    let out = {}
    out.title = thisgallery.title
    out.ancestors = ancestors
    out.images = images
    out.path = thisgallery.url
    return out
}