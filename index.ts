import dotenv from "dotenv";
import express from 'express';
import helmet from "helmet";
import expressWinston  from "express-winston";
import winstonLogger from "./winston/logger";
const dbConnection = require('./db.connection/dbconnection')
const userController = require("./controller/user.controller");
const recipiController = require("./controller/recipi_menu.controller")
const forgotPassword = require("./controller/forgot_password")
const port: number = parseInt(process.env.PORT || "3000");
const app = express();
dotenv.config();
app.use(helmet());

//to get json(object) response
app.use(express.json());

// winston logger
app.use(expressWinston.logger({
    winstonInstance: winstonLogger,
}));

//router connection
app.use("/api/user", userController);
app.use("/api/recipi", recipiController);
app.use("/api/forgot-password",forgotPassword);

//ERROR HANDLING
app.use((err:any, req:any, res:any, next:any) => {
    winstonLogger.error("error===>>",err)
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
  