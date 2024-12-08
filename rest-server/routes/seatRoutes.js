const express = require('express');
const { 
    getAllSeats,
    startOrder
} = require('../controllers/seatController');

const { checkSupervisorPermission } = require('../middlewares/permissions');

const router = express.Router();

router.get("/seats", getAllSeats);
router.post("/seat/start-order", startOrder);

module.exports = router;