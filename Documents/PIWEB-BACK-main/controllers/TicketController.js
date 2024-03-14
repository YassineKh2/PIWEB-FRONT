const Ticket = require('../models/Ticket');

async function getRecentlyAddedTicket(req, res) {
    try {
        const data = await Ticket.findOne().sort({ createdAt: -1, _id: -1 }).populate('reservation', 'date nbplace');
        
        res.send(data);
    } catch (err) {
        res.status(400).json({ error: err.message });
    }
}
async function getallticket(req, res) {
    try {
        const data = await Ticket.find().populate('reservation', 'date nbplace');
        res.send(data);
    } catch (err) {
        res.status(400).json({ error: err });
    }
}


module.exports = { getRecentlyAddedTicket,getallticket };
