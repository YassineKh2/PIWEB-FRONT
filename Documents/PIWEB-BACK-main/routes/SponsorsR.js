var express = require("express");
var router = express.Router();
const sponsor=require("../models/Sponsors.js");

const validates=require("../middleware/validates.js")
const spController=require('../controllers/SponsorsController.js')

router.get('/',function(req,res){
    res.send('helllo');
});


router.post('/add' ,validates,spController.add)
router.get('/getallsp',spController.getall)

router.get('/getbyid/:id',spController.getbyidsp)
router.put('/update/:id',validates,spController.updatesp)
router.delete('/delete/:id',spController.deletesp)
router.get('/getbyname/:name', spController.getbyname);

router.get('/tridesc',spController.tridesc)
router.get('/triasc',spController.triasc)
module.exports = router;