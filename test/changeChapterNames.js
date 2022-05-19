let mongoose = require('mongoose')
mongoose.connect('mongodb://127.0.0.1/dirDB')
let db = mongoose.connection

let dirmodel = require('../models/dirModel')
let novelmodel = require('../models/novelModel')
let chaptermodel = require('../models/chapterModel')
let gallerymodel = require('../models/galleryModel')
let imagemodel = require('../models/imageModel')

remove_text = '_星辰變_無憂書城'
db.on('connected',async ()=>{
    // run here

    chaps = await chaptermodel.find({title:{$regex:"_星辰變_無憂書城"}})
    console.log(chaps)
    chaps.forEach(async (chap) => {
        await chaptermodel.updateOne({_id:chap._id},{title:chap.title.replace(remove_text,'')})
    });
    console.log('done')
})
