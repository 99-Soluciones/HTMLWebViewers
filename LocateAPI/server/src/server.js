import dotenv from "dotenv";
import cors from "cors";
import express from "express";
import morgan from "morgan";
import bodyParser from "body-parser";
import locateAPI from './routes/locateAPI.js';


dotenv.config();
const server = express();
server.use(cors());
server.use(morgan("dev"));
server.use(express.json());
server.use(bodyParser.json());
server.use(bodyParser.urlencoded({ extended: true }));

server.use('/api/locate', locateAPI);

export default server;
// server.js    
