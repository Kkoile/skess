import * as express from "express";
import * as cors from "cors";
import * as cookieParser from "cookie-parser";
import * as logger from "morgan";
import userRouter from "./routes/user";
import partyRouter from "./routes/party";
import gameRouter from "./routes/game";

const app = express();

app.use(logger('dev'));
app.use(express.json({limit: '1mb'}));
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(cors());

app.use('/user', userRouter);
app.use('/party', partyRouter);
app.use('/game', gameRouter);

export default app;
