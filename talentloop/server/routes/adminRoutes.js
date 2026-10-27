const express = require('express');
const router = express.Router();
const {
  getAdminStats,
  getAllUsers,
  toggleSuspendUser,
  getReportedProjects,
  dismissReport,
} = require('../controllers/adminController');
const { protect, authorize } = require('../middleware/auth');

router.use(protect);
router.use(authorize('admin'));

router.get('/stats', getAdminStats);
router.get('/users', getAllUsers);
router.put('/users/:id/suspend', toggleSuspendUser);
router.get('/reported-projects', getReportedProjects);
router.put('/projects/:id/dismiss-report', dismissReport);

module.exports = router;
