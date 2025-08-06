import express from "express";
import dotenv from "dotenv";
import { startSendOtpConsumer } from "./consumer.js";
dotenv.config();
startSendOtpConsumer();
const app = express();
app.listen(process.env.PORT || 5001, () => console.log("Server started"));
