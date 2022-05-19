let mongoose = require('mongoose')
mongoose.connect('mongodb://127.0.0.1/dirDB')
let db = mongoose.connection

let videomodel = require('../models/videoModel')
let dirmodel = require('../models/dirModel')

db.on('connected',async ()=>{
    // run here

    // create a test dir
    otherdirID = '62031a43db1a2dcbb887d2e6'
    asiandirID = '62031a3cdb1a2dcbb887d2de'
    lastOtherVideoID = '62032447de351eff7595ca95'
    let allvideosinOther = await videomodel.find({parentdirId: mongoose.Types.ObjectId(otherdirID),_id:{$lte: mongoose.Types.ObjectId(lastOtherVideoID)}})
    console.log(allvideosinOther[0])
    console.log(allvideosinOther[allvideosinOther.length-1])

    result = await videomodel.updateMany({parentdirId: mongoose.Types.ObjectId(otherdirID),_id:{$gt: mongoose.Types.ObjectId(lastOtherVideoID)}},{parentdirId: mongoose.Types.ObjectId(asiandirID)})
    console.log(result)
    db.close()
})