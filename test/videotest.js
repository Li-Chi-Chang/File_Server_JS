let mongoose = require('mongoose')
mongoose.connect('mongodb://127.0.0.1/dirDB')
let db = mongoose.connection

let videomodel = require('../models/videoModel')
let dirmodel = require('../models/dirModel')

let fs = require("fs")
const videoPath = "/Volumes/DATA/Site/SiteData/test/0.mp4";
const videoSize = fs.statSync(videoPath).size;
console.log(videoSize)

db.on('connected',async ()=>{
    // run here

    // create a test dir
    let root = await dirmodel.findOne({parentdirId: null})
    let newtestdir = await dirmodel.create({title: 'test my test', parentdirId: root._id})

    // add a novel in test dir
    let newtestvideo = await videomodel.create({title:'test novelmodel1', parentdirId: newtestdir._id, filename:'test',filesize:videoSize, postername:'0.jpg',videoname:'0.mp4'})

    db.close()
})