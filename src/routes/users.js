import express from 'express';
import passport from 'passport';
import AuthController from '../controllers/Auth';
const router = express.Router();

/*
* USERS routes
*/

router.post('/', async (req, res) => {
  try {
    const newUserResponse = await AuthController.create(req);
    res.json(newUserResponse);
  } catch (e) {
    res.json({
      success: false,
      error: e.toString(),
    });
  }
});

router.get(
  '/',
  passport.authenticate('jwt', { session: false }),
  async (req, res) => {
    try {
      res.send('Get all users');
    } catch (e) {
      res.send('Failed to get all users');
    }
  },
);

router.get(
  '/:id',
  passport.authenticate('jwt', { session: false }),
  async (req, res) => {
    try {
      res.send('Get a user by ID');
    } catch (e) {
      res.send('Failed to get a user by ID');
    }
  },
);

router.put(
  '/:id',
  passport.authenticate('jwt', { session: false }),
  async (req, res) => {
    try {
      res.send('Update a user by ID');
    } catch (e) {
      res.send('Failed to update a user by ID');
    }
  },
);

router.delete(
  '/:id',
  passport.authenticate('jwt', { session: false }),
  async (req, res) => {
    try {
      const deleteUserRes = await AuthController.delete(req);
      res.json(deleteUserRes);
    } catch (e) {
      res.send('Failed to delete a user by ID');
    }
  },
);

export default router;
