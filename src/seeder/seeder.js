import mongoose from "mongoose";
import User from "../models/user.js";
import bcrypt from 'bcrypt'
import dotenv from 'dotenv'
 const result = dotenv.config({path:'../.env'});
 console.log("result is ",result)

mongoose.connect(process.env.MONGO_URL)
.then(()=>console.log("db connected"))
.catch((err)=>console.log(err));

//sample users 
const adminUsers = {
    name: "Super Admin",
  email: "admin@gmail.com",
  password: "admin123", // change here
  role: "admin",
}

const seedAmin = async() =>{
    try{
        const existAdmin = await User.findOne({email:adminUsers.email}) ;
        if (existAdmin){
            console.log("Admin already exists");
            process.exit();
        }
        const hashpassword = await bcrypt.hash(adminUsers.password,10);
        const admin = {...adminUsers,password:hashpassword};
          
        await User.create(admin);
        console.log("Admin created successfully!");
    process.exit();
    }catch(err){
        console.log("err is ",err);
        process.exit(1);

    }
}
seedAmin();