import ConnectToDatabase from "./config/db.config";
import dotenv from "dotenv";
import app from "./app";
dotenv.config();

const PORT = process.env.PORT || 5000;
ConnectToDatabase();
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
