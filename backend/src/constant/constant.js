import { config } from "dotenv";
config();

export const port = process.env.PORT;
console.log(port)
export const dbUrl = process.env.DB_URL;
