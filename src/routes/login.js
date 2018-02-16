import express from 'express';
import passport from 'passport';
import AuthController from '../controllers/Auth';
import UsersController from '../controllers/Users';
const router = express.Router();

/*
* AUTH routes
*/

router.post('/login', async (req, res) => {
  try {
    const loginResponse = await AuthController.login(req);
    res.json(loginResponse);
  } catch (e) {
    res.json({
      success: false,
      error: e.toString(),
    });
  }
});

router.get('/valid', passport.authenticate('jwt', { session: false }), async (req, res) => {
  try {
    const { id: userId } = req.user;
    const user = await UsersController.get(userId);
    res.json({
      success: true,
      result: user.result,
    });
  } catch (e) {
    res.status(401).json({
      success: false,
    });
  }
});

export default router;
