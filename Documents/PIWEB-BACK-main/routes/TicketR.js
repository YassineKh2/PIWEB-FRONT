var express =require("express");
var router = express.Router();
const sponsor=require("../models/Sponsors.js");

const validates=require("../middleware/validates.js")
const tkController=require('../controllers/TicketController.js')

router.get('/',function(req,res){
    res.send('helllo');
});



router.get('/getall',tkController.getRecentlyAddedTicket)
router.get('/getallticket',tkController.getallticket)



module.exports = router;