import mongoose from "mongoose";

async function connectMongo() {
    try {
        await mongoose.connect(process.env.MONGO_DB_URI);
        console.log("Database Connected");
    } catch (error) {
        console.log("Error Occurred", error);
    }
}

export {connectMongo};