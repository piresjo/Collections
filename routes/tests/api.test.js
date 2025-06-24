import { describe, expect, test, vi, afterEach } from "vitest";
import request from "supertest";
import { router } from "../api";
import makeApp from "../../app";
import express from "express";
import bodyParser from "body-parser";
import {
  fullConsoleEntry,
  allConsolesResult,
  consoleInfoResponse,
  createResult,
  updateResult,
  deleteResult,
  gameInfoResponse,
  allGamesResponse,
  fullGameEntry,
} from "./api.test.data.js";

const Database = vi.fn(function () {});
Database.prototype.getConsoles = vi.fn(() => allConsolesResult);
Database.prototype.getConsoleInformation = vi.fn(() => consoleInfoResponse);
Database.prototype.addConsole = vi.fn(() => createResult);
Database.prototype.updateConsole = vi.fn(() => updateResult);
Database.prototype.deleteConsole = vi.fn(() => deleteResult);
Database.prototype.getGames = vi.fn(() => allGamesResponse);
Database.prototype.getGameInformation = vi.fn(() => gameInfoResponse);
Database.prototype.addGame = vi.fn(() => createResult);
Database.prototype.updateGame = vi.fn(() => updateResult);
Database.prototype.deleteGame = vi.fn(() => deleteResult);
const app = makeApp(new Database(), false);

describe("API Healthcheck", () => {
  test("should get a successful response", async () => {
    const response = await request(app).get("/api/healthcheck");
    expect(response.body.success).toBe(true);
  });
});

describe("GET All Consoles", () => {
  test("should get a successful response with consoles", async () => {
    const response = await request(app).get("/api/consoles");
    console.log(response.body);
    expect(response.body.success).toBe(true);
    expect(response.body.results.length).toBe(4);
  });
});

describe("GET Specific Console Info", () => {
  test("should get a successful response with a console", async () => {
    const response = await request(app).get("/api/consoles/1");
    console.log(response.body);
    expect(response.body.success).toBe(true);
    expect(response.body.results.length).toBe(1);
  });
});

