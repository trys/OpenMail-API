import express from 'express';
import passport from 'passport';
import Config from '../controllers/Config';
const router = express.Router();

/*
* SETTINGS routes
*/

router.get(
  '/config/:key',
  passport.authenticate('jwt', { session: false }),
  async (req, res) => {
    try {
      const keys = req.params.key.split(',');

      const values = keys.map(async key => {
        return await Config.read(key);
      });

      Promise.all(values).then(valuesArray => {
        res.json({
          result: valuesArray,
        });
      });
    } catch (e) {
      res.json({
        success: false,
        error: e.toString(),
      });
    }
  },
);

export default router;
