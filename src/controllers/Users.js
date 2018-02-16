import db from '../utils/db';

class UsersController {
  static async get(id) {
    try {
      const usersResult = await db
        .select('id', 'emailAddress', 'createdAt')
        .where({ id: id })
        .from('users');

      return {
        success: true,
        result: usersResult[0],
      };
    } catch (e) {
      return {
        success: false,
        error: e.toString(),
      };
    }
  }
  static async getAll() {
    try {
      const usersResult = await db.select('id', 'emailAddress', 'createdAt').from('users');

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
