import { describe, expect, test, vi, afterEach } from "vitest";
import request from "supertest";
import { router } from "../api";
import makeApp from "../../app";
import express from "express";
import bodyParser from "body-parser";
import { fullConsoleEntry, allConsolesResult } from "./api.test.data.js";
import { getMockReq, getMockRes } from "vitest-mock-express";

const Database = vi.fn(function () {});
Database.prototype.getConsoles = vi.fn(() => allConsolesResult);
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
