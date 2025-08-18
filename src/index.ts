import * as nodemailer from 'nodemailer';
import { readFileSync } from 'fs';
import { join } from 'path';

interface SMTPConfig {
  host: string;
  port: number;
  username: string;
  password: string;
}

interface EmailConfig {
  smtp: SMTPConfig;
  recipients: string[];
  subject?: string;
}

class EmailSender {
  private transporter: nodemailer.Transporter;
  private config: EmailConfig;

  constructor(config: EmailConfig) {
    this.config = config;
    this.transporter = nodemailer.createTransport({
      host: config.smtp.host,
      port: config.smtp.port,
      secure: config.smtp.port === 465,
      auth: {
        user: config.smtp.username,
        pass: config.smtp.password
      }
    });
  }

  private validateEmail(email: string): boolean {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  }

  private getHTMLContent(): string {
    return `
    <!DOCTYPE html>
        <html>
        <head>
            <meta charset="utf-8">
            <link rel="stylesheet" href="https://fonts.googleapis.com/css2?family=IBM+Plex+Mono:wght@400&amp;display=swap">
            <title>Sample Email</title>
        </head>
        <body style="margin: 0; padding: 0; background-color: #000000; height: 100vh; display: flex; align-items: center; justify-content: center; font-family: IBM Plex Mono, monospace;">
            <div style="text-align: center;">
                <p style="color: #ffffff; margin: 0; font-size: 24px;">Blackmail by .less</p>
            </div>
        </body>
        </html>
    `;
  }

  async sendEmails(): Promise<void> {
    const validEmails = this.config.recipients.filter(email => {
      const isValid = this.validateEmail(email);
      if (!isValid) {
        console.log(`⚠️  Skipping invalid email: ${email}`);
      }
      return isValid;
    });

    if (validEmails.length === 0) {
      console.log('❌ No valid email addresses found');
      return;
    }

    console.log(`📧 Sending emails to ${validEmails.length} recipients...`);

    const mailOptions = {
      from: this.config.smtp.username,
      subject: 'Blackmail',
      html: this.getHTMLContent()
    };

    const promises = validEmails.map(async (email, index) => {
      try {
        await this.transporter.sendMail({
          ...mailOptions,
          to: email
        });
        console.log(`✅ Email ${index + 1}/${validEmails.length} sent to: ${email}`);
      } catch (error) {
        console.error(`❌ Failed to send email to ${email}:`, error instanceof Error ? error.message : error);
      }
    });

    await Promise.all(promises);
    console.log('🎉 Email sending process completed');
  }

  async testConnection(): Promise<boolean> {
    try {
      await this.transporter.verify();
      console.log('✅ SMTP connection verified');
      return true;
    } catch (error) {
      console.error('❌ SMTP connection failed:', error instanceof Error ? error.message : error);
      return false;
    }
  }
}

function loadConfig(): EmailConfig {
  try {
    const configPath = join(__dirname, '../config.json');
    const configData = readFileSync(configPath, 'utf8');
    const config = JSON.parse(configData) as EmailConfig;
    
    if (!config.smtp || !config.smtp.host || !config.smtp.port || !config.smtp.username || !config.smtp.password) {
      throw new Error('Missing required SMTP configuration');
    }
    
    if (!config.recipients || !Array.isArray(config.recipients) || config.recipients.length === 0) {
      throw new Error('No recipients provided');
    }
    
    return config;
  } catch (error) {
    console.error('❌ Error loading configuration:', error instanceof Error ? error.message : error);
    console.log('💡 Make sure config.json exists.')
    process.exit(1);
  }
}

async function main() {
  console.log('🚀 Starting Email Sender...');
  
  try {
    const config = loadConfig();
    const emailSender = new EmailSender(config);
    
    const isConnected = await emailSender.testConnection();
    if (!isConnected) {
      console.error('❌ Cannot proceed without valid SMTP connection');
      process.exit(1);
    }
    
    await emailSender.sendEmails();
    
    console.log('✅ All done! Container will now shut down.');
    process.exit(0);
    
  } catch (error) {
    console.error('❌ Fatal error:', error instanceof Error ? error.message : error);
    process.exit(1);
  }
}

process.on('SIGINT', () => {
  console.log('Received SIGINT, shutting down gracefully...');
  process.exit(0);
});

process.on('SIGTERM', () => {
  console.log('Received SIGTERM, shutting down gracefully...');
  process.exit(0);
});

main();