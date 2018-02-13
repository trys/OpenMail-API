import db from '../utils/db';
import queue from '../utils/queue';

class ListsController {
  static async import(payload) {
    try {
      const listId = payload.params.id;
      const csvFile = payload.file;

      let job = queue
        .create('importCsv', {
          title: `Importing CSV to list ${listId}`,
          listId: listId,
          filePath: csvFile.path,
        })
        .save(err => {
          if (!err) {
            console.log(`Queued import ${job.id}`);
          }
        });

      return {
        success: true,
        status: 'importing',
      };
    } catch (e) {
      console.error('Errored with ', e);
    }
  }
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
