import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import db from '../utils/db';

class AuthController {
  static async create(payload) {
    try {
      const { emailAddress, password } = payload.body;
      console.log('Creating account...', emailAddress);

      const salt = await bcrypt.genSalt(10);
      const hash = await bcrypt.hash(password, salt);

      let res = await db
        .insert({
          emailAddress,
          password: hash,
        })
        .into('users');

      console.log('UserRes', res);

      return {
        success: true,
      };
    } catch (e) {
      console.log(e);
    }
  }
  static async login(payload) {
    try {
      const { emailAddress = '', password = '' } = payload.body;
      console.log('Logging in...', emailAddress);

      const attemptingUser = await db
        .select('id', 'emailAddress', 'password')
        .where('emailAddress', emailAddress)
        .from('users');

      if (!attemptingUser[0]) {
        throw new Error('No such user');
      }
      const passwordsMatch = await bcrypt.compare(
        password,
        attemptingUser[0].password,
      );

      if (!passwordsMatch) {
        throw new Error('Incorrect password');
      }
      const token = jwt.sign(
        {
          id: attemptingUser[0].id,
          emailAddress: attemptingUser[0].emailAddress,
        },
        process.env.JWT_SIG,
        {
          algorithm: 'HS256',
          expiresIn: '1y',
        },
      );

      return {
        success: true,
        token: token,
      };
    } catch (e) {
      return {
        success: false,
        error: e.toString(),
      };
      console.error(e);
    }
  }
}

export default AuthController;
