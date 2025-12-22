const nodemailer = require('nodemailer');
require('dotenv').config();

async function testEmailConfig() {
    console.log('🔍 Testing Email Configuration...\n');

    // Check environment variables
    const mailerEmail = process.env.MAILER_EMAIL;
    const mailerPassword = process.env.MAILER_PASSWORD;

    if (!mailerEmail || !mailerPassword) {
        console.error('❌ Email configuration is missing!');
        console.log('\nPlease set the following environment variables in .env file:');
        console.log('  MAILER_EMAIL=your_email@gmail.com');
        console.log('  MAILER_PASSWORD=your_gmail_app_password');
        console.log('\n📖 How to get Gmail App Password:');
        console.log('  1. Go to https://myaccount.google.com/security');
        console.log('  2. Enable 2-Step Verification');
        console.log('  3. Go to https://myaccount.google.com/apppasswords');
        console.log('  4. Generate App Password for "Mail"');
        console.log('  5. Copy the 16-character password (no spaces)');
        process.exit(1);
    }

    console.log('✅ Environment variables found:');
    console.log(`   MAILER_EMAIL: ${mailerEmail}`);
    console.log(`   MAILER_PASSWORD: ${'*'.repeat(mailerPassword.length)}\n`);

    // Create transporter
    const transporter = nodemailer.createTransport({
        host: 'smtp.gmail.com',
        port: 465,
        secure: true,
        auth: {
            user: mailerEmail,
            pass: mailerPassword,
        },
    });

    try {
        // Verify connection
        console.log('🔌 Testing SMTP connection...');
        await transporter.verify();
        console.log('✅ SMTP connection successful!\n');

        // Send test email
        console.log('📧 Sending test email...');
        const info = await transporter.sendMail({
            from: `"SIPAKE Test" <${mailerEmail}>`,
            to: mailerEmail, // Send to yourself
            subject: 'Test Email - SIPAKE Backend',
            html: `
        <div style="font-family: Arial, sans-serif; padding: 20px; max-width: 600px; margin: 0 auto;">
          <h1 style="color: #333;">✅ Email Configuration Success!</h1>
          <p>This is a test email from SIPAKE Backend.</p>
          <p>Your email service is configured correctly and ready to send verification emails.</p>
          <hr style="border: 1px solid #eee; margin: 20px 0;">
          <p style="color: #666; font-size: 12px;">
            Sent at: ${new Date().toLocaleString('id-ID', { timeZone: 'Asia/Jakarta' })}
          </p>
        </div>
      `,
        });

        console.log('✅ Test email sent successfully!');
        console.log(`   Message ID: ${info.messageId}`);
        console.log(`\n📬 Check your inbox at: ${mailerEmail}\n`);
        console.log('🎉 Email service is ready to use!');
    } catch (error) {
        console.error('❌ Email test failed:', error.message);

        if (error.code === 'EAUTH') {
            console.log('\n💡 Authentication failed. Please check:');
            console.log('  1. Email and password are correct');
            console.log('  2. You are using App Password (not regular password)');
            console.log('  3. 2-Step Verification is enabled');
        } else if (error.code === 'ECONNECTION') {
            console.log('\n💡 Connection failed. Please check:');
            console.log('  1. Your internet connection');
            console.log('  2. Firewall settings');
        }

        process.exit(1);
    }
}

testEmailConfig();
