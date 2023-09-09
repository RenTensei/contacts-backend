import nodemailer from 'nodemailer';
import { google } from 'googleapis';

require('dotenv').config();

const {
  BASE_URL_PUBLIC,
  MAILER_EMAIL,
  MAILER_CLIENT_ID,
  MAILER_CLIENT_SECRET,
  MAILER_REFRESH_TOKEN
} = process.env;

const getGoogleAccessToken = async (): Promise<string> => {
  const oauth2Client = new google.auth.OAuth2(
    MAILER_CLIENT_ID,
    MAILER_CLIENT_SECRET,
    'https://developers.google.com/oauthplayground'
  );

  oauth2Client.setCredentials({ refresh_token: MAILER_REFRESH_TOKEN });
  const { res } = await oauth2Client.getAccessToken();
  if (!res) throw new Error('google api died');
  const accessToken = res.data.access_token;
  return accessToken;
};

class MailService {
  private transporter!: nodemailer.Transporter;

  constructor() {
    this.setupTransporter();
  }

  async setupTransporter() {
    const accessToken = await getGoogleAccessToken();

    this.transporter = nodemailer.createTransport({
      service: 'gmail',
      auth: {
        type: 'OAuth2',
        user: MAILER_EMAIL,
        accessToken,
        clientId: MAILER_CLIENT_ID,
        clientSecret: MAILER_CLIENT_SECRET,
        refreshToken: MAILER_REFRESH_TOKEN
      }
    });
  }

  async sendMail(sendTo: string, verificationToken: string) {
    return this.transporter.sendMail({
      from: MAILER_EMAIL,
      to: sendTo,
      subject: 'Confirm your email',
      html: `
        <div>
          <h1>Для активации аккаунта перейдите по ссылке: </h1>
          </br>
          <a href="${BASE_URL_PUBLIC}/users/verify/${verificationToken}">
            ${BASE_URL_PUBLIC}/users/verify/${verificationToken}
          </a>
        </div>
      `
    });
  }
}

export default new MailService();
