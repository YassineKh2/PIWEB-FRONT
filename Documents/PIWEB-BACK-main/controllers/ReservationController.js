const Reservation = require('../models/Reservation')
const Ticket =require('../models/Ticket')

async function add(req,res){
    try{
    const reservation=new Reservation(req.body);
  await  reservation.save();
  const ticket = new Ticket({ reservation: reservation._id });
  await ticket.save();
    res.status(200).send('add');
    }catch(err){
        res.status(400).json({error:err});
    }
}
async function getall (req,res){
    try{
    const data =await Reservation.find()
    res.send(data)
    }  catch(err){
        res.status(400).json({error:err});
    }


}
async function getbyid(req,res){
    try{
    const data =await Reservation.findById(req.params.id)
    res.status(200).send(data)
    }  catch(err){
        res.status(400).json({error:err});
    }


}
async function getbyplace(req, res) {
    try {
        const data = await Reservation.findOne({ nbplace: req.params.nbplace });
        res.status(200).send(data);
    } catch (err) {
        res.status(400).json({ error: err });
    }
}



async function updateres(req, res) {
    try {
        const reservationId = req.params.id;
        const { nbplace } = req.body; 

        await Reservation.findByIdAndUpdate(reservationId, { nbplace });

        const updatedReservation = await Reservation.findById(reservationId);

        const ticket = await Ticket.findOneAndUpdate(
            { reservation: reservationId },
            { reservation: updatedReservation._id },
            { new: true }
        );

        res.status(200).send('updated');
    } catch (err) {
        res.status(400).json({ error: err });
    }
}


async function deleteres(req, res) {
    try {
        const reservationId = req.params.id;
        
       
        await Reservation.findOneAndDelete({ _id: reservationId });

      
        await Ticket.findOneAndDelete({ reservation: reservationId });

        res.status(200).send('deleted');
    } catch (err) {
        res.status(400).json({ error: err });
    }
}

async function getbydate(req,res){
    try{
        let date=req.params.data
    const data =await Reservation.findOne({date})
    res.status(200).send(data)
    }  catch(err){
        res.status(400).json({error:err});
    }


}


async function tridesc(req, res) {
    try {
        const data = await Reservation.find().sort({ date: -1 }); // Tri descendant par date
        res.send(data);
    } catch (err) {
        res.status(400).json({ error: err });
    }
}

async function triasc(req, res) {
    try {
        const data = await Reservation.find().sort({ date: 1 }); // Tri ascendant par date
        res.send(data);
    } catch (err) {
        res.status(400).json({ error: err });
    }
}

module.exports={add,getall,getbyid,updateres,deleteres,getbydate,tridesc,triasc,getbyplace}