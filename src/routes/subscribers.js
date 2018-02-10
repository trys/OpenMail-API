import express from 'express';
import passport from 'passport';
import SubscribersController from '../controllers/Subscribers';
const router = express.Router();

router.get(
  '/',
  passport.authenticate('jwt', { session: false }),
  async (req, res) => {
    try {
      res.send('Get all subscribers');
      // res.json(result);
    } catch (e) {
      res.json(e);
      console.log(e);
    }
  },
);

router.get(
  '/:id',
  passport.authenticate('jwt', { session: false }),
  async (req, res) => {
    try {
      res.send('Get a subscriber by ID');
      // res.json(result);
    } catch (e) {
      res.json(e);
      console.log(e);
    }
  },
);

router.post(
  '/',
  passport.authenticate('jwt', { session: false }),
  async (req, res) => {
    try {
      const result = await SubscribersController.create(req);
      res.json(result);
    } catch (e) {
      res.json(e);
      console.log(e);
    }
  },
);

router.put(
  '/:id',
  passport.authenticate('jwt', { session: false }),
  async (req, res) => {
    try {
      res.send('Update a subscriber');
      // res.json(result);
    } catch (e) {
      res.json(e);
      console.log(e);
    }
  },
);

router.delete(
  '/:id',
  passport.authenticate('jwt', { session: false }),
  async (req, res) => {
    try {
      res.send('Delete a subscriber by ID');
      // res.json(result);
    } catch (e) {
      res.json(e);
      console.log(e);
    }
  },
);

export default router;
