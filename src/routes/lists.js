import express from 'express';
import passport from 'passport';
import multer from 'multer';
import ListsController from '../controllers/Lists';

const router = express.Router();
const upload = multer({
  dest: './tmp',
});

/*
* LISTS routes
*/

router.get(
  '/',
  passport.authenticate('jwt', { session: false }),
  async (req, res) => {
    try {
      const result = await ListsController.getAll();
      res.json(result);
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
      const result = await ListsController.getListSubscribers(req.params.id);
      res.json(result);
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
      const result = await ListsController.createList(req);
      res.json(result);
    } catch (e) {
      res.json(e);
      console.log(e);
    }
  },
);

router.post(
  '/import/:id',
  [upload.single('csv'), passport.authenticate('jwt', { session: false })],
  async (req, res) => {
    try {
      const result = await ListsController.import(req);
      res.json(result);
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
      const result = await ListsController.delete(req.params.id);
      res.json(result);
    } catch (e) {
      res.json(e);
      console.log(e);
    }
  },
);

export default router;
