const mongo = require("mongoose");
const Schema = mongo.Schema;

const Role = {
    ADMIN:'A',
    CLIENT:'C',
    TEAMMANAGER:'TM',
    TournamentManager:'TRM'
};
const User = new Schema({

    firstName: String,
    lastName:String,
    cin:Number,
    email:String,
    birthDate:{ type: Date, default: Date.now },
    password:String,
    createdAt: { type: Date, default: Date.now },
    role: { type: String, enum: Object.values(Role) },
    image:{type:String , default:"../../../../../../public/images/userImage.png"},
    blocked: { type: Boolean, default: false},
    certificate:{type:String,default:"no certificate"},
    
    followedTeams:[{ type: Schema.Types.ObjectId, ref: 'Team' }],



});

User.methods.isBlocked = function () {
    return this.blocked;
};
module.exports = mongo.model("user", User);
