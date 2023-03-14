const journalRepo = require("../Model/Schema");

exports.getJournalId = async(username) => {
    try {
        const journalDataResponse = await journalRepo.findOne({username : username});

        if(journalDataResponse){
            let count = (journalDataResponse.journalData).length;
            console.log(count);
            if(count >= 1) {
                count+=1;
                return "J"+count;
            }
        }else {
            return "J1";
        }
    } catch (error) {
        console.log(error) ;
    }
}