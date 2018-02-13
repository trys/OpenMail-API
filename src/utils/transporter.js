import nodemailer from 'nodemailer';
import aws from 'aws-sdk';

const transporter = nodemailer.createTransport({
  SES: new aws.SES({
    apiVersion: '2010-12-01',
  }),
});

export default transporter;
