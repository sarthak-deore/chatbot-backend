const dotenv = require("dotenv");

dotenv.config();

const mongoose = require("mongoose");
mongoose.set("strictQuery", true);
mongoose.connect(process.env.MONGODB_URL);
