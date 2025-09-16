import { config } from "dotenv";
config();

export const port = process.env.PORT;
export const dbUrl = process.env.DB_URL;
