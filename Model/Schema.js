const mongoose = require('mongoose');

require('dotenv').config();

mongoose.connect(process.env.MONGO_URI).then(()=>{
    console.log("Connected to Journal DB");
}).catch((error)=>{
    console.log(error);
})

const journalSchema = new mongoose.Schema({
    username : {
        type : String,
        required : true,
        unique : true
    },
    journalData : {
        type : Array,
        id:{
            type : String
        },
        content : {
            type : String
        },
        day : {
            type : String
        },
        date : {
            type : String
        }
    }
},
{
    timestamps : {
        createdAt : true,
        updatedAt : true,
    },
});

const journal = mongoose.model("journal",journalSchema);

module.exports = journal;