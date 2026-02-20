import ConnectToDatabase from "./config/db.config";

import app from "./app";

const PORT = process.env.PORT || 5000;
ConnectToDatabase();
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
