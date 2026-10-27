const express = require('express');
const router = express.Router();
const {
  getProjects,
  getProjectById,
  createProject,
  updateProject,
  deleteProject,
  getMyProjects,
  reportProject,
} = require('../controllers/projectController');
const { protect, authorize } = require('../middleware/auth');

router.get('/my-projects', protect, authorize('client', 'admin'), getMyProjects);
router.route('/')
  .get(getProjects)
  .post(protect, authorize('client', 'admin'), createProject);

router.route('/:id')
  .get(getProjectById)
  .put(protect, updateProject)
  .delete(protect, deleteProject);

router.post('/:id/report', protect, reportProject);

module.exports = router;
