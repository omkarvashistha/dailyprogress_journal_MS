const journalRepo = require("../Model/Schema");
const helper = require("../Utilities/helper");
const axios = require('axios');

exports.getUserJournalInfo = async(req,res)=> {
    try {

        const username = req.params.username;

        let totalEntries = 0;
        let firstEntry = "";
        let lastEntry = "";

        const userJournals = await journalRepo.find({username : username});

        if(userJournals) {
            let journalData = userJournals[0].journalData;
            //console.log(journalData);
            totalEntries = journalData.length;
            firstEntry = journalData[0].date +" ("+journalData[0].day+")";
            lastEntry = journalData[journalData.length - 1].date+" ("+journalData[journalData.length - 1].day+")";

            res.status(200).json({
                total : totalEntries,
                firstEntry : firstEntry,
                lastEntry : lastEntry
            })
            
        } else {
            res.status(200).json({
                total : totalEntries,
                firstEntry : firstEntry,
                lastEntry : lastEntry
            })
        }

    } catch (error) {
        console.log(error)
        res.status(400).json({
            
            message : error.message
        })
    }
}

exports.getUserJournalData = async(req,res) => {
    try {
        const username = req.params.username;
        const journalData = await journalRepo.findOne({username : username});
        console.log(journalData);

        if(journalData) {
            res.status(200).json({
                data : journalData
            })
        } else {
            res.status(200).json({
                data : "No journal data for user"
            })
        }
    } catch (error) {
        res.status(401).json({
            data : error.message
        })
    }
}

exports.addUserJournals = async(req,res) => {
    try {
        const username = req.params.username;

        const journalDataResponse = await journalRepo.findOne({username : username});
        
        const id  = await helper.getJournalId(username);
       // console.log(id);
        const journalData = {
            id : id,
            content : req.body.content,
            day : req.body.day,
            date : req.body.date
        }

        if(journalDataResponse) {
            //console.log("here");
            journalDataResponse.journalData.push(journalData);
            await journalDataResponse.save();
            res.status(201).json({
                data : id,
                message : "Journal Added for user"
            })     
        } else {
            
            const addJournalData  = await journalRepo.create({
                username : username,
                journalData : [journalData]
            });

            res.status(201).json({
                data : id,
                message : "Journal Added for user"
            });
        }

    } catch (error) {
        console.log(error.message);
        res.status(400).json({
            data : error
        })
    }
}

exports.updateJournal = async(req,res) => {
    try {
        const username = req.params.username;
        const journalDataResponse = await journalRepo.find({username : username});
        //console.log(req.body.id,req.body.content);
        if(journalDataResponse) {
            const updatedResposne = await journalRepo.updateOne(
                {username : username,'journalData.id' : req.body.id },
                {'$set' : {
                    "journalData.$.content" : req.body.content
                }}
            )

            if(updatedResposne){
                res.status(201).json({
                    data : "Updated successfully",
                })
            }

        } else {
            res.status(201).json({
                data : "No data available"
            })
        }
    } catch (error) {
        console.log(error.message);
        res.status(400).json({
            data : error.message
        })
    }
}

exports.deleteJournal = async(req,res)=>{
    try {
        const username = req.params.username;
        const id = req.body.id;
        const userDataResponse = await journalRepo.find({username : username});

        if(userDataResponse) {
            const deleteUserJournal = await journalRepo.updateMany({
                "journalData.id" : id
            },
            {
                '$pull' : {  // to remove the particular journal from the array
                    'journalData' : {
                        'id' : id
                    }
                }
            });

            res.status(200).json({
                data : "Deleted succesfully"
            })
        } else {
            res.status(200).json({
                data : "No Journals yet"
            })
        }

    } catch (error) {
        res.status(400).json({
            message : error.message
        })
    }
}


exports.invalid = async(req,res,next)=>{
    const err = new Error();
    err.message = 'Invalid Route';
    err.status = 404;
    next(err);
}