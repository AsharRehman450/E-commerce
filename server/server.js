/*****  Packages  *****/
import cors from "cors";
import express from "express";
import winston from "winston";
import bodyParser from "body-parser";
/*****  Modules  *****/
import connectDB from "./src/config/db.js";
import logger from "./src/utils/logger.js";
import routes from "./src/routes/index.js";
import { envConfig } from "./src/utils/env.js";

envConfig();

connectDB();
logger();

const app = express();
const PORT = process.env.PORT || 5000;

/*****  Middlewares  *****/
app.use(cors()).use(bodyParser.json({ limit: "50mb" }));

//routes
routes(app);

app.listen(PORT, () => winston.info(`Server is Listening on port ${PORT}.`));
