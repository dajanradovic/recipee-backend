const fs = require('fs/promises');


class FileHandler{

    constructor(path){
        this.destination = __basedir + path
    }

    async uploader(file, finalName){

         const oldpath = file.filepath;
         const newpath =  this.destination + finalName;

         try{
            await fs.rename(oldpath, newpath)
         }
         catch(err){
             throw new Error('file upload error')
         }
   }

   async delete(name){
        try{
            fs.unlink(this.destination + name)
            
        }
        catch(err){
            throw new Error('file delete error')
        }
        
   }

}

module.exports = FileHandler