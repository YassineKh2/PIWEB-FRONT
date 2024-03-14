const mongo = require("mongoose");
const Reservation = require('../models/Reservation');

const Schema = mongo.Schema;

const Ticket = new Schema({
    reservation: {
        type: Schema.Types.ObjectId,
        ref: 'Reservation',
        required: true
    }
});

module.exports = mongo.model("Ticket", Ticket);
