import db from '../utils/db';
class CampaignsController {
  static async createCampaign(payload) {
    try {
      const { subject, listId, htmlContent } = payload.body;

      let res = await db
        .insert({
          subject,
          listId,
          htmlContent,
        })
        .into('campaigns');

      return {
        success: true,
        message: `Campaign with ID ${res} Created`,
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
      const campaignsResult = await db
        .select('id', 'subject', 'listId', 'createdAt', 'reportId')
        .from('campaigns');

      return {
        success: true,
        result: campaignsResult,
      };
    } catch (e) {
      return {
        success: false,
        error: e.toString(),
      };
    }
  }
}

export default CampaignsController;
