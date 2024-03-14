const mongo=require("mongoose")

const Schema=mongo.Schema

const Reservation= new Schema ({

    date:Date,
    nbplace:String,
    prix:Number,

})


module.exports= mongo.model("Reservation",Reservation)
