// Zv3pa1mUsCSHyVCe
// carsEmpire
const { MongoClient, ServerApiVersion, ObjectId } = require("mongodb");
const express = require("express");
const cors = require("cors");
const port = process.env.PORT || 4000;
const app = express();
require("dotenv").config();
// middleware
app.use(cors());
app.use(express.json());

const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.rzir2.mongodb.net/myFirstDatabase?retryWrites=true&w=majority`;
const client = new MongoClient(uri, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
  serverApi: ServerApiVersion.v1,
});
async function run() {
  try {
    await client.connect();
    const carsCollection = client.db("carsEmpire").collection("cars");
    app.get("/cars", async (req, res) => {
      const query = {};
      const cursor = carsCollection.find(query);
      const cars = await cursor.toArray();
      res.send(cars);
    });
    app.get("/cars/:id", async (req, res) => {
      const id = req.params.id;
      const query = { _id: ObjectId(id) };
      const car = await carsCollection.findOne(query);
      res.send(car);
    });
    app.get("/cars/:id", async (req, res) => {
      const id = req.params.id;
      const query = { _id: ObjectId(id) };
      const result = await carsCollection.deleteOne(query);
      res.send(result);
    });
  } finally {
  }
}
run().catch(console.dir);

app.get("/", (req, res) => {
  res.send("Server is running");
});
app.get("/heroku", (req, res) => {
  res.send("Heroku Added");
});
app.listen(port, () => {
  console.log("Listening to port: ", port);
});
