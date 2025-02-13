const express = require("express");
const Bus = require("../model/bus.model");
const { where } = require("sequelize");

const router = express.Router();

// To Create Bus 
router.post("/bookBus", async (req, res) => {
  try {
    const { origin, destination, departureTime, route } = req.body;
    const busData = await Bus.create({
      origin,
      destination,
      departureTime,
      route,
    });
    return res.status(201).json({ busData });
  } catch (error) {
    console.log({ error });
    return res.status(500).json({ error: error.message });
  }
});

// To Get all Bus
router.get("/allBus", async (req, res) => {
  try {
    const bus = await Bus.findAll();

    return res.status(200).json({ success: true, bus });
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
});

// To Get routed bus
router.get("/getBus/:routeId", async (req, res) => {
  try {
    const { routeId } = req.params;
    const buses = await Bus.findAll({
      where: { route: routeId },
    });

    return res.status(200).json({ success: true, buses });
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
});
module.exports = router;
