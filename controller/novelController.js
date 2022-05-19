let mongoose = require('mongoose')
let path = require('path')
let fs = require('fs').promises

let novelModel = require('../models/novelModel')
let chapterModel = require('../models/chapterModel')
let dirModel = require('../models/dirModel')
let modelFuncs = require('../models/allFunctions')

// Dir route functions >>>
exports.novelShow = async (req,res,next)=>{
    try{
        if(!await modelFuncs.loginCheck(req.cookies)) return res.redirect(process.env.loginUrl)
        let id = req.params.novelid
        let thisnovel = await novelModel.findById(mongoose.Types.ObjectId(id))
        let out = await getNovelPageInfo(thisnovel)
        
        res.render('novelview',out)
    } catch (err){
        next(err)
    }
}

exports.novelRead = async (req,res,next)=>{
    try{
        if(!await modelFuncs.loginCheck(req.cookies)) return res.redirect(process.env.loginUrl)
        let id = req.params.novelid
        let page = req.params.pageid

        let thischapter = await chapterModel.findById(mongoose.Types.ObjectId(page))
        let thisnovel = await novelModel.findById(mongoose.Types.ObjectId(id))
        let out = await getChapterPageInfo(thischapter,thisnovel)
        
        res.render('chapterview',out)
    } catch (err){
        next(err)
    }
}

exports.novelDelete = async (req,res,next)=>{
    try{
        if(!await modelFuncs.loginCheck(req.cookies)) return res.redirect(process.env.loginUrl)
        let id = req.params.novelid
        let thisnovel = await novelModel.findById(mongoose.Types.ObjectId(id))
        let deleteAwait = modelFuncs.deleteANovel(thisnovel)
        let parentdirAwait = dirModel.findById(mongoose.Types.ObjectId(thisnovel.parentdirId))

        let [_, parentdir] = await Promise.all([deleteAwait,parentdirAwait])
        res.redirect(parentdir.url)
    } catch (err){
        next(err)
    }
}

async function getNovelPageInfo(thisnovel){
    let ancestorsAwait = modelFuncs.getDirAncestors(thisnovel)
    let chaptersAwait = modelFuncs.getNovelChapters(thisnovel)
    let [ancestors,chapters] = await Promise.all([ancestorsAwait,chaptersAwait])

    let out = {}
    out.title = thisnovel.title
    out.ancestors = ancestors
    out.chapters = chapters
    out.path = thisnovel.url
    return out
}

async function getChapterPageInfo(thischapter,thisnovel){
    let ancestorsAwait = modelFuncs.getDirAncestors(thisnovel)
    let contentAwait = fs.readFile(path.join(thisnovel.diskpath, thischapter.diskpath))
    let prevChapterAwait = chapterModel.find({ordinal:{$lt:thischapter.ordinal},parentnovelId:thischapter.parentnovelId}).sort({ordinal:-1}).limit(1)
    let nextChapterAwait = chapterModel.find({ordinal:{$gt:thischapter.ordinal},parentnovelId:thischapter.parentnovelId}).sort({ordinal:1}).limit(1)
    
    let [ancestors,chapterContent,prevChapter,nextChapter] = await Promise.all([ancestorsAwait,contentAwait,prevChapterAwait,nextChapterAwait])

    let prevpath,nextpath
    if(prevChapter.length == 0){
        prevpath = {name:'',url:''}
    } else{
        prevpath = {name:prevChapter[0].title,url:prevChapter[0].url}
    }
    
    if(nextChapter.length == 0){
        nextpath = {name:'',url:''}
    } else{
        nextpath = {name:nextChapter[0].title,url:nextChapter[0].url}
    }

    let out = {}
    out.title = thisnovel.title + ' ' + thischapter.title
    out.chaptitle = thischapter.title
    out.ancestors = [{name:thischapter.title, path: thischapter.url},].concat(ancestors)
    out.chapterContent = chapterContent
    out.prevpath = prevpath
    out.nextpath = nextpath
    return out
}