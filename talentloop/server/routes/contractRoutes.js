const express = require('express');
const router = express.Router();
const {
  getMyContracts,
  getContractById,
  addMilestone,
  updateMilestoneStatus,
  completeContract,
  cancelContract,
} = require('../controllers/contractController');
const { protect } = require('../middleware/auth');

router.use(protect);

router.get('/', getMyContracts);
router.get('/:id', getContractById);
router.post('/:id/milestones', addMilestone);
router.put('/milestones/:milestoneId', updateMilestoneStatus);
router.put('/:id/complete', completeContract);
router.put('/:id/cancel', cancelContract);

module.exports = router;
