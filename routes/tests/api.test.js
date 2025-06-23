import { describe, expect, test } from "vitest";
import request from "supertest";
import { router } from "../api";
import makeApp from "../../app";
import express from "express";
import bodyParser from "body-parser";

describe("API Healthcheck", () => {
  test("should get a successful response", async () => {
    var app = makeApp();
    const response = await request(app).get("/api/healthcheck");
    expect(response.body.success).toBe(true);
  });
});
