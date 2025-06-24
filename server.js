import Database from "./database.js";
import makeApp from "./app.js";
import { DB_PASSWORD } from "./secrets.js";
import mysql from "mysql";

const port = process.env.PORT || 3000;

const connection = mysql.createConnection({
  host: "localhost",
  user: "root",
  password: DB_PASSWORD,
  database: "video_game_collection",
});

var database = Database(connection);

const app = makeApp(database, true);

app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
