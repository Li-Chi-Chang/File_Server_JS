let mongoose = require('mongoose')
mongoose.connect('mongodb://127.0.0.1/dirDB')
let db = mongoose.connection

let dirmodel = require('../models/dirModel')
let novelmodel = require('../models/novelModel')
let chaptermodel = require('../models/chapterModel')

db.on('connected',async ()=>{
    // run here
    await chaptermodel.updateMany({title:{ $regex: '_鬥羅大陸_無憂書城'}},[{
        $set: { title: {
          $replaceOne: { input: "$title", find: "_鬥羅大陸_無憂書城", replacement: "" }
        }}
      }])
})