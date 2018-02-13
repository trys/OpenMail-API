import htmlToText from 'html-to-text';
import ListsController from './Lists';
import Config from './Config';
import db from '../utils/db';
import transporter from '../utils/transporter';
import queue from '../utils/queue';

class CampaignsController {
  static async sendCampaign(id) {
    try {
      let campaign = await this.getCampaign(id);

      const fromName = await Config.read('fromName');
      const fromEmail = await Config.read('fromEmail');

      campaign = campaign.result;

      const getSubscribers = await ListsController.getListSubscribers(
        campaign.listId,
      );

      const subscribers = getSubscribers.result.subscribers;

      subscribers.map(member => {
        let job = queue
          .create(`sendEmail`, {
            title: `Campaign ${id} to ${member.emailAddress}`,
            from: `${fromName} <${fromEmail}>`,
            to: member.emailAddress,
            subject: campaign.subject,
            text: htmlToText.fromString(campaign.htmlContent, {
              wordwrap: 130,
            }),
            html: campaign.htmlContent,
          })
          .save(err => {
            if (!err) {
              console.log(job.id);
            }
          });
      });
    } catch (e) {
      console.log('errored', e);
    }
  }
  static async getCampaign(id) {
    try {
      let campaign = await db
        .select(
          'id',
          'subject',
          'listId',
          'htmlContent',
          'createdAt',
          'reportId',
        )
        .from('campaigns')
        .where({
          id: id,
        });

      return {
        success: true,
        result: campaign[0],
      };
    } catch (e) {
      console.log('error getting campaign');
    }
  }
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

      await this.sendCampaign(res);

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
