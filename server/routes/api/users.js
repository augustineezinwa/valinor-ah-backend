import express from 'express';

import FollowController from '../../controllers/FollowController';
import UserValidation from '../../middlewares/UserValidation';
import UserController from '../../controllers/UsersController';
import facebookPassportRoutes from '../../config/facebookPassportRoutes';
import googlePassportRoutes from '../../config/googlePassportRoutes';
import { verifyToken } from '../../middlewares/tokenUtils';
import twitterPassportRoutes from '../../config/twitterPassportRoutes';
import confirmUser from '../../middlewares/confirmUser';
import validateResourceId from '../../middlewares/validateResourceId';

const {
  validateUserSignUp,
  checkExistingEmail,
  validateUserLogin,
  validateUserUpdate,
  validateFollowUserUrl
} = UserValidation;
const {
  signUp,
  userLoginStart,
  userLoginEnd,
  verifyUser,
  updateProfile,
  getSingleProfile,
  getUserProfiles,
  fetchAuthors
} = UserController;
const {
  followAuthor,
  displayFollowView
} = FollowController;

const router = express.Router();

router.get('/', (req, res) => {
  res.status(200)
    .json({
      message: 'Welcome to Author\'s Haven, the community of great authors',
      status: 200
    });
});

// sign up route
router.post(
  '/users/signup',
  validateUserSignUp, checkExistingEmail, signUp
);

// login with email link
router.post('/users/login', validateUserLogin, userLoginStart);

// login with email link
router.get('/users/login', verifyToken, userLoginEnd);

// verify users email
router.get('/users/verify', verifyToken, verifyUser);

// get authors
router.get('/users/authors', fetchAuthors);

// signup or login with facebook
router.get('/auth/facebook', facebookPassportRoutes.authenticate());

// facebook callback route
router.get('/auth/facebook/callback', facebookPassportRoutes.callback());

// update profile route
router.patch(
  '/users/:userId',
  verifyToken, validateResourceId, confirmUser, validateUserUpdate,
  updateProfile
);

// route for twitter authentication and login
router.get('/auth/twitter', twitterPassportRoutes.authenticate());

// handle the callback after twitter has authenticated the user
router.get('/auth/twitter/callback', twitterPassportRoutes.callback());

// signup or login with google
router.get('/auth/google', googlePassportRoutes.authenticate());

// google callback route
router.get('/auth/google/callback', googlePassportRoutes.callback());

// get all user profiles
router.get('/users', verifyToken, confirmUser, getUserProfiles);

// get a single user profile
router.get(
  '/users/:userId',
  verifyToken, validateResourceId, confirmUser, getSingleProfile,
);

router.post(
  '/users/follow/:authorId',
  validateFollowUserUrl, verifyToken, followAuthor
);

router.get(
  '/users/follow/:userId',
  validateFollowUserUrl, displayFollowView
);

export default router;
