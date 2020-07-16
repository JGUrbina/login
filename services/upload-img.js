const multer = require('multer')
const path = require('path')
const mkdirp = require('mkdirp')

var folderImg = path.join(__dirname, '../storage/images')



var storage = multer.diskStorage({
    destination: function (req, file, cb) {
        mkdirp(folderImg , function(err) { // path exists unless there was an error 
            
            cb(null,folderImg)
            console.log(folderImg)
        })
    },
    filename: function (req, file, cb) {
        cb(null,  `img-${Date.now()}.${file.mimetype.split('/')[1]}`)
    }
  })
   
var upload = multer({storage})


  module.exports = { upload }