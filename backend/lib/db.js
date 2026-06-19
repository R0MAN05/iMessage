import mongoose from "mongoose";

export async function connectDB() {
    try {
        const mongo_uri = process.env.MONGO_URI;

        if(!mongo_uri){
            throw new Error("MONGO_URI is required");
        } 

        const conn = await mongoose.connect(mongo_uri)
        console.log("MongoDB connected Successfully", conn.connection.host);
    } catch (error) {
        console.error("MongoDB connection error:", error.message);
        process.exit(1);  //1 means failed / 0 means success
    }
}