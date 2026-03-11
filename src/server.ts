import ConnectToDatabase from "./config/db.config";
import logger from "./utils/logger";
import app from "./app";

const PORT = process.env.PORT || 5000;
ConnectToDatabase();
app.listen(PORT, () => {
  logger.info(`Server running on port ${PORT}`);
});
