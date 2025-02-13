const express = require("express");
const Bus = require("../model/bus.model");
const Booking = require("../model/booking.model");

const router = express.Router();

// To Get Available Seats
router.get("/bus/:busId/seats", async (req, res) => {
  try {
    const { busId } = req.params;

    const bus = await Bus.findByPk(busId);

    if (!bus) {
      return res.status(404).json({ message: "Bus not found" });
    }

    return res.status(200).json({ availableSeats: bus.seats });
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
});

// To Get All Bookings
router.get('/bookings', async(req, res) => {
  try {
    const bookings = await Booking.findAll();

    return res.status(200).json({success: true, bookings})
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
})

// To Book Seats In Bus
router.post("/bus/:busId/book", async (req, res) => {
  try {
    const { busId } = req.params;
    const { userEmail, seats, origin, destination, departureTime } = req.body;

    if (!Array.isArray(seats) || seats.length < 1 || seats.length > 4) {
      return res.status(400).json({ message: "You can only book 1-4 seats" });
    }

    const bus = await Bus.findByPk(busId);

    if (!bus) {
      return res.status(404).json({ message: "Bus not found" });
    }

    let updatedSeats = { ...bus.seats };

    // // Check Seat Availability
    // for (let seat of seats) {
    //   if (updatedSeats[seat] !== "AVAILABLE") {
    //     return res
    //       .status(400)
    //       .json({ message: `Seat ${seats} is already reserved.` });
    //   }
    // }

    // Update seat status
    for (let seat of seats) {
      updatedSeats[seat] = "RESERVED";
    }

    await bus.update({ seats: updatedSeats }, { id: { busId } });

    // Create Booking
    const booking = await Booking.create({
      busId,
      seats,
      userEmail,
      status: "CONFIRMED",
      origin,
      destination,
      departureTime
    });

    return res
      .status(201)
      .json({ message: "Seats booked successfully!", booking });
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
});

router.post("/booking/:bookingId/cancel", async (req, res) => {
  try {
    const { bookingId } = req.params;

    // Find the booking
    const booking = await Booking.findByPk(bookingId);
    if (!booking) {
      return res.status(404).json({ message: "Booking not found" });
    }

    // Find the corresponding bus
    const bus = await Bus.findByPk(booking.busId);
    if (!bus) {
      return res.status(404).json({ message: "Bus not found" });
    }

    let departureTime = bus.departureTime; 
    console.log("Stored Departure Time:", departureTime);

    if (!departureTime) {
      return res.status(500).json({ message: "Invalid departure time" });
    }

    // Convert departureTime (HH:MM:SS) into a full Date object
    const now = new Date();
    let [hours, minutes, seconds] = departureTime.split(":").map(Number);

    let departureDate = new Date(now); 
    departureDate.setHours(hours, minutes, seconds, 0);

    // If the departure time has already passed today, assume it's for the next day
    if (departureDate < now) {
      departureDate.setDate(departureDate.getDate() + 1);
    }

    console.log("Updated Departure Date:", departureDate);

    // Calculate time difference in minutes
    const diffMinutes = Math.floor((departureDate - now) / (1000 * 60));
    console.log("Time Difference in Minutes:", diffMinutes);

    // Check if cancellation is allowed (at least 30 minutes before departure)
    if (diffMinutes < 30) {
      return res
        .status(400)
        .json({ message: "Cannot cancel within 30 minutes of departure." });
    }

    // Check if booking is already cancelled
    if (booking.status === "CANCELLED") {
      return res.status(400).json({ message: "Booking is already cancelled." });
    }

    // Update seat statuses to AVAILABLE
    let updatedSeats = { ...bus.seats };
    booking.seats.forEach((seat) => {
      updatedSeats[seat] = "AVAILABLE";
    });

    // Update the database
    await bus.update({ seats: updatedSeats });
    await booking.update({ status: "CANCELLED" });

    return res.status(200).json({ message: "Booking cancelled successfully." });
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
});

module.exports = router;
