const express = require("express");
const cors = require("cors");
const app = express();
require("dotenv").config({ path: "./.env" });
const sequelize = require("./config/config");
const busRooute = require("./routes/bus.route");
const seatRoutes = require("./routes/seat.route");

// Middlewares
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cors());

// Routes
app.use('/api/v1', busRooute);
app.use('/api/v1', seatRoutes);

sequelize
  .authenticate()
  .then(() => {
    console.log("Database connected successfully!");
    return sequelize.sync(); // Sync models
  })
  .then(() => {
    console.log("Database synchronized");
    app.listen(process.env.PORT || 5000, () => {
      console.log(
        "Jay Shree Ram - Server running on port",
        process.env.PORT || 5000
      );
    });
  })
  .catch((err) => {
    console.error("Error connecting to the database:", err);
  });
