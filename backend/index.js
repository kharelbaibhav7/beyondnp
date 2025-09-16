import express, { json } from "express";
import cors from "cors";
import { port } from "./src/constant/constant.js";
import errorMiddleware from "./src/middleware/errorMiddleware.js";
import connectToMongoDb from "./src/conectDB/connectToMongoDB.js";

const expressApp = express();
expressApp.use(cors());

expressApp.listen(port, () => {
  console.log(`express app is listening at port ${port}`);
  connectToMongoDb();
});
expressApp.use(json());

//   expressApp.use("/web-user", webUserRouter);
expressApp.use(errorMiddleware);
