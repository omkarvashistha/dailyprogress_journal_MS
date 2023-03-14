const express = require('express')
const router = express.Router();
const controller = require('../Controller/journalController');
const cors = require('cors');

router.use(cors())

router.get("/:username/getUserJournalInfo",controller.getUserJournalInfo);  // This is for home component
router.get('/:username/getUserJournals',controller.getUserJournalData);  // For Journal Component

router.post('/:username/addUserJournals',controller.addUserJournals);

router.put('/:username/updateUserJournal',controller.updateJournal);
router.put('/:username/deleteJournal',controller.deleteJournal);

router.all('*',controller.invalid);

module.exports = router;