const express = require("express");
const app = express();
const connectDB = require("./config/db");
const PORT = process.env.PORT || 5000;

connectDB();

app.use(express.json({ extended: false }));

app.get("/", (req, res) => res.send("API is Running"));

app.use("/api/admin", require("./routes/api/admin"));
app.use("/api/users", require("./routes/api/users"));
app.use("/api/auth", require("./routes/api/auth"));
app.use("/api/profile", require("./routes/api/profile"));
app.use("/api/pullbox", require("./routes/api/pullbox"));

app.listen(PORT, () => console.log(`Server Started On Port ${PORT}.`));