describe("POST New Console", () => {
  test("should add a console to the database", async () => {
    const response = await request(app)
      .post("/api/consoles")
      .send(fullConsoleEntry);
    console.log(response.body);
    expect(response.body.success).toBe(true);
    expect(response.body.message).toBe("Console Created");
    expect(response.body.results.affectedRows).toBe(1);
  });

  test("should fail because of missing name", async () => {
    const failConsoleEntry = {
      console_type: 1,
      model: "TEST",
      region: 1,
      release_date: "1990-01-01",
      bought_date: "1990-01-01",
      company: "TEST",
      product_condition: 1,
      has_packaging: false,
      is_duplicate: false,
      has_cables: false,
      has_console: true,
      monetary_value: 10.35,
      notes: "TEST",
    };

    const response = await request(app)
      .post("/api/consoles")
      .send(failConsoleEntry);
    console.log(response.body);
    expect(response.body.success).toBe(false);
    expect(response.body.message).toBe("Console Needs To Have A Name");
  });

  test("should fail because of missing console_type", async () => {
    const failConsoleEntry = {
      name: "Test",
      model: "TEST",
      region: 1,
      release_date: "1990-01-01",
      bought_date: "1990-01-01",
      company: "TEST",
      product_condition: 1,
      has_packaging: false,
      is_duplicate: false,
      has_cables: false,
      has_console: true,
      monetary_value: 10.35,
      notes: "TEST",
    };

    const response = await request(app)
      .post("/api/consoles")
      .send(failConsoleEntry);
    console.log(response.body);
    expect(response.body.success).toBe(false);
    expect(response.body.message).toBe("console_type Must Be Defined");
  });

  test("should fail because of missing region", async () => {
    const failConsoleEntry = {
      name: "Test",
      console_type: 1,
      model: "TEST",
      release_date: "1990-01-01",
      bought_date: "1990-01-01",
      company: "TEST",
      product_condition: 1,
      has_packaging: false,
      is_duplicate: false,
      has_cables: false,
      has_console: true,
      monetary_value: 10.35,
      notes: "TEST",
    };

    const response = await request(app)
      .post("/api/consoles")
      .send(failConsoleEntry);
    console.log(response.body);
    expect(response.body.success).toBe(false);
    expect(response.body.message).toBe("region Must Be Defined");
  });

  test("should fail because of missing product_condition", async () => {
    const failConsoleEntry = {
      name: "Test",
      console_type: 1,
      model: "TEST",
      region: 1,
      release_date: "1990-01-01",
      bought_date: "1990-01-01",
      company: "TEST",
      has_packaging: false,
      is_duplicate: false,
      has_cables: false,
      has_console: true,
      monetary_value: 10.35,
      notes: "TEST",
    };

    const response = await request(app)
      .post("/api/consoles")
      .send(failConsoleEntry);
    console.log(response.body);
    expect(response.body.success).toBe(false);
    expect(response.body.message).toBe("product_condition Must Be Defined");
  });

  test("should fail because of missing has_packaging", async () => {
    const failConsoleEntry = {
      name: "Test",
      console_type: 1,
      model: "TEST",
      region: 1,
      release_date: "1990-01-01",
      bought_date: "1990-01-01",
      company: "TEST",
      product_condition: 1,
      is_duplicate: false,
      has_cables: false,
      has_console: true,
      monetary_value: 10.35,
      notes: "TEST",
    };

    const response = await request(app)
      .post("/api/consoles")
      .send(failConsoleEntry);
    console.log(response.body);
    expect(response.body.success).toBe(false);
    expect(response.body.message).toBe("has_packaging Must Be Defined");
  });

  test("should fail because of missing id_duplicate", async () => {
    const failConsoleEntry = {
      name: "Test",
      console_type: 1,
      model: "TEST",
      region: 1,
      release_date: "1990-01-01",
      bought_date: "1990-01-01",
      company: "TEST",
      product_condition: 1,
      has_packaging: false,
      has_cables: false,
      has_console: true,
      monetary_value: 10.35,
      notes: "TEST",
    };

    const response = await request(app)
      .post("/api/consoles")
      .send(failConsoleEntry);
    console.log(response.body);
    expect(response.body.success).toBe(false);
    expect(response.body.message).toBe("is_duplicate Must Be Defined");
  });

  test("should fail because of missing has_cables", async () => {
    const failConsoleEntry = {
      name: "Test",
      console_type: 1,
      model: "TEST",
      region: 1,
      release_date: "1990-01-01",
      bought_date: "1990-01-01",
      company: "TEST",
      product_condition: 1,
      has_packaging: false,
      is_duplicate: false,
      has_console: true,
      monetary_value: 10.35,
      notes: "TEST",
    };

    const response = await request(app)
      .post("/api/consoles")
      .send(failConsoleEntry);
    console.log(response.body);
    expect(response.body.success).toBe(false);
    expect(response.body.message).toBe("has_cables Must Be Defined");
  });

  test("should fail because of missing has_console", async () => {
    const failConsoleEntry = {
      name: "Test",
      console_type: 1,
      model: "TEST",
      region: 1,
      release_date: "1990-01-01",
      bought_date: "1990-01-01",
      company: "TEST",
      product_condition: 1,
      has_packaging: false,
      is_duplicate: false,
      has_cables: false,
      monetary_value: 10.35,
      notes: "TEST",
    };

    const response = await request(app)
      .post("/api/consoles")
      .send(failConsoleEntry);
    console.log(response.body);
    expect(response.body.success).toBe(false);
    expect(response.body.message).toBe("has_console Must Be Defined");
  });
});

