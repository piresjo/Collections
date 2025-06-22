import { DB_PASSWORD } from "./secrets.js";
import express from "express";
import mysql from "mysql";
import bodyParser from "body-parser";
import createError from "http-errors";
import path from "path";
import cookieParser from "cookie-parser";
import logger from "morgan";
import { dirname } from 'path';
import { fileURLToPath } from 'url';

var urlencodedParser = bodyParser.urlencoded({ extended: false });
const jsonParser = bodyParser.json();
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

import {
  MISSING_CONSOLE_NAME,
  MISSING_CONSOLE_TYPE,
  MISSING_REGION,
  MISSING_PRODUCT_CONDITION,
  MISSING_HAS_PACKAGING,
  MISSING_IS_DUPLICATE,
  MISSING_HAS_CABLES,
  MISSING_HAS_CONSOLE,
  MISSING_GAME_NAME,
  MISSING_DIGITAL,
  MISSING_CONSOLE_ID,
  MISSING_HAS_BOX,
  MISSING_HAS_MANUAL,
  MISSING_HAS_GAME,
  MISSING_ACCESSORY_NAME,
  MISSING_ACCESSORY_TYPE,
  GENERATE_500_ERROR_JSON,
  GENERATE_CREATED_JSON,
  GENERATE_GET_JSON,
  GENERATE_GET_NOT_FOUND_JSON,
  GENERATE_UPDATE_DELETE_NOT_FOUND_JSON,
  GENERATE_UPDATE_JSON,
  GENERATE_DELETE_JSON,
} from "./constants.js";
import {
  getConsoles,
  getConsoleInformation,
  addConsole,
  updateConsole,
  deleteConsole,
  getGames,
  getGameInformation,
  addGame,
  updateGame,
  deleteGame,
  getAccessories,
  getAccessoryInformation,
  addAccessory,
  updateAccessory,
  deleteAccessory,
} from "./db/js/database.js";

// HELPER METHODS
function validateConsoleEntryJSON(bodyVal) {
  console.log(bodyVal);
  var returnVal = null;
  if (bodyVal.name == null) {
    return MISSING_CONSOLE_NAME;
  }
  if (bodyVal.console_type == null) {
    return MISSING_CONSOLE_TYPE;
  }
  if (bodyVal.region == null) {
    return MISSING_REGION;
  }
  if (bodyVal.product_condition == null) {
    return MISSING_PRODUCT_CONDITION;
  }
  if (bodyVal.has_packaging == null) {
    return MISSING_HAS_PACKAGING;
  }
  if (bodyVal.is_duplicate == null) {
    return MISSING_IS_DUPLICATE;
  }
  if (bodyVal.has_cables == null) {
    return MISSING_HAS_CABLES;
  }
  if (bodyVal.has_console == null) {
    return MISSING_HAS_CONSOLE;
  }
  return returnVal;
}

function validateGameEntryJSON(bodyVal) {
  var returnVal = null;
  if (bodyVal.name == null) {
    return MISSING_GAME_NAME;
  }
  if (bodyVal.console_id == null) {
    return MISSING_CONSOLE_ID;
  }
  if (bodyVal.digital == null) {
    return MISSING_DIGITAL;
  }
  if (bodyVal.region == null) {
    return MISSING_REGION;
  }
  if (bodyVal.product_condition == null) {
    return MISSING_PRODUCT_CONDITION;
  }
  if (bodyVal.has_box == null) {
    return MISSING_HAS_BOX;
  }
  if (bodyVal.is_duplicate == null) {
    return MISSING_IS_DUPLICATE;
  }
  if (bodyVal.has_manual == null) {
    return MISSING_HAS_MANUAL;
  }
  if (bodyVal.has_game == null) {
    return MISSING_HAS_GAME;
  }
  return returnVal;
}

