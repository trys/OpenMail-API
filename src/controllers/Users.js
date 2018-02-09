import db from '../utils/db';

class UsersController {
  static async getAll() {
    try {
      const usersResult = await db
        .select('id', 'emailAddress', 'createdAt')
        .from('users');

      return {
        success: true,
        result: usersResult,
      };
    } catch (e) {
      return {
        success: false,
        error: e.toString(),
      };
    }
  }
}

export default UsersController;