describe("PUT Update Console", () => {
  test("should update a console to the database", async () => {
    const response = await request(app)
      .put("/api/consoles/1")
      .send(fullConsoleEntry);
    console.log(response.body);
    expect(response.body.success).toBe(true);
    expect(response.body.message).toBe("Console With id=1 Updated");
    expect(response.body.results.affectedRows).toBe(1);
  });

  test("should fail because of missing name", async () => {
    const failConsoleEntry = {
      console_type: 1,
      model: "TEST",
      region: 1,
      release_date: "1990-01-01",
      bought_date: "1990-01-01",
      company: "TEST",
      product_condition: 1,
      has_packaging: false,
      is_duplicate: false,
      has_cables: false,
      has_console: true,
      monetary_value: 10.35,
      notes: "TEST",
    };

    const response = await request(app)
      .put("/api/consoles/1")
      .send(failConsoleEntry);
    console.log(response.body);
    expect(response.body.success).toBe(false);
    expect(response.body.message).toBe("Console Needs To Have A Name");
  });

  test("should fail because of missing console_type", async () => {
    const failConsoleEntry = {
      name: "Test",
      model: "TEST",
      region: 1,
      release_date: "1990-01-01",
      bought_date: "1990-01-01",
      company: "TEST",
      product_condition: 1,
      has_packaging: false,
      is_duplicate: false,
      has_cables: false,
      has_console: true,
      monetary_value: 10.35,
      notes: "TEST",
    };

    const response = await request(app)
      .put("/api/consoles/1")
      .send(failConsoleEntry);
    console.log(response.body);
    expect(response.body.success).toBe(false);
    expect(response.body.message).toBe("console_type Must Be Defined");
  });

  test("should fail because of missing region", async () => {
    const failConsoleEntry = {
      name: "Test",
      console_type: 1,
      model: "TEST",
      release_date: "1990-01-01",
      bought_date: "1990-01-01",
      company: "TEST",
      product_condition: 1,
      has_packaging: false,
      is_duplicate: false,
      has_cables: false,
      has_console: true,
      monetary_value: 10.35,
      notes: "TEST",
    };

    const response = await request(app)
      .put("/api/consoles/1")
      .send(failConsoleEntry);
    console.log(response.body);
    expect(response.body.success).toBe(false);
    expect(response.body.message).toBe("region Must Be Defined");
  });

  test("should fail because of missing product_condition", async () => {
    const failConsoleEntry = {
      name: "Test",
      console_type: 1,
      model: "TEST",
      region: 1,
      release_date: "1990-01-01",
      bought_date: "1990-01-01",
      company: "TEST",
      has_packaging: false,
      is_duplicate: false,
      has_cables: false,
      has_console: true,
      monetary_value: 10.35,
      notes: "TEST",
    };

    const response = await request(app)
      .put("/api/consoles/1")
      .send(failConsoleEntry);
    console.log(response.body);
    expect(response.body.success).toBe(false);
    expect(response.body.message).toBe("product_condition Must Be Defined");
  });

  test("should fail because of missing has_packaging", async () => {
    const failConsoleEntry = {
      name: "Test",
      console_type: 1,
      model: "TEST",
      region: 1,
      release_date: "1990-01-01",
      bought_date: "1990-01-01",
      company: "TEST",
      product_condition: 1,
      is_duplicate: false,
      has_cables: false,
      has_console: true,
      monetary_value: 10.35,
      notes: "TEST",
    };

    const response = await request(app)
      .put("/api/consoles/1")
      .send(failConsoleEntry);
    console.log(response.body);
    expect(response.body.success).toBe(false);
    expect(response.body.message).toBe("has_packaging Must Be Defined");
  });

  test("should fail because of missing id_duplicate", async () => {
    const failConsoleEntry = {
      name: "Test",
      console_type: 1,
      model: "TEST",
      region: 1,
      release_date: "1990-01-01",
      bought_date: "1990-01-01",
      company: "TEST",
      product_condition: 1,
      has_packaging: false,
      has_cables: false,
      has_console: true,
      monetary_value: 10.35,
      notes: "TEST",
    };

    const response = await request(app)
      .put("/api/consoles/1")
      .send(failConsoleEntry);
    console.log(response.body);
    expect(response.body.success).toBe(false);
    expect(response.body.message).toBe("is_duplicate Must Be Defined");
  });

  test("should fail because of missing has_cables", async () => {
    const failConsoleEntry = {
      name: "Test",
      console_type: 1,
      model: "TEST",
      region: 1,
      release_date: "1990-01-01",
      bought_date: "1990-01-01",
      company: "TEST",
      product_condition: 1,
      has_packaging: false,
      is_duplicate: false,
      has_console: true,
      monetary_value: 10.35,
      notes: "TEST",
    };

    const response = await request(app)
      .put("/api/consoles/1")
      .send(failConsoleEntry);
    console.log(response.body);
    expect(response.body.success).toBe(false);
    expect(response.body.message).toBe("has_cables Must Be Defined");
  });

  test("should fail because of missing has_console", async () => {
    const failConsoleEntry = {
      name: "Test",
      console_type: 1,
      model: "TEST",
      region: 1,
      release_date: "1990-01-01",
      bought_date: "1990-01-01",
      company: "TEST",
      product_condition: 1,
      has_packaging: false,
      is_duplicate: false,
      has_cables: false,
      monetary_value: 10.35,
      notes: "TEST",
    };

    const response = await request(app)
      .put("/api/consoles/1")
      .send(failConsoleEntry);
    console.log(response.body);
    expect(response.body.success).toBe(false);
    expect(response.body.message).toBe("has_console Must Be Defined");
  });
});

