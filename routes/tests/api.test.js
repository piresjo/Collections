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
  deleteResult
} from "./api.test.data.js";

const Database = vi.fn(function () {});
Database.prototype.getConsoles = vi.fn(() => allConsolesResult);
Database.prototype.getConsoleInformation = vi.fn(() => consoleInfoResponse);
Database.prototype.addConsole = vi.fn(() => createResult);
Database.prototype.updateConsole = vi.fn(() => updateResult);
Database.prototype.deleteConsole = vi.fn(() => deleteResult);
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
