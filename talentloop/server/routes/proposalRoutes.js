const express = require('express');
const router = express.Router();
const {
  submitProposal,
  getProjectProposals,
  getMyProposals,
  acceptProposal,
  rejectProposal,
} = require('../controllers/proposalController');
const { protect, authorize } = require('../middleware/auth');

router.post('/', protect, authorize('freelancer', 'admin'), submitProposal);
router.get('/my-proposals', protect, authorize('freelancer', 'admin'), getMyProposals);
router.get('/project/:projectId', protect, getProjectProposals);
router.put('/:id/accept', protect, acceptProposal);
router.put('/:id/reject', protect, rejectProposal);

module.exports = router;