describe("DELETE Console", () => {
  test("should delete a console from the database", async () => {
    const response = await request(app).delete("/api/consoles/1");
    console.log(response.body);
    expect(response.body.success).toBe(true);
    expect(response.body.message).toBe(
      "Successfully Deleted Console With Id=1",
    );
    expect(response.body.results.affectedRows).toBe(1);
  });
});

describe("GET All Games", () => {
  test("should get a successful response with games", async () => {
    const response = await request(app).get("/api/games");
    console.log(response.body);
    expect(response.body.success).toBe(true);
    expect(response.body.results.length).toBe(3);
  });
});

describe("GET Specific Game Info", () => {
  test("should get a successful response with a game", async () => {
    const response = await request(app).get("/api/games/1");
    console.log(response.body);
    expect(response.body.success).toBe(true);
    expect(response.body.results.length).toBe(1);
  });
});

describe("POST New Game", () => {
  test("should add a game to the database", async () => {
    const response = await request(app).post("/api/games").send(fullGameEntry);
    console.log(response.body);
    expect(response.body.success).toBe(true);
    expect(response.body.message).toBe("Game Created");
    expect(response.body.results.affectedRows).toBe(1);
  });

  test("should fail because of missing name", async () => {
    const failGameEntry = {
      console_id: 10,
      edition: "Original",
      release_date: "1990-01-01",
      bought_date: "1990-01-01",
      region: 1,
      developer: "DEVELOPER",
      publisher: "PUBLISHER",
      digital: false,
      has_game: true,
      has_manual: true,
      has_box: true,
      is_duplicate: false,
      product_condition: 1,
      monetary_value: 12.34,
      notes: "FULL HAPPY PATH",
    };

    const response = await request(app).post("/api/games").send(failGameEntry);
    console.log(response.body);
    expect(response.body.success).toBe(false);
    expect(response.body.message).toBe("Game Needs To Have A Name");
  });

  test("should fail because of missing console_id", async () => {
    const failGameEntry = {
      name: "TEST",
      edition: "Original",
      release_date: "1990-01-01",
      bought_date: "1990-01-01",
      region: 1,
      developer: "DEVELOPER",
      publisher: "PUBLISHER",
      digital: false,
      has_game: true,
      has_manual: true,
      has_box: true,
      is_duplicate: false,
      product_condition: 1,
      monetary_value: 12.34,
      notes: "FULL HAPPY PATH",
    };

    const response = await request(app).post("/api/games").send(failGameEntry);
    console.log(response.body);
    expect(response.body.success).toBe(false);
    expect(response.body.message).toBe("console_id Must Be Defined");
  });

  test("should fail because of missing digital", async () => {
    const failGameEntry = {
      console_id: 10,
      name: "TEST",
      edition: "Original",
      release_date: "1990-01-01",
      bought_date: "1990-01-01",
      region: 1,
      developer: "DEVELOPER",
      publisher: "PUBLISHER",
      has_game: true,
      has_manual: true,
      has_box: true,
      is_duplicate: false,
      product_condition: 1,
      monetary_value: 12.34,
      notes: "FULL HAPPY PATH",
    };

    const response = await request(app).post("/api/games").send(failGameEntry);
    console.log(response.body);
    expect(response.body.success).toBe(false);
    expect(response.body.message).toBe("digital Must Be Defined");
  });

  test("should fail because of missing region", async () => {
    const failGameEntry = {
      console_id: 10,
      name: "TEST",
      edition: "Original",
      release_date: "1990-01-01",
      bought_date: "1990-01-01",
      developer: "DEVELOPER",
      publisher: "PUBLISHER",
      digital: false,
      has_game: true,
      has_manual: true,
      has_box: true,
      is_duplicate: false,
      product_condition: 1,
      monetary_value: 12.34,
      notes: "FULL HAPPY PATH",
    };

    const response = await request(app).post("/api/games").send(failGameEntry);
    console.log(response.body);
    expect(response.body.success).toBe(false);
    expect(response.body.message).toBe("region Must Be Defined");
  });

  test("should fail because of missing product_condition", async () => {
    const failGameEntry = {
      console_id: 10,
      name: "TEST",
      edition: "Original",
      release_date: "1990-01-01",
      bought_date: "1990-01-01",
      region: 1,
      developer: "DEVELOPER",
      publisher: "PUBLISHER",
      digital: false,
      has_game: true,
      has_manual: true,
      has_box: true,
      is_duplicate: false,
      monetary_value: 12.34,
      notes: "FULL HAPPY PATH",
    };

    const response = await request(app).post("/api/games").send(failGameEntry);
    console.log(response.body);
    expect(response.body.success).toBe(false);
    expect(response.body.message).toBe("product_condition Must Be Defined");
  });

  test("should fail because of missing has_box", async () => {
    const failGameEntry = {
      console_id: 10,
      name: "TEST",
      edition: "Original",
      release_date: "1990-01-01",
      bought_date: "1990-01-01",
      region: 1,
      developer: "DEVELOPER",
      publisher: "PUBLISHER",
      digital: false,
      has_game: true,
      has_manual: true,
      is_duplicate: false,
      product_condition: 1,
      monetary_value: 12.34,
      notes: "FULL HAPPY PATH",
    };

    const response = await request(app).post("/api/games").send(failGameEntry);
    console.log(response.body);
    expect(response.body.success).toBe(false);
    expect(response.body.message).toBe("has_box Must Be Defined");
  });

  test("should fail because of missing is_duplicate", async () => {
    const failGameEntry = {
      console_id: 10,
      name: "TEST",
      edition: "Original",
      release_date: "1990-01-01",
      bought_date: "1990-01-01",
      region: 1,
      developer: "DEVELOPER",
      publisher: "PUBLISHER",
      digital: false,
      has_game: true,
      has_manual: true,
      has_box: true,
      product_condition: 1,
      monetary_value: 12.34,
      notes: "FULL HAPPY PATH",
    };

    const response = await request(app).post("/api/games").send(failGameEntry);
    console.log(response.body);
    expect(response.body.success).toBe(false);
    expect(response.body.message).toBe("is_duplicate Must Be Defined");
  });

  test("should fail because of missing has_manual", async () => {
    const failGameEntry = {
      console_id: 10,
      name: "TEST",
      edition: "Original",
      release_date: "1990-01-01",
      bought_date: "1990-01-01",
      region: 1,
      developer: "DEVELOPER",
      publisher: "PUBLISHER",
      digital: false,
      has_game: true,
      has_box: true,
      is_duplicate: false,
      product_condition: 1,
      monetary_value: 12.34,
      notes: "FULL HAPPY PATH",
    };

    const response = await request(app).post("/api/games").send(failGameEntry);
    console.log(response.body);
    expect(response.body.success).toBe(false);
    expect(response.body.message).toBe("has_manual Must Be Defined");
  });

  test("should fail because of missing has_game", async () => {
    const failGameEntry = {
      console_id: 10,
      name: "TEST",
      edition: "Original",
      release_date: "1990-01-01",
      bought_date: "1990-01-01",
      region: 1,
      developer: "DEVELOPER",
      publisher: "PUBLISHER",
      digital: false,
      has_manual: true,
      has_box: true,
      is_duplicate: false,
      product_condition: 1,
      monetary_value: 12.34,
      notes: "FULL HAPPY PATH",
    };

    const response = await request(app).post("/api/games").send(failGameEntry);
    console.log(response.body);
    expect(response.body.success).toBe(false);
    expect(response.body.message).toBe("has_game Must Be Defined");
  });
});

