var express = require("express");
var router = express.Router();
const reservation=require("../models/Reservation.js");
const validate=require("../middleware/validate.js")

const resController=require('../controllers/ReservationController.js')

router.get('/',function(req,res){
    res.send('helllo');
});


router.post('/add' , validate,resController.add)
router.get('/getallReservations',resController.getall)
router.get('/getbyid/:id',resController.getbyid)
router.get('/getbydate/:date',resController.getbydate)
router.put('/update/:id', validate ,resController.updateres)
router.delete('/delete/:id',resController.deleteres)
router.get('/tridesc',resController.tridesc)
router.get('/triasc',resController.triasc)
router.get('/getbyplace/:nbplace',resController.getbyplace)
module.exports = router;