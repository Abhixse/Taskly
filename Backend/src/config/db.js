import mongoose from "mongoose";

const connectDB = async () =>  { 
    try{
        await mongoose.connect(process.env.MONGODB_URI);
        console.log("DB IS CONNECTED");
    }
    catch {
        console.error("DB connection Failed!");
        process.exit(1);
    }
}

export default connectDB;