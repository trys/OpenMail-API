import express from 'express';
import AuthController from '../controllers/Auth';
const router = express.Router();

/*
* AUTH routes
*/

router.post('/', async (req, res) => {
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

export default router;
