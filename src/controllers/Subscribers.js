import db from '../utils/db';

class SubscribersController {
  static async getAll() {
    return {
      success: true,
    };
  }
  static async get() {
    return {
      success: true,
    };
  }
  static async create(payload) {
    try {
      const { firstName = '', lastName = '', emailAddress, listId } = payload.body;

      const createSubscriber = await db
        .insert({
          firstName,
          lastName,
          emailAddress,
          listId,
        })
        .into('subscribers');

      return {
        success: true,
        message: 'Subscriber created',
      };
    } catch (e) {
      return e.toString();
    }
  }
  static async delete() {
    return {
      success: true,
    };
  }
  static async update() {
    return {
      success: true,
    };
  }
}

export default SubscribersController;
