const fs = require('fs/promises');


class FileHandler{

    constructor(path){
        this.destination = __basedir + path
    }

    async uploader(file){
        console.log(file)
         const oldpath = file.filepath;
         const newpath =  this.destination + file.originalFilename;

         try{
            await fs.rename(oldpath, newpath)
         }
         catch(err){
             console.log(err)
             throw new Error('file upload error')
         }
   }

   async delete(name){
    try{
        fs.unlink(this.destination + name)
        
     }
     catch(err){
         console.log(err)
         throw new Error('file delete error')
     }
        
   }

}

module.exports = FileHandler