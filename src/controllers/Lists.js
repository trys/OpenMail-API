import db from '../utils/db';

class ListsController {
  static async createList(payload) {
    try {
      const { listName } = payload.body;

      let res = await db
        .insert({
          listName,
        })
        .into('lists');

      return {
        success: true,
        message: `List with ID ${res} Created`,
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
      const listsResult = await db
        .select('id', 'listName', 'subscriberCount')
        .from('lists');

      return {
        success: true,
        result: listsResult,
      };
    } catch (e) {
      return {
        success: false,
        error: e.toString(),
      };
    }
  }
  static async delete(id) {
    try {
      const deleteResult = await db('lists')
        .where({
          id: id,
        })
        .del();

      return {
        success: true,
        result: 'Deleted list',
      };
    } catch (e) {
      return {
        success: false,
        error: e.toString(),
      };
    }
  }
  static async getListSubscribers(id) {
    try {
      const subscribersResult = await db
        .select('id', 'firstName', 'lastName', 'emailAddress', 'createdAt')
        .from('subscribers')
        .where({
          listId: id,
        });

      const listName = await db
        .select('listName')
        .from('lists')
        .where({
          id: id,
        });

      return {
        success: true,
        result: {
          listName: listName[0].listName,
          subscribers: subscribersResult,
        },
      };
    } catch (e) {
      return {
        success: false,
        error: e.toString(),
      };
    }
  }
}

export default ListsController;
