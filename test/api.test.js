const request = require("supertest");
const sinon = require("sinon");
const api = require("../routes/api");
const { fullConsoleEntry, allConsolesResult } = require("./api.test.data");
const { makeApp } = require("../app");

const getConsoles = jest.fn();

const mockDB = {
  getConsoles,
};

describe("Healthcheck Test", () => {
  const app = makeApp({});
  app.use("/", api);

  it("should respond with a successful response", async () => {
    const response = await request(app).get("/healthcheck");
    console.log(response);
    expect(response.status).toBe(200);
    expect(response.body["success"]).toBe(true);
  });
});

describe("Getting All Console Info Test", () => {
  beforeEach(() => {
    getConsoles.mockReset();
    getConsoles.mockResolvedValue(allConsolesResult);
  });
  const app = makeApp(mockDB);
  test("Responds with json content", async () => {
    getConsoles.mockReset();
    getConsoles.mockResolvedValue(allConsolesResult);
    const response = await request(app).get("/consoles");

    console.log(response.body);
    console.log(response.headers["content-type"]);
    console.log(response.headers);
  });
});

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
