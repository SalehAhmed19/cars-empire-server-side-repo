// Zv3pa1mUsCSHyVCe
// carsEmpire
const express = require("express");
const cors = require("cors");
const port = process.env.PORT || 4000;
const app = express();
// middleware
app.use(cors());
app.use(express.json());
