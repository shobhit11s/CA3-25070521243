const express = require('express');
const router = express.Router();
const {
  getFreelancerProfile,
  getFeaturedFreelancers,
} = require('../controllers/userController');

router.get('/featured-freelancers', getFeaturedFreelancers);
router.get('/freelancer/:id', getFreelancerProfile);

module.exports = router;