describe("PUT Update Game", () => {
  test("should add a game to the database", async () => {
    const response = await request(app).put("/api/games/1").send(fullGameEntry);
    console.log(response.body);
    expect(response.body.success).toBe(true);
    expect(response.body.message).toBe("Game With id=1 Updated");
    expect(response.body.results.affectedRows).toBe(1);
  });

  test("should fail because of missing name", async () => {
    const failGameEntry = {
      console_id: 10,
      edition: "Original",
      release_date: "1990-01-01",
      bought_date: "1990-01-01",
      region: 1,
      developer: "DEVELOPER",
      publisher: "PUBLISHER",
      digital: false,
      has_game: true,
      has_manual: true,
      has_box: true,
      is_duplicate: false,
      product_condition: 1,
      monetary_value: 12.34,
      notes: "FULL HAPPY PATH",
    };

    const response = await request(app).put("/api/games/1").send(failGameEntry);
    console.log(response.body);
    expect(response.body.success).toBe(false);
    expect(response.body.message).toBe("Game Needs To Have A Name");
  });

  test("should fail because of missing console_id", async () => {
    const failGameEntry = {
      name: "TEST",
      edition: "Original",
      release_date: "1990-01-01",
      bought_date: "1990-01-01",
      region: 1,
      developer: "DEVELOPER",
      publisher: "PUBLISHER",
      digital: false,
      has_game: true,
      has_manual: true,
      has_box: true,
      is_duplicate: false,
      product_condition: 1,
      monetary_value: 12.34,
      notes: "FULL HAPPY PATH",
    };

    const response = await request(app).put("/api/games/1").send(failGameEntry);
    console.log(response.body);
    expect(response.body.success).toBe(false);
    expect(response.body.message).toBe("console_id Must Be Defined");
  });

  test("should fail because of missing digital", async () => {
    const failGameEntry = {
      console_id: 10,
      name: "TEST",
      edition: "Original",
      release_date: "1990-01-01",
      bought_date: "1990-01-01",
      region: 1,
      developer: "DEVELOPER",
      publisher: "PUBLISHER",
      has_game: true,
      has_manual: true,
      has_box: true,
      is_duplicate: false,
      product_condition: 1,
      monetary_value: 12.34,
      notes: "FULL HAPPY PATH",
    };

    const response = await request(app).put("/api/games/1").send(failGameEntry);
    console.log(response.body);
    expect(response.body.success).toBe(false);
    expect(response.body.message).toBe("digital Must Be Defined");
  });

  test("should fail because of missing region", async () => {
    const failGameEntry = {
      console_id: 10,
      name: "TEST",
      edition: "Original",
      release_date: "1990-01-01",
      bought_date: "1990-01-01",
      developer: "DEVELOPER",
      publisher: "PUBLISHER",
      digital: false,
      has_game: true,
      has_manual: true,
      has_box: true,
      is_duplicate: false,
      product_condition: 1,
      monetary_value: 12.34,
      notes: "FULL HAPPY PATH",
    };

    const response = await request(app).put("/api/games/1").send(failGameEntry);
    console.log(response.body);
    expect(response.body.success).toBe(false);
    expect(response.body.message).toBe("region Must Be Defined");
  });

  test("should fail because of missing product_condition", async () => {
    const failGameEntry = {
      console_id: 10,
      name: "TEST",
      edition: "Original",
      release_date: "1990-01-01",
      bought_date: "1990-01-01",
      region: 1,
      developer: "DEVELOPER",
      publisher: "PUBLISHER",
      digital: false,
      has_game: true,
      has_manual: true,
      has_box: true,
      is_duplicate: false,
      monetary_value: 12.34,
      notes: "FULL HAPPY PATH",
    };

    const response = await request(app).put("/api/games/1").send(failGameEntry);
    console.log(response.body);
    expect(response.body.success).toBe(false);
    expect(response.body.message).toBe("product_condition Must Be Defined");
  });

  test("should fail because of missing has_box", async () => {
    const failGameEntry = {
      console_id: 10,
      name: "TEST",
      edition: "Original",
      release_date: "1990-01-01",
      bought_date: "1990-01-01",
      region: 1,
      developer: "DEVELOPER",
      publisher: "PUBLISHER",
      digital: false,
      has_game: true,
      has_manual: true,
      is_duplicate: false,
      product_condition: 1,
      monetary_value: 12.34,
      notes: "FULL HAPPY PATH",
    };

    const response = await request(app).put("/api/games/1").send(failGameEntry);
    console.log(response.body);
    expect(response.body.success).toBe(false);
    expect(response.body.message).toBe("has_box Must Be Defined");
  });

  test("should fail because of missing is_duplicate", async () => {
    const failGameEntry = {
      console_id: 10,
      name: "TEST",
      edition: "Original",
      release_date: "1990-01-01",
      bought_date: "1990-01-01",
      region: 1,
      developer: "DEVELOPER",
      publisher: "PUBLISHER",
      digital: false,
      has_game: true,
      has_manual: true,
      has_box: true,
      product_condition: 1,
      monetary_value: 12.34,
      notes: "FULL HAPPY PATH",
    };

    const response = await request(app).put("/api/games/1").send(failGameEntry);
    console.log(response.body);
    expect(response.body.success).toBe(false);
    expect(response.body.message).toBe("is_duplicate Must Be Defined");
  });

  test("should fail because of missing has_manual", async () => {
    const failGameEntry = {
      console_id: 10,
      name: "TEST",
      edition: "Original",
      release_date: "1990-01-01",
      bought_date: "1990-01-01",
      region: 1,
      developer: "DEVELOPER",
      publisher: "PUBLISHER",
      digital: false,
      has_game: true,
      has_box: true,
      is_duplicate: false,
      product_condition: 1,
      monetary_value: 12.34,
      notes: "FULL HAPPY PATH",
    };

    const response = await request(app).put("/api/games/1").send(failGameEntry);
    console.log(response.body);
    expect(response.body.success).toBe(false);
    expect(response.body.message).toBe("has_manual Must Be Defined");
  });

  test("should fail because of missing has_game", async () => {
    const failGameEntry = {
      console_id: 10,
      name: "TEST",
      edition: "Original",
      release_date: "1990-01-01",
      bought_date: "1990-01-01",
      region: 1,
      developer: "DEVELOPER",
      publisher: "PUBLISHER",
      digital: false,
      has_manual: true,
      has_box: true,
      is_duplicate: false,
      product_condition: 1,
      monetary_value: 12.34,
      notes: "FULL HAPPY PATH",
    };

    const response = await request(app).put("/api/games/1").send(failGameEntry);
    console.log(response.body);
    expect(response.body.success).toBe(false);
    expect(response.body.message).toBe("has_game Must Be Defined");
  });
});

describe("DELETE Game", () => {
  test("should delete a game from the database", async () => {
    const response = await request(app).delete("/api/games/1");
    console.log(response.body);
    expect(response.body.success).toBe(true);
    expect(response.body.message).toBe("Successfully Deleted Game With Id=1");
    expect(response.body.results.affectedRows).toBe(1);
  });
});
