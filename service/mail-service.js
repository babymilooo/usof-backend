const nodemailer = require('nodemailer');

class mailService {
    constructor() {
        this.transporter = nodemailer.createTransport({
            host: process.env.SMTP_HOST,
            port: process.env.SMTP_PORT,
            secure: false,
            auth: {
                user: process.env.EMAIL_USERNAME,
                pass: process.env.EMAIL_PASSWORD
            }
        })
    }

    async sendRefreshPassword(to, link) {
        await this.transporter.sendMail({
            from: process.env.EMAIL_USERNAME,
            to: to,
            subject: 'Refresh password on ' + process.env.API_URL,
            text: '',
            html:
                `
                    <div>
                        <h1>Click on link to refresh your password</h1>
                        <a href="${link}">${link}</a>
                    </div>
                `
        })
    }
}

module.exports = new mailService();