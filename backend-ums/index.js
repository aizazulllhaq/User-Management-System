import dotenv from "dotenv";
import connectDB from "./src/DB/ConnectDB.js";
import app from "./src/app.js";
import { PORT } from "./src/constant.js";

dotenv.config({
  path: "./.env",
});

connectDB()
  .then(() => {
    app.listen(PORT, () => {
      console.log(`Server is running on : http://localhost:${PORT}`);
    });
  })
  .catch((err) => {
    console.log(`MongoDB Connection Failed : ${err.message}`);
  });