function validateAccessoryEntryJSON(bodyVal) {
  var returnVal = null;
  if (bodyVal.name == null) {
    return MISSING_ACCESSORY_NAME;
  }
  if (bodyVal.console_id == null) {
    return MISSING_CONSOLE_ID;
  }
  if (bodyVal.accessory_type == null) {
    return MISSING_ACCESSORY_TYPE;
  }
  if (bodyVal.product_condition == null) {
    return MISSING_PRODUCT_CONDITION;
  }
  if (bodyVal.has_packaging == null) {
    return MISSING_HAS_PACKAGING;
  }
  return returnVal;
}

// view engine setup

export default function (database) {
  var app = express();

  app.use(bodyParser.urlencoded({ extended: true }));
  app.use(logger("dev"));
  app.use(express.json());
  app.use(express.urlencoded({ extended: false }));
  app.use(cookieParser());
  app.use(express.static(path.join(__dirname, "public")));
  app.set("views", path.join(__dirname, "views"));
  app.set("view engine", "jade");

  // catch 404 and forward to error handler
  app.use(function (req, res, next) {
    next(createError(404));
  });

  // error handler
  app.use(function (err, req, res) {
    // set locals, only providing error in development
    res.locals.message = err.message;
    res.locals.error = req.app.get("env") === "development" ? err : {};

    // render the error page
    res.status(err.status || 500);
    res.render("error.ejs", { error: err });
  });

  const connection = mysql.createConnection({
    host: "localhost",
    user: "root",
    password: DB_PASSWORD,
    database: "video_game_collection",
  });

  connection.connect((err) => {
    if (err) {
      console.error("Error connecting to MySQL: " + err.stack);
      return;
    }
    console.log("Connected to MySQL as ID " + connection.threadId);
  });

  // API

  // HEALTHCHECK
  app.get("/api/healthcheck", (req, res) => {
    console.log("HEALTHCHECK");
    try {
      return res.status(200).json({
        success: true,
      });
    } catch (error) {
      console.log(error);
      return res.status(500).json(GENERATE_500_ERROR_JSON(error));
    }
  });

  // CONSOLES

  // Get All Console Information
  app.get("/api/consoles", async (req, res) => {
    try {
      return res.status(200).json(GENERATE_GET_JSON(getConsoles()));
    } catch (error) {
      console.log(error);
      return res.status(500).json(GENERATE_500_ERROR_JSON(error));
    }
  });

  // Get Console Information
  app.get("/api/consoles/:id", urlencodedParser, async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      const results = getConsoleInformation(id);
      if (results.length == 0) {
        return res.status(404).json(GENERATE_GET_NOT_FOUND_JSON("Console"));
      }
      return res.status(200).json(GENERATE_GET_JSON(results));
    } catch (error) {
      console.log(error);
      return res.status(500).json(GENERATE_500_ERROR_JSON(error));
    }
  });

  // Create A New Console
  app.post("/api/consoles", jsonParser, async (req, res) => {
    console.log("1");
    const bodyVal = req.body;
    console.log("A");
    const errorVal = validateConsoleEntryJSON(bodyVal);
    console.log("C");
    if (errorVal != null) {
      return res.status(400).json(errorVal);
    }
    try {
      console.log("B");
      const entry = {
        name: bodyVal.name,
        console_type: bodyVal.console_type,
        model: bodyVal.model,
        region: bodyVal.region,
        release_date: bodyVal.release_date,
        bought_date: bodyVal.bought_date,
        company: bodyVal.company,
        product_condition: bodyVal.product_condition,
        has_packaging: bodyVal.has_packaging,
        is_duplicate: bodyVal.is_duplicate,
        has_cables: bodyVal.has_cables,
        has_console: bodyVal.has_console,
        monetary_value: bodyVal.monetary_value,
        notes: bodyVal.notes,
      };

      return res
        .status(201)
        .json(GENERATE_CREATED_JSON("Console", addConsole(entry)));
    } catch (error) {
      console.log(error);
      return res.status(500).json(GENERATE_500_ERROR_JSON(error));
    }
  });

  // Update Existing Console
  app.put("/api/consoles/:id", async (req, res) => {
    const bodyVal = req.body;
    const id = parseInt(req.params.id);
    const errorVal = validateConsoleEntryJSON(bodyVal);
    if (errorVal != null) {
      return res.status(400).json(errorVal);
    }
    try {
      const entry = {
        name: bodyVal.name,
        console_type: bodyVal.console_type,
        model: bodyVal.model,
        region: bodyVal.region,
        release_date: bodyVal.release_date,
        bought_date: bodyVal.bought_date,
        company: bodyVal.company,
        product_condition: bodyVal.product_condition,
        has_packaging: bodyVal.has_packaging,
        is_duplicate: bodyVal.is_duplicate,
        has_cables: bodyVal.has_cables,
        has_console: bodyVal.has_console,
        monetary_value: bodyVal.monetary_value,
        notes: bodyVal.notes,
      };

      const results = updateConsole(id, entry);
      if (results.affectedRows == 0) {
        return res
          .status(404)
          .json(GENERATE_UPDATE_DELETE_NOT_FOUND_JSON("Console", id, true));
      }
      return res.status(200).json(GENERATE_UPDATE_JSON("Console", id, results));
    } catch (error) {
      console.log(error);
      return res.status(500).json(GENERATE_500_ERROR_JSON(error));
    }
  });

  // Delete Console
  app.delete("/api/consoles/:id", async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      const results = deleteConsole(id);
      if (results.affectedRows == 0) {
        return res
          .status(404)
          .json(GENERATE_UPDATE_DELETE_NOT_FOUND_JSON("Console", id, false));
      }
      return res.status(200).json(GENERATE_DELETE_JSON("Console", id, results));
    } catch (error) {
      console.log(error);
      return res.status(500).json(GENERATE_500_ERROR_JSON(error));
    }
  });

  // GAMES

  // Get All Games
  app.get("/api/games", async (req, res) => {
    try {
      return res.status(200).json(GENERATE_GET_JSON(getGames()));
    } catch (error) {
      console.log(error);
      return res.status(500).json(GENERATE_500_ERROR_JSON(error));
    }
  });

  // Get Game Information
  app.get("/api/games/:id", async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      const results = getGameInformation(id);
      if (results.length == 0) {
        return res.status(404).json(GENERATE_GET_NOT_FOUND_JSON("Game"));
      }
      return res.status(200).json(GENERATE_GET_JSON(results));
    } catch (error) {
      console.log(error);
      return res.status(500).json(GENERATE_500_ERROR_JSON(error));
    }
  });

  // Create A New Game
  app.post("/api/games", async (req, res) => {
    const bodyVal = req.body;
    const errorVal = validateGameEntryJSON(bodyVal);
    if (errorVal != null) {
      return res.status(400).json(errorVal);
    }
    try {
      const entry = {
        console_id: bodyVal.console_id,
        name: bodyVal.name,
        edition: bodyVal.edition,
        release_date: bodyVal.release_date,
        bought_date: bodyVal.bought_date,
        region: bodyVal.region,
        developer: bodyVal.developer,
        publisher: bodyVal.publisher,
        digital: bodyVal.digital,
        has_game: bodyVal.has_game,
        has_manual: bodyVal.has_manual,
        has_box: bodyVal.has_box,
        is_duplicate: bodyVal.is_duplicate,
        product_condition: bodyVal.product_condition,
        monetary_value: bodyVal.monetary_value,
        notes: bodyVal.notes,
      };
      return res
        .status(201)
        .json(GENERATE_CREATED_JSON("Game", addGame(entry)));
    } catch (error) {
      console.log(error);
      return res.status(500).json(GENERATE_500_ERROR_JSON(error));
    }
  });

  // Update Existing Game
  app.put("/api/games/:id", async (req, res) => {
    const bodyVal = req.body;
    const id = parseInt(req.params.id);
    const errorVal = validateGameEntryJSON(bodyVal);
    if (errorVal != null) {
      return res.status(400).json(errorVal);
    }
    try {
      const entry = {
        console_id: bodyVal.console_id,
        name: bodyVal.name,
        edition: bodyVal.edition,
        release_date: bodyVal.release_date,
        bought_date: bodyVal.bought_date,
        region: bodyVal.region,
        developer: bodyVal.developer,
        publisher: bodyVal.publisher,
        digital: bodyVal.digital,
        has_game: bodyVal.has_game,
        has_manual: bodyVal.has_manual,
        has_box: bodyVal.has_box,
        is_duplicate: bodyVal.is_duplicate,
        product_condition: bodyVal.product_condition,
        monetary_value: bodyVal.monetary_value,
        notes: bodyVal.notes,
      };

      const results = updateGame(id, entry);
      if (results.affectedRows == 0) {
        return res
          .status(404)
          .json(GENERATE_UPDATE_DELETE_NOT_FOUND_JSON("Game", id, true));
      }
      return res.status(200).json(GENERATE_UPDATE_JSON("Game", id, results));
    } catch (error) {
      console.log(error);
      return res.status(500).json(GENERATE_500_ERROR_JSON(error));
    }
  });

  // Delete Game
  app.delete("/api/games/:id", async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      const results = deleteGame(id);
      if (results.affectedRows == 0) {
        return res
          .status(404)
          .json(GENERATE_UPDATE_DELETE_NOT_FOUND_JSON("Game", id, false));
      }
      return res.status(200).json(GENERATE_DELETE_JSON("Game", id, results));
    } catch (error) {
      console.log(error);
      return res.status(500).json(GENERATE_500_ERROR_JSON(error));
    }
  });

  // ACCESSORIES

  // Get All Accessories
  app.get("/api/accessories", async (req, res) => {
    try {
      return res.status(200).json(GENERATE_GET_JSON(getAccessories()));
    } catch (error) {
      console.log(error);
      return res.status(500).json(GENERATE_500_ERROR_JSON(error));
    }
  });

  // Get Accessory Information
  app.get("/api/accessories/:id", async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      const results = getAccessoryInformation(id);
      if (results.length == 0) {
        return res.status(404).json(GENERATE_GET_NOT_FOUND_JSON("Accessory"));
      }
      return res.status(200).json(GENERATE_GET_JSON(results));
    } catch (error) {
      console.log(error);
      return res.status(500).json(GENERATE_500_ERROR_JSON(error));
    }
  });

  // Create A New Accessory
  app.post("/api/accessories", async (req, res) => {
    const bodyVal = req.body;
    const errorVal = validateAccessoryEntryJSON(bodyVal);
    if (errorVal != null) {
      return res.status(400).json(errorVal);
    }
    try {
      const entry = {
        console_id: bodyVal.console_id,
        name: bodyVal.name,
        model: bodyVal.model,
        accessory_type: bodyVal.accessory_type,
        release_date: bodyVal.release_date,
        bought_date: bodyVal.bought_date,
        company: bodyVal.company,
        product_condition: bodyVal.product_condition,
        has_packaging: bodyVal.has_packaging,
        monetary_value: bodyVal.monetary_value,
        notes: bodyVal.notes,
      };

      return res
        .status(201)
        .json(GENERATE_CREATED_JSON("Accessory", addAccessory(entry)));
    } catch (error) {
      console.log(error);
      return res.status(500).json(GENERATE_500_ERROR_JSON(error));
    }
  });

  // Update Existing Accessory
  app.put("/api/accessories/:id", async (req, res) => {
    const bodyVal = req.body;
    const id = parseInt(req.params.id);
    const errorVal = validateAccessoryEntryJSON(bodyVal);
    if (errorVal != null) {
      return res.status(400).json(errorVal);
    }
    try {
      const entry = {
        console_id: bodyVal.console_id,
        name: bodyVal.name,
        model: bodyVal.model,
        accessory_type: bodyVal.accessory_type,
        release_date: bodyVal.release_date,
        bought_date: bodyVal.bought_date,
        company: bodyVal.company,
        product_condition: bodyVal.product_condition,
        has_packaging: bodyVal.has_packaging,
        monetary_value: bodyVal.monetary_value,
        notes: bodyVal.notes,
      };

      const results = updateAccessory(id, entry);
      if (results.affectedRows == 0) {
        return res
          .status(404)
          .json(GENERATE_UPDATE_DELETE_NOT_FOUND_JSON("Accessory", id, true));
      }
      return res
        .status(200)
        .json(GENERATE_UPDATE_JSON("Accessory", id, results));
    } catch (error) {
      console.log(error);
      return res.status(500).json(GENERATE_500_ERROR_JSON(error));
    }
  });

  // Delete Accessory
  app.delete("/api/accessories/:id", async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      const results = deleteAccessory(id);
      if (results.affectedRows == 0) {
        return res
          .status(404)
          .json(GENERATE_UPDATE_DELETE_NOT_FOUND_JSON("Accessory", id, false));
      }
      return res
        .status(200)
        .json(GENERATE_DELETE_JSON("Accessory", id, results));
    } catch (error) {
      console.log(error);
      return res.status(500).json(GENERATE_500_ERROR_JSON(error));
    }
  });

  // SITE

  /* GET home page. */
  app.get("/", function (req, res) {
    res.render("index", { title: "Express" });
  });

  // CONSOLES

  // Get All Consoles
  app.get("/consoles", async (req, res) => {
    try {
      await connection.query(
        `SELECT * FROM Console`,
        function (error, results) {
          if (error) throw error;
          return res.render("consoles.ejs", { consoles: results });
        },
      );
    } catch (error) {
      console.log(error);
      return res.render("error.ejs", { error: error });
    }
  });

  // Get Specific Console Information
  app.get("/consoles/:id", async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      await connection.query(
        `SELECT * FROM Console WHERE id=${id}`,
        function (error, results) {
          if (error) throw error;
          return res.render("console.ejs", {
            consoles: results,
            id: id,
          });
        },
      );
    } catch (error) {
      console.log(error);
      return res.render("error.ejs", { error: error });
    }
  });

  // GAMES

  // Get All Games
  app.get("/games", async (req, res) => {
    try {
      await connection.query(`SELECT * FROM Game`, function (error, results) {
        if (error) throw error;
        return res.render("games.ejs", { games: results });
      });
    } catch (error) {
      console.log(error);
      return res.render("error.ejs", { error: error });
    }
  });

  // Get Specific Game Information
  app.get("/games/:id", async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      await connection.query(
        `SELECT * FROM Game WHERE id=${id}`,
        function (error, results) {
          if (error) throw error;
          return res.render("game.ejs", {
            games: results,
            id: id,
          });
        },
      );
    } catch (error) {
      console.log(error);
      return res.render("error.ejs", { error: error });
    }
  });

  // ACCESSORIES

  // Get All Accessories
  app.get("/accessories", async (req, res) => {
    try {
      await connection.query(
        `SELECT * FROM Accessory`,
        function (error, results) {
          if (error) throw error;
          return res.render("accessories.ejs", { accessories: results });
        },
      );
    } catch (error) {
      console.log(error);
      return res.render("error.ejs", { error: error });
    }
  });

  // Get Specific Accessory Information
  app.get("/accessories/:id", async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      await connection.query(
        `SELECT * FROM Accessory WHERE id=${id}`,
        function (error, results) {
          if (error) throw error;
          return res.render("accessory.ejs", {
            accessories: results,
            id: id,
          });
        },
      );
    } catch (error) {
      console.log(error);
      return res.render("error.ejs", { error: error });
    }
  });

  return app;
}
