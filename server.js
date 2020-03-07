const express = require("express");
const app = express();
const connectDB = require("./config/db");
const PORT = process.env.PORT || 5000;

connectDB();

app.use(express.json({ extended: false }));

app.get("/", (req, res) => res.send("API is Running"));

app.listen(PORT, () => console.log(`Server Started On Port ${PORT}.`));
