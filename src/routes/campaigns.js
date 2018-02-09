import express from 'express';
const router = express.Router();

/*
* CAMPAIGNS routes
*/

router.get('/', async (req, res) => {
  try {
    res.send('Get all campaigns');
  } catch (e) {
    res.send('Failed to get all campaigns');
    console.log(e);
  }
});

router.get('/:id', async (req, res) => {
  try {
    res.send('Get a campaign by ID');
  } catch (e) {
    res.send('Failed to get a campaign by ID');
    console.log(e);
  }
});

router.post('/', async (req, res) => {
  try {
    res.send('Create new campaign');
  } catch (e) {
    res.send('Failed to create new campaign');
    console.log(e);
  }
});

router.delete('/:id', async (req, res) => {
  try {
    res.send('Delete a campaign by ID');
  } catch (e) {
    res.send('Failed to delete campaign by ID');
    console.log(e);
  }
});

export default router;
