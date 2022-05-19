let mongoose = require('mongoose')
let dirModel = require('./dirModel')
let novelModel = require('./novelModel')
let chapterModel = require('./chapterModel')
let galleryModel = require('./galleryModel')
let imageModel = require('./imageModel')
let videoModel = require('./videoModel')
let loginModel = require('./loginModel')
let fs = require('fs')

// exports
exports.dirCreate = dirCreate
exports.dirUpdate = dirUpdate
exports.dirDelete = dirDelete
exports.getDirChildren = getDirChildren
exports.getDirAncestors = getDirAncestors

exports.getGalleryChildren = getGalleryChildren
exports.getNovelChildren = getNovelChildren
exports.getVideoChildren = getVideoChildren
exports.getGalleryImages = getGalleryImages
exports.deleteAGallery = deleteAGallery
exports.deleteANovel = deleteANovel
exports.deleteAVideo = deleteAVideo

exports.getNovelChapters = getNovelChapters
exports.getChapterAncestors = getChapterAncestors

exports.loginCheck = loginCheck

// Error page >>>

// Error page <<<

// Dir operation functions >>>
async function dirCreate(parentID, name){
    let newDirInfo = await dirModel.create({title: name, parentdirId:mongoose.Types.ObjectId(parentID)})
    let result = {}
    result.newDirInfo = newDirInfo
    result.message = 'dir created'
    return result
}

async function dirUpdate(parentID, name){
    let newDirInfo = await dirModel.findByIdAndUpdate(mongoose.Types.ObjectId(parentID),{title:name})
    let result = {}
    result.newDirInfo = newDirInfo
    result.message = 'dir updated'
    return result
}

async function dirDelete(parentID){
    async function deleteAllDirOffspring(thisDir){
        let offspringAwait = []

        offspringAwait.push(deleteAllOtherOffspring(thisDir))

        let children = await dirModel.find({parentdirId:thisDir._id})
        children.forEach(child=>{
            offspringAwait.push(deleteAllDirOffspring(child))
            offspringAwait.push(dirModel.findByIdAndDelete(child.id))
        })
        await Promise.all(offspringAwait)
    }

    let parentDir = await dirModel.findOne({_id: mongoose.Types.ObjectId(parentID)})
    let awaits = []
    awaits.push(deleteAllDirOffspring(parentDir))

    let result = {}
    result.parentID = parentID
    
    if(parentDir.parentdirId != null){
        //if not root
        awaits.push(dirModel.findByIdAndDelete(parentDir._id))
        result.parentID = parentDir.parentdirId.toString()
    }
    
    await Promise.all(awaits)
    result.message = 'subdirs deleted'
    return result
}

async function getDirChildren(thisDir){
    let children = await dirModel.find({parentdirId: mongoose.Types.ObjectId(thisDir._id)})
    let childrenID = []
    
    children.forEach(child => {
        childrenID.push({name:child.title, path: child.url, id:child._id.toString(), iconpath:process.env.dirIconPath})
    })
    return childrenID
}

async function getDirAncestors(thisDir){
    async function findParent(targetDir)
    {
        let parent = null
        if(targetDir.parentdirId != null)
            parent = await dirModel.findById(targetDir.parentdirId)
        
        return parent
    }
    let ancestors = [{name: thisDir.title, path: thisDir.url},]
    let oneLayerParent = await findParent(thisDir)
    while(oneLayerParent != null)
    {
        ancestors.push({name: oneLayerParent.title, path: oneLayerParent.url})
        oneLayerParent = await findParent(oneLayerParent)
    }
    return ancestors
}
// Dir operation functions <<<

// Novel operation functions >>>
async function getNovelChildren(thisdir){
    let children = await novelModel.find({parentdirId: thisdir._id})
    let childrenID = []
    
    children.forEach(child => {
        childrenID.push({name:child.title, path: child.url, id:child._id.toString(), iconpath:process.env.novelIconPath})
    })
    return childrenID
}

async function getNovelChapters(thisnovel){
    let chaptersInfo = []
    let chapters = await chapterModel.find({parentnovelId: thisnovel._id}).sort({ordinal: 1})
    chapters.forEach(chapter => {
        chaptersInfo.push({name:chapter.title, path: chapter.url, id:chapter._id.toString(), iconpath:process.env.novelIconPath})
    })
    return chaptersInfo
}

async function deleteAllOtherOffspring(parentdir){
    let allnovels = await novelModel.find({parentdirId:parentdir._id})
    let allgallerys = await galleryModel.find({parentdirId:parentdir._id})
    let allvideos = await videoModel.find({parentdirId:parentdir._id})
    
    allnovels.forEach(anovel =>{deleteANovel(anovel)})
    allgallerys.forEach(agallery => {deleteAGallery(agallery)})
    allvideos.forEach(avideo =>{deleteAVideo(avideo)})
}

async function deleteANovel(thisnovel){
    await chapterModel.deleteMany({parentnovelId: thisnovel._id})
    await novelModel.findByIdAndDelete(thisnovel._id)
    fs.renameSync(thisnovel.diskpath,thisnovel.diskpath.replace(process.env.dirpath,process.env.trashpath))
}

async function getChapterAncestors(thischapter){
    let thisnovel = await novelModel.findById(thischapter.parentnovelId)
    let ancestors = await getDirAncestors(thisnovel)

    return [{name:thischapter.title, path: thischapter.url},].concat(ancestors)
}

//gallery
async function getGalleryChildren(thisdir){
    let children = await galleryModel.find({parentdirId: thisdir._id})
    let childrenID = []
    
    await Promise.all(children.map(async child => {
        let firstpage= await imageModel.findOne({parentgalleryId: child._id}).sort({ordinal:1})
        childrenID.push({name:child.title, path: child.url, id:child._id.toString(), iconpath:process.env.galleryIconPath, preview:firstpage.url,_id:child._id})
    }))

    await childrenID.sort((a,b)=>{
        if(a._id > b._id)
            return 1
        return -1
    })
    
    return childrenID
}

async function getGalleryImages(thisgallery){
    let imagesInfo = []
    let images = await imageModel.find({parentgalleryId: thisgallery._id}).sort({ordinal: 1})
    images.forEach(image => {
        imagesInfo.push({path: image.url, id:image._id.toString()})
    })
    return imagesInfo
}

async function deleteAGallery(thisgallery){
    await imageModel.deleteMany({parentgalleryId: thisgallery._id})
    await galleryModel.findByIdAndDelete(thisgallery._id)
    fs.renameSync(thisgallery.diskpath,thisgallery.diskpath.replace(process.env.dirpath,process.env.trashpath))
}

//video
async function getVideoChildren(thisdir){
    let children = await videoModel.find({parentdirId: thisdir._id})
    let childrenID = []
    
    await Promise.all(children.map(async child => {
        childrenID.push({name:child.title, path: child.url, id:child._id.toString(), iconpath:process.env.galleryIconPath, preview:child.url_poster,_id:child._id})
    }))

    await childrenID.sort((a,b)=>{
        if(a._id > b._id)
            return 1
        return -1
    })
    
    return childrenID
}

async function deleteAVideo(thisvideo){
    await videoModel.findByIdAndDelete(thisvideo._id)
    fs.renameSync(thisvideo.diskpath,thisvideo.diskpath.replace(process.env.dirpath,process.env.trashpath))
}

//login
async function loginCheck(cookies){
    if(!cookies.username | !cookies.password) return false
    accountExist = await loginModel.exists({account:cookies.username,password:cookies.password})
    if(accountExist) return true
    else return false
}