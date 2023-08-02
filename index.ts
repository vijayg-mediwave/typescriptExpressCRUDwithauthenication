import dotenv from "dotenv";
import express from "express";
import helmet from "helmet";
import expressWinston  from "express-winston";
import winstonLogger from "./winston/logger"; // Assuming "./winston/logger" exports the winston logger instance
const dbConnection = require('./db.connection/dbconnection')
const app = express();
const userController = require("./controller/user.controller");
const recipiController = require("./controller/recipi_menu.controller")
const port: number = parseInt(process.env.PORT || "3000"); // Use a default port (e.g., 3000) if PORT is not set in the environment
dotenv.config();
app.use(helmet());

//to get json(object) response
app.use(express.json());

// winston logger
app.use(expressWinston.logger({
    winstonInstance: winstonLogger, // Use the winston logger instance for logging
}));

//router connection
app.use("/api/user", userController);
app.use("/api/recipi", recipiController);

//ERROR HANDLING
app.use((err:any, req:any, res:any, next:any) => {
    winstonLogger.error("===========",err)
    //winstonLogger.info("logger",err)
    if (err.message == "jwt expired") {
      return res.status(403).send({
        message: "Bad jwt Token",
      });
    }
    return res.status(500).send({
      message: "internal server error",
    });
});

//DB CONNECTION
dbConnection.dbConnect();

if (!process.env.PORT) {
    console.error("PORT environment variable is not set.");
    process.exit(1);
}

// port listening
app.listen(port, () => {
    console.log(`Listening on port ${port}`);
});
  