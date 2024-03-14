const yup=require('yup');
const { schema } = require('../models/Reservation');

const validate = async(req,res,next)=>{
    try{
    const schema=yup.object().shape({
      
    
        nbplace:yup.string().required(),
       
         

    
    }) ;  
    await schema.validate(req.body);
    next()
 } catch(err){
    res.status(400).json({error:err})

    
}};
module.exports=validate;