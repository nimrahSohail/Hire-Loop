const express =require('express');
const { getAllProfiles, createProfile, updateProfile, deleteProfile, getProfileDetail } = require('../controllers/profileController');
const { isAuthenticatedUser, authorizeRole } = require('../middleware/auth');
const router =express.Router();

router.route('/profile').get(getAllProfiles);
router.route('/profile/new').post(isAuthenticatedUser,createProfile);
router.route('/profile/:id').put(isAuthenticatedUser,updateProfile);
router.route('/profile/:id').delete(authorizeRole('admin'),deleteProfile);
router.route('/profile/:id').get(getProfileDetail);



module.exports=router;