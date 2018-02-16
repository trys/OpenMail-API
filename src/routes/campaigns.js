import express from 'express';
import passport from 'passport';
import CampaignsController from '../controllers/Campaigns';
const router = express.Router();

/*
* CAMPAIGNS routes
*/

router.get('/', passport.authenticate('jwt', { session: false }), async (req, res) => {
  try {
    const result = await CampaignsController.getAll();
    res.json(result);
  } catch (e) {
    res.json(e);
    console.log(e);
  }
});

router.get('/:id', passport.authenticate('jwt', { session: false }), async (req, res) => {
  try {
    res.send('Get a campaign by ID');
  } catch (e) {
    res.send('Failed to get a campaign by ID');
    console.log(e);
  }
});

router.get('/:id/report', passport.authenticate('jwt', { session: false }), async (req, res) => {
  try {
    const result = await CampaignsController.getReport(req.params.id);
    res.json(result);
  } catch (e) {
    res.json(e);
    console.error(e);
  }
});

router.post('/', passport.authenticate('jwt', { session: false }), async (req, res) => {
  try {
    const result = await CampaignsController.createCampaign(req);
    res.json(result);
  } catch (e) {
    res.json(e);
    console.log(e);
  }
});

router.delete('/:id', passport.authenticate('jwt', { session: false }), async (req, res) => {
  try {
    res.send('Delete a campaign by ID');
  } catch (e) {
    res.send('Failed to delete campaign by ID');
    console.log(e);
  }
});

export default router;
