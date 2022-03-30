import express  from "express";
import config from "config";
import log from "./logger/logger";
import routes from "./routes";

const app = express();

const port = config.get("port") as number;
const host = config.get("host") as string;

app.use(express.json());
app.use(express.urlencoded({ extended: true }));


app.listen(port, host, () => {
    log.info(`Server Listening at http://${host}:${port}`);
    
    routes(app);
});  