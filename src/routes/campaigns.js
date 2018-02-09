import express from 'express';
import passport from 'passport';
const router = express.Router();

/*
* CAMPAIGNS routes
*/

router.get(
  '/',
  passport.authenticate('jwt', { session: false }),
  async (req, res) => {
    try {
      res.send('Get all campaigns');
    } catch (e) {
      res.send('Failed to get all campaigns');
      console.log(e);
    }
  },
);

router.get(
  '/:id',
  passport.authenticate('jwt', { session: false }),
  async (req, res) => {
    try {
      res.send('Get a campaign by ID');
    } catch (e) {
      res.send('Failed to get a campaign by ID');
      console.log(e);
    }
  },
);

router.post(
  '/',
  passport.authenticate('jwt', { session: false }),
  async (req, res) => {
    try {
      res.send('Create new campaign');
    } catch (e) {
      res.send('Failed to create new campaign');
      console.log(e);
    }
  },
);

router.delete(
  '/:id',
  passport.authenticate('jwt', { session: false }),
  async (req, res) => {
    try {
      res.send('Delete a campaign by ID');
    } catch (e) {
      res.send('Failed to delete campaign by ID');
      console.log(e);
    }
  },
);

export default router;
