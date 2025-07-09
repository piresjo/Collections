import express from "express";
import {
  GENERATE_500_ERROR_JSON,
  GENERATE_GET_JSON,
  GENERATE_CREATED_JSON,
  GENERATE_GET_NOT_FOUND_JSON,
  GENERATE_UPDATE_DELETE_NOT_FOUND_JSON,
  GENERATE_UPDATE_JSON,
  GENERATE_DELETE_JSON,
  MISSING_REGION,
  MISSING_PRODUCT_CONDITION,
  MISSING_HAS_PACKAGING,
  MISSING_IS_DUPLICATE,
  MISSING_GAME_NAME,
  MISSING_CONSOLE_ID,
  MISSING_DIGITAL,
  MISSING_HAS_BOX,
  MISSING_HAS_MANUAL,
  MISSING_HAS_GAME,
  MISSING_ACCESSORY_NAME,
  MISSING_ACCESSORY_TYPE,
  VALIDATE_CONSOLE_ENTRY_JSON,
} from "../constants.js";
var router = express.Router();

// HELPER METHODS

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

export default function makeAPI(database) {
  // HEALTHCHECK
  router.get("/healthcheck", async (req, res) => {
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
  router.get("/consoles", async (req, res) => {
    try {
      return res.status(200).json(GENERATE_GET_JSON(database.getConsoles()));
    } catch (error) {
      console.log(error);
      return res.status(500).json(GENERATE_500_ERROR_JSON(error));
    }
  });

  // Get Console Information
  router.get("/consoles/:id", async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      const results = database.getConsoleInformation(id);
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
  router.post("/consoles", async (req, res) => {
    const bodyVal = req.body;
    const errorVal = VALIDATE_CONSOLE_ENTRY_JSON(bodyVal);
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

      return res
        .status(201)
        .json(GENERATE_CREATED_JSON("Console", database.addConsole(entry)));
    } catch (error) {
      console.log(error);
      return res.status(500).json(GENERATE_500_ERROR_JSON(error));
    }
  });

  // Update Existing Console
  router.put("/consoles/:id", async (req, res) => {
    const bodyVal = req.body;
    const id = parseInt(req.params.id);
    const errorVal = VALIDATE_CONSOLE_ENTRY_JSON(bodyVal);
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

      const results = database.updateConsole(id, entry);
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
  router.delete("/consoles/:id", async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      const results = database.deleteConsole(id);
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
  router.get("/games", async (req, res) => {
    try {
      return res.status(200).json(GENERATE_GET_JSON(database.getGames()));
    } catch (error) {
      console.log(error);
      return res.status(500).json(GENERATE_500_ERROR_JSON(error));
    }
  });

  // Get Game Information
  router.get("/games/:id", async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      const results = database.getGameInformation(id);
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
  router.post("/games", async (req, res) => {
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
        .json(GENERATE_CREATED_JSON("Game", database.addGame(entry)));
    } catch (error) {
      console.log(error);
      return res.status(500).json(GENERATE_500_ERROR_JSON(error));
    }
  });

  // Update Existing Game
  router.put("/games/:id", async (req, res) => {
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

      const results = database.updateGame(id, entry);

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
  router.delete("/games/:id", async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      const results = database.deleteGame(id);
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
  router.get("/accessories", async (req, res) => {
    try {
      return res.status(200).json(GENERATE_GET_JSON(database.getAccessories()));
    } catch (error) {
      console.log(error);
      return res.status(500).json(GENERATE_500_ERROR_JSON(error));
    }
  });

  // Get Accessory Information
  router.get("/accessories/:id", async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      const results = database.getAccessoryInformation(id);
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
  router.post("/accessories", async (req, res) => {
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
        .json(GENERATE_CREATED_JSON("Accessory", database.addAccessory(entry)));
    } catch (error) {
      console.log(error);
      return res.status(500).json(GENERATE_500_ERROR_JSON(error));
    }
  });

  // Update Existing Accessory
  router.put("/accessories/:id", async (req, res) => {
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

      const results = database.updateAccessory(id, entry);

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
  router.delete("/accessories/:id", async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      const results = database.deleteAccessory(id);
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

  return router;
}
