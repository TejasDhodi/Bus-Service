const { DataTypes } = require("sequelize");
const sequelize = require("../config/config");

const Bus = sequelize.define("Bus", {
  id: {
    type: DataTypes.UUID,
    defaultValue: DataTypes.UUIDV4,
    primaryKey: true,
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
  route: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  totalSeats: {
    type: DataTypes.INTEGER,
    defaultValue: 40,
  },
  seats: {
    type: DataTypes.JSONB,
    allowNull: false,
    defaultValue: {},
  },
}, {
  hooks: {
    beforeCreate: (bus) => {
      let seats = {};
      for (let i = 1; i <= bus.totalSeats; i++) {
        seats[`S${i}`] = "AVAILABLE";
      }
      bus.seats = seats;
    }
  }
});

module.exports = Bus;
