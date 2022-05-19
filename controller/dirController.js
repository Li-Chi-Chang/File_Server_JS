let dir = require('../models/dirModel')
let modelFuncs = require('../models/allFunctions')
let mongoose = require('mongoose')

// Dir route functions >>>
exports.dirShowRoot = async (req,res,next)=>{
    try{
        if(!await modelFuncs.loginCheck(req.cookies)) return res.redirect(process.env.loginUrl)
        let root = await dir.findOne({parentdirId: null})
        res.redirect(root.url)
    } catch (err){
        next(err)
    }
}

exports.dirShow = async (req,res,next)=>{
    try{
        if(!await modelFuncs.loginCheck(req.cookies)) return res.redirect(process.env.loginUrl)
        let info = await getDirPageInfo(req.params.id)
        res.render('dirview',info)
    } catch (err){
        next(err)
    }
}

exports.dirCreateDeleteUpdate = async (req,res,next)=>{
    try {
        if(!await modelFuncs.loginCheck(req.cookies)) return res.redirect(process.env.loginUrl)
        let action = req.body.action
        let id = req.params.id
        let name = req.body.name
    
        let result
        switch (action) {
            case 'create':
                result = await modelFuncs.dirCreate(id,name)
                break
            case 'update':
                result = await modelFuncs.dirUpdate(id,name)
                break
            case 'delete':
                result = await modelFuncs.dirDelete(id)
                id = result.parentID
                break
            default:
                throw {message:'dir operation not found',stack:'dir operation not found'}
        }
        let info = await getDirPageInfo(id)
        res.render('dirview',info)
    } catch (err){
        next(err)
    }
}
// Dir route functions <<<

// Dir query functions >>>
async function getDirPageInfo(id){
    let out = {}
    let thisdir = await dir.findOne({_id: mongoose.Types.ObjectId(id)})
    if(!thisdir) throw {message:'dir not found',stack:'dirID is not correct'}
    else{
        let childrenDirAwait = modelFuncs.getDirChildren(thisdir)
        let ancestorsAwait = modelFuncs.getDirAncestors(thisdir)
        let childrenNovelAwait = modelFuncs.getNovelChildren(thisdir)
        let childrenGalleryAwait = modelFuncs.getGalleryChildren(thisdir)
        let childrenVideoAwait = modelFuncs.getVideoChildren(thisdir)
        //video, novel, gallary here.
        let [childrenDir,ancestors,childrenNovel,childrenGallery, childrenVideo] = await Promise.all([childrenDirAwait, ancestorsAwait, childrenNovelAwait, childrenGalleryAwait, childrenVideoAwait])

        out.title = thisdir.title
        out.ancestors = ancestors
        out.childrenDir = childrenDir
        out.childrenNovel = childrenNovel
        out.childrenGallery = childrenGallery
        out.childrenVideo = childrenVideo
        out.path = thisdir.url
        return out
    }
}
// Dir query functions <<<

// Error page >>>