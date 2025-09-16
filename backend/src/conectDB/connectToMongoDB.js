import mongoose from "mongoose";
import { dbUrl } from "../constant/constant.js";

const connectToMongoDb = async () => {
  try {
    await mongoose.connect(dbUrl);
    console.log("Application is connected to database successfully...");
  } catch (error) {
    console.log(error.message);
  }
};
export default connectToMongoDb;
