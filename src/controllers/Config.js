import db from '../utils/db';

class Config {
  static async read(key) {
    try {
      await db
        .select('configValue')
        .where({
          configKey: key,
        })
        .from('configuration');
    } catch (e) {
      console.error(e);
    }
  }
  static async write(key, value) {
    try {
      let res = await db
        .insert({
          configKey: key,
          configValue: value,
        })
        .into('configuration');
    } catch (e) {
      console.error(e);
    }
  }
  static async update(key, value) {
    try {
      let res = await db
        .update({
          configValue: value,
        })
        .where({
          configKey: key,
        });
    } catch (e) {
      console.error(e);
    }
  }
}

export default Config;
