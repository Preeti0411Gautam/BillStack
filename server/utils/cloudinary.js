import {v2 as cloudinary} from "cloudinary";
import fs from "fs";

const uploadOnCloudinary = async(localFilePath)=>{
    try{
   if(!localFilePath) return null
   //upload the file on Cloudinary 
  const response=await cloudinary.uploader.upload(localFilePath ,{
    resource_type:"auto"
   })
        //file has been uploaded successfully
        console.log("File uploaded on Cloudinray",response.url)

        return response
    }catch(error){
        fs.unlinkSync(localFilePath) //remove the locally saved temprory file as the ulpoad operation got failed 
          return null
    }
}



cloudinary.config({ 
    cloud_name: process.env.Cloudinary_cloud_name, 
    api_key: process.env.Cloudinary_api_key, 
    api_secret: process.env.Cloudinary_api_secret // Click 'View API Keys' above to copy your API secret
});


export default  uploadOnCloudinary;