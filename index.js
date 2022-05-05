// Zv3pa1mUsCSHyVCe
// carsEmpire
const { MongoClient, ServerApiVersion, ObjectId } = require("mongodb");
const express = require("express");
const cors = require("cors");
const jwt = require("jsonwebtoken");
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
    const myItemCollection = client.db("carsEmpire").collection("my-items");
    /* all cars API */
    app.get("/cars", async (req, res) => {
      const query = {};
      const cursor = carsCollection.find(query);
      const cars = await cursor.toArray();
      res.send(cars);
    });
    /* single car API */
    app.get("/cars/:id", async (req, res) => {
      const id = req.params.id;
      const query = { _id: ObjectId(id) };
      const car = await carsCollection.findOne(query);
      res.send(car);
    });
    /* single car delete API */
    app.delete("/cars/:id", async (req, res) => {
      const id = req.params.id;
      const query = { _id: ObjectId(id) };
      const result = await carsCollection.deleteOne(query);
      res.send(result);
    });
    /* new car insert API */
    app.post("/cars", async (req, res) => {
      const newCar = req.body;
      const result = await carsCollection.insertOne(newCar);
      res.send(result);
    });
    /* my items API */
    app.post("/my-items", async (req, res) => {
      const newItem = req.body;
      const result = await myItemCollection.insertOne(newItem);
      res.send(result);
    });
    /* my items get API */
    app.get("/my-items", async (req, res) => {
      const email = req.query.email;
      console.log(email);
      const query = { email: email };
      const cursor = myItemCollection.find(query);
      const myItems = await cursor.toArray();
      res.send(myItems);
    });
    /* item quantity update API */
    app.put("/cars/:id", async (req, res) => {
      const id = req.params.id;
      const updateCar = req.body;
      const filter = { _id: ObjectId(id) };
      const options = { upsert: true };
      const update = {
        $set: {
          quantity: updateCar.quantity,
        },
      };
      const result = await carsCollection.updateOne(filter, update, options);
      res.send(result);
    });
    /* item delete API from my items */
    app.delete("/my-items/:id", async (req, res) => {
      const id = req.params.id;
      const query = { _id: ObjectId(id) };
      const result = await myItemCollection.deleteOne(query);
      const result2 = await carsCollection.deleteOne(query);
      res.send(result, result2);
    });
    /* specific user access token API */
    app.post("/login", async (req, res) => {
      const user = req.body;
      const accessToken = jwt.sign(user, process.env.ACCESS_TOKEN_SECRET, {
        expiresIn: "1d",
      });
      res.send(accessToken);
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
