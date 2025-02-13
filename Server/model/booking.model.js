const { DataTypes } = require("sequelize");
const sequelize = require("../config/config");

const Booking = sequelize.define("Booking", {
  id: {
    type: DataTypes.UUID,
    defaultValue: DataTypes.UUIDV4,
    primaryKey: true,
  },
  busId: {
    type: DataTypes.UUID,
    allowNull: false,
  },
  seats: {
    type: DataTypes.ARRAY(DataTypes.STRING),
    allowNull: false
  },
  userEmail: {
    type: DataTypes.STRING,
    allowNull: false
  },
  origin: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  destination: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  departureTime: {
    type: DataTypes.TIME, 
    allowNull: false,
  },
  status: {
    type: DataTypes.ENUM("PENDING", "CONFIRMED", "CANCELLED"),
    defaultValue: "PENDING"
  }
});

module.exports = Booking;
