let mongoose = require('mongoose')
mongoose.connect('mongodb://127.0.0.1/dirDB')
let db = mongoose.connection

let dirmodel = require('../models/dirModel')
let novelmodel = require('../models/novelModel')
let chaptermodel = require('../models/chapterModel')
let gallerymodel = require('../models/galleryModel')
let imagemodel = require('../models/imageModel')
let loginModel = require('../models/loginModel')

db.on('connected',async ()=>{
    // run here
    let a = await loginModel.exists({account:'a',password:'b'})
    console.log(a)
    
    mongoose.connection.close()
    console.log('done')
})
