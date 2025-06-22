import request from "supertest";
import makeApp from "./app.js";
import { jest } from "@jest/globals";
import { fullConsoleEntry, allConsolesResult } from "./api.test.data.js";

const getConsoles = jest.fn();

const mockDB = {
  getConsoles,
};
const app = makeApp(mockDB);

describe("Healthcheck Test", () => {
  test("should respond with a successful response", async () => {
    const response = await request(app).get("api/healthcheck");
    expect(response.status).toBe(200);
    expect(response.body["success"]).toBe(true);
  });
});

/*describe("Getting All Console Info Test", () => {
  beforeEach(() => {
    getConsoles.mockReset();
    app.database = mockDB;
  });

  test("Responds with json content", async () => {
    app.database = mockDB;
    getConsoles.mockResolvedValue({
      success: allConsolesResult.success,
      results: allConsolesResult.results,
    });
    const response = await request(app).get("/api/consoles");
    expect(response.body.success).toBe(true);
    expect(response.body.results).toBe(allConsolesResult.results);
  });
});
*/

/*describe("Adding New Console Test", () => {
  const app = express();
  app.use(express.json());
  app.use("/", api);
  it("Responds with json content", async () => {


    const response = await request(app)
      .post("/consoles")
      .send(fullConsoleEntry)
      .expect(201);

    console.log(response.body);
    console.log(response.headers["content-type"]);
    console.log(response.headers);

    expect(response.headers["content-type"]).toMatch(/json/);
  });
});
*/
