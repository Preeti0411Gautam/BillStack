import {v2 as cloudinary} from "cloudinary";
import fs from "fs";

const uploadOnCloudinary = async(localFilePath)=>{
    try{
   if(!localFilePath) return null
   //upload the file on Cloudinary 
  const response=await cloudinary.uploader.upload(localFilePath ,{
    resource_type:"raw"
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
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME, 
    api_key: process.env.CLOUDINARY_API_KEY, 
    api_secret: process.env.CLOUDINARY_API_SECRET // Click 'View API Keys' above to copy your API secret
});


export default  uploadOnCloudinary;