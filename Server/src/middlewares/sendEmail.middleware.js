// emailMiddleware.js
import nodemailer from 'nodemailer';

const transporter = nodemailer.createTransport({
  service: 'gmail', // Use the email service you're working with
  auth: {
    user: 'samirelbatal0@gmail.com', // Your email
    pass: 'epysliporadqknjz', // Your email password or app password
  },
});

export const sendPasswordResetEmail = async (user, verificationCode) => {
  const mailOptions = {
    from: "samirelbatal0@gmail.com",
    to: user.email,
    subject: "Password Reset Verification",
    text: `Your verification code is: ${verificationCode}`, // Plain text fallback
    html: `
      <div style="font-family: Arial, sans-serif; color: #333; max-width: 600px; margin: auto; padding: 20px; border: 1px solid #ddd; border-radius: 8px;">
        <h2 style="color: #00695c;">Password Reset Request</h2>
        <p>Dear ${user.name || 'User'},</p>
        <p>We received a request to reset your password. Please use the following verification code to complete the process:</p>
        <div style="text-align: center; margin: 20px 0;">
          <span style="font-size: 24px; font-weight: bold; color: #00695c; background-color: #f4f4f4; padding: 10px 20px; border-radius: 8px;">${verificationCode}</span>
        </div>
        <p><strong>Note:</strong> This verification code will expire after 5 minutes. If you did not request this password reset, please ignore this email. Your password will remain unchanged.</p>
        <p>Best regards,<br>Your Support Team</p>
        <hr style="border: none; border-top: 1px solid #ddd;">
        <p style="font-size: 12px; color: #999;">This is an automated message, please do not reply.</p>
      </div>
    `,
  };

  try {
    await transporter.sendMail(mailOptions);
    console.log('Email sent successfully');
  } catch (error) {
    console.error('Error sending email:', error);
    throw new Error('Error sending email');
  }
};
