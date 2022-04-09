const { upload } = require("../config/cloudinary-config");
const { newHttpError } = require("./error");

function uploadImages(req, res, next){
  const uploadImages = upload.array("productImage", 4);
  uploadImages(req, res, function(err){
    if(err){
      return next(newHttpError(400, "Error while uploading files"));
    }

    next();
  })
}

module.exports = { uploadImages };