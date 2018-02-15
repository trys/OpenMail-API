import express from 'express';
import passport from 'passport';
import aws from 'aws-sdk';
import Config from '../controllers/Config';
const router = express.Router();
const ses = new aws.SES({
  apiVersion: '2010-12-01',
});

/*
* SETTINGS routes
*/

router.get('/config/:key', passport.authenticate('jwt', { session: false }), async (req, res) => {
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
});

router.get('/quota', passport.authenticate('jwt', { session: false }), async (req, res) => {
  ses.getSendQuota((err, data) => {
    if (!err) {
      res.json({
        success: true,
        result: data,
      });
    } else {
      res.json({
        success: false,
      });
    }
  });
});

export default router;
