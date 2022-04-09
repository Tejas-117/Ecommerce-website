function newHttpError(statusCode, message){
   const err = new Error(message);
   err.status = statusCode;
   return err;
}

module.exports = {
   newHttpError
}