import nodemailer from 'nodemailer';

const transporter = nodemailer.createTransport({
  service: 'gmail', // Use the email service you're working with
  auth: {
    user: 'tripify.planner@gmail.com', 
    pass: 'pcfnbalanziakyst',
  },
});

export const sendPasswordResetEmail = async (user, verificationCode) => {
  const mailOptions = {
    from: "tripify.planner@gmail.com",
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


// Function to send admin reply to user complaint
export const sendAdminReplyEmail = async (user, replyComment) => {
  const mailOptions = {
    from: "tripify.planner@gmail.com",
    to: user.email,
    subject: "Reply to Your Complaint",
    html: `
      <div style="font-family: Arial, sans-serif; color: #333; max-width: 600px; margin: auto; padding: 20px; border: 1px solid #ddd; border-radius: 8px;">
        <h2 style="color: #00695c;">Response to Your Complaint</h2>
        <p>Dear ${user.name || 'User'},</p>
        <p>Thank you for reaching out to us. Below is our response to your complaint:</p>
        <blockquote style="border-left: 3px solid #00695c; padding-left: 10px; margin: 20px 0; color: #555;">
          ${replyComment}
        </blockquote>
        <p>If you have any further questions or need additional assistance, please do not hesitate to reach out to us.</p>
        <p>Best regards,<br>Your Support Team</p>
        <hr style="border: none; border-top: 1px solid #ddd;">
        <p style="font-size: 12px; color: #999;">This is an automated message, please do not reply.</p>
      </div>
    `,
  };

  try {
    await transporter.sendMail(mailOptions);
    console.log('Reply email sent successfully');
  } catch (error) {
    console.error('Error sending reply email:', error);
    throw new Error('Error sending reply email');
  }
};


// Function to send OTP email for payment verification
export const sendPaymentOTPEmail = async (user, OTP) => {
  const mailOptions = {
    from: "tripify.planner@gmail.com",
    to: user.email,
    subject: "Your OTP for Payment Verification",
    html: `
      <div style="font-family: Arial, sans-serif; color: #333; max-width: 600px; margin: auto; padding: 20px; border: 1px solid #ddd; border-radius: 8px;">
        <h2 style="color: #00695c;">Payment Verification OTP</h2>
        <p>Dear ${user.name || 'User'},</p>
        <p>To complete your payment, please use the following One-Time Password (OTP):</p>
        <div style="font-size: 24px; font-weight: bold; color: #00695c; text-align: center; margin: 20px 0;">
          ${OTP}
        </div>
        <p>This OTP is valid for the next 10 minutes. Please do not share this code with anyone.</p>
        <p>If you did not request this OTP, please ignore this email.</p>
        <p>Best regards,<br>Your Support Team</p>
        <hr style="border: none; border-top: 1px solid #ddd;">
        <p style="font-size: 12px; color: #999;">This is an automated message, please do not reply.</p>
      </div>
    `,
  };

  try {
    await transporter.sendMail(mailOptions);
    console.log('OTP email sent successfully');
  } catch (error) {
    console.error('Error sending OTP email:', error);
    throw new Error('Error sending OTP email');
  }
};

// Function to send email notification to admin for all out-of-stock products
export const sendOutOfStockNotificationEmailToAdmin = async (adminEmail, outOfStockProducts) => {
  // Create a formatted list of product names
  const productList = outOfStockProducts.map((product) => `<li>${product}</li>`).join("");

  const mailOptions = {
    from: "tripify.planner@gmail.com",
    to: adminEmail,
    subject: "Alert: Products Out of Stock",
    html: `
      <div style="font-family: Arial, sans-serif; color: #333; max-width: 600px; margin: auto; padding: 20px; border: 1px solid #ddd; border-radius: 8px;">
        <h2 style="color: #d9534f;">Out of Stock Products Notification</h2>
        <p>Dear Admin,</p>
        <p>The following products are currently out of stock:</p>
        <ul>
          ${productList}
        </ul>
        <p>Please take appropriate action to coordinate with sellers for restocking these items.</p>
        <p>Best regards,<br>Your Tripify Support Team</p>
        <hr style="border: none; border-top: 1px solid #ddd;">
        <p style="font-size: 12px; color: #999;">This is an automated message, please do not reply.</p>
      </div>
    `,
  };

  try {
    await transporter.sendMail(mailOptions);
    console.log("Out of stock notification email sent to admin successfully");
  } catch (error) {
    console.error("Error sending out of stock notification email to admin:", error);
    throw new Error("Error sending out of stock notification email to admin");
  }
};


// Function to send email notification for out-of-stock products
export const sendOutOfStockNotificationEmailToSeller = async (user, productName) => {
  const mailOptions = {
    from: "tripify.planner@gmail.com",
    to: user.email,
    subject: "Alert: Product Out of Stock",
    html: `
      <div style="font-family: Arial, sans-serif; color: #333; max-width: 600px; margin: auto; padding: 20px; border: 1px solid #ddd; border-radius: 8px;">
        <h2 style="color: #d9534f;">Product Out of Stock Notification</h2>
        <p>Dear ${user.name || 'Seller'},</p>
        <p>We wanted to inform you that your product titled "${productName}" is currently out of stock. This may impact sales and visibility for customers interested in this item.</p>
        <p>We recommend updating your stock as soon as possible to ensure continued availability for your customers.</p>
        <p>Best regards,<br>Your Tripify Support Team</p>
        <hr style="border: none; border-top: 1px solid #ddd;">
        <p style="font-size: 12px; color: #999;">This is an automated message, please do not reply.</p>
      </div>
    `,
  };

  try {
    await transporter.sendMail(mailOptions);
    console.log('Out of stock notification email sent successfully');
  } catch (error) {
    console.error('Error sending out of stock notification email:', error);
    throw new Error('Error sending out of stock notification email');
  }
};



// Function to send email notification for flagged content
export const sendFlagNotificationEmail = async (user, contentName, contentType) => {
  const mailOptions = {
    from: "tripify.planner@gmail.com",
    to: user.email,
    subject: "Notification: Your Content Has Been Flagged",
    html: `
      <div style="font-family: Arial, sans-serif; color: #333; max-width: 600px; margin: auto; padding: 20px; border: 1px solid #ddd; border-radius: 8px;">
        <h2 style="color: #d9534f;">Content Flagged Notification</h2>
        <p>Dear ${user.name || 'User'},</p>
        <p>We wanted to inform you that your ${contentType.toLowerCase()} titled "${contentName}" has been flagged as inappropriate by our admin team.</p>
        <p>Please review the content at your earliest convenience. If you have any questions, you can contact our support team for further assistance.</p>
        <p>Best regards,<br>Your Support Team</p>
        <hr style="border: none; border-top: 1px solid #ddd;">
        <p style="font-size: 12px; color: #999;">This is an automated message, please do not reply.</p>
      </div>
    `,
  };

  try {
    await transporter.sendMail(mailOptions);
    console.log('Flag notification email sent successfully');
  } catch (error) {
    console.error('Error sending flag notification email:', error);
    throw new Error('Error sending flag notification email');
  }
};


// Function to send email notification for unflagged (now visible) content
export const sendContentRestoredNotificationEmail = async (user, contentName, contentType) => {
  const mailOptions = {
    from: "tripify.planner@gmail.com",
    to: user.email,
    subject: "Notification: Your Content is Now Visible",
    html: `
      <div style="font-family: Arial, sans-serif; color: #333; max-width: 600px; margin: auto; padding: 20px; border: 1px solid #ddd; border-radius: 8px;">
        <h2 style="color: #5cb85c;">Content Visibility Restored</h2>
        <p>Dear ${user.name || 'User'},</p>
        <p>We are pleased to inform you that your ${contentType.toLowerCase()} titled "${contentName}" has been reviewed and is now visible to tourists on our platform.</p>
        <p>Thank you for your patience and for contributing quality content to our community. If you have any questions, feel free to reach out to our support team.</p>
        <p>Best regards,<br>Your Support Team</p>
        <hr style="border: none; border-top: 1px solid #ddd;">
        <p style="font-size: 12px; color: #999;">This is an automated message, please do not reply.</p>
      </div>
    `,
  };

  try {
    await transporter.sendMail(mailOptions);
    console.log('Content restored notification email sent successfully');
  } catch (error) {
    console.error('Error sending content restored notification email:', error);
    throw new Error('Error sending content restored notification email');
  }
};


export const sendPromoCodeEmail = async (user, discount, expiryDate, promoCode) => {
  const mailOptions = {
    from: "tripify.planner@gmail.com",
    to: user.email,
    subject: "Exclusive Promo Code Just for You!",
    text: `Dear ${user.name || 'User'},\n\nYou have received an exclusive promo code: ${promoCode}. Enjoy a ${discount}% discount on your next purchase! Use it before ${new Date(expiryDate).toLocaleDateString()}.\n\nHappy Shopping!\nYour Support Team`, // Plain text fallback
    html: `
      <div style="font-family: Arial, sans-serif; color: #333; max-width: 600px; margin: auto; padding: 20px; border: 1px solid #ddd; border-radius: 8px;">
        <h2 style="color: #00695c;">Congratulations!</h2>
        <p>Dear ${user.name || 'User'},</p>
        <p>We are thrilled to offer you an exclusive promo code as a token of appreciation:</p>
        <div style="text-align: center; margin: 20px 0;">
          <span style="font-size: 24px; font-weight: bold; color: #00695c; background-color: #f4f4f4; padding: 10px 20px; border-radius: 8px;">${promoCode}</span>
        </div>
        <p><strong>Discount:</strong> ${discount}%</p>
        <p><strong>Expiry Date:</strong> ${new Date(expiryDate).toLocaleDateString()}</p>
        <p>Don't miss out! Use this code at checkout to enjoy your discount.</p>
        <p>Best regards,<br>Your Support Team</p>
        <hr style="border: none; border-top: 1px solid #ddd;">
        <p style="font-size: 12px; color: #999;">This is an automated message, please do not reply.</p>
      </div>
    `,
  };

  try {
    await transporter.sendMail(mailOptions);
    console.log('Promo code email sent successfully');
  } catch (error) {
    console.error('Error sending promo code email:', error);
    throw new Error('Error sending promo code email');
  }
};


export const sendBirthdayPromoCodeEmail = async (user, discount, expiryDate, promoCode) => {
  const mailOptions = {
    from: "tripify.planner@gmail.com",
    to: user.email,
    subject: "🎉 Happy Birthday! Here's a Special Gift for You 🎁",
    text: `Dear ${user.name || 'User'},\n\nHappy Birthday! 🎂 To make your day extra special, we've got a surprise for you. Use your exclusive promo code: ${promoCode} to enjoy ${discount}% off your next purchase! 🎉\n\nThis special gift is valid until ${new Date(expiryDate).toLocaleDateString()}. Don't miss out!\n\nWishing you a fantastic birthday filled with joy and laughter!\n\nBest wishes,\nYour Support Team`, // Plain text fallback
    html: `
      <div style="font-family: Arial, sans-serif; color: #333; max-width: 600px; margin: auto; padding: 20px; border: 2px dashed #f9a825; border-radius: 12px; background-color: #fff7e6;">
        <h1 style="color: #f57c00; text-align: center;">🎉 Happy Birthday, ${user.name || 'User'}! 🎂</h1>
        <p style="font-size: 18px; color: #555; text-align: center;">
          We hope your day is filled with joy, laughter, and amazing memories. As a token of our celebration, here's a special gift just for you:
        </p>
        <div style="text-align: center; margin: 20px 0;">
          <span style="font-size: 28px; font-weight: bold; color: #f57c00; background-color: #ffe0b2; padding: 15px 30px; border-radius: 12px; display: inline-block;">${promoCode}</span>
        </div>
        <p style="font-size: 18px; text-align: center; color: #444;">
          Use this code to enjoy <strong>${discount}% off</strong> your next purchase! 🎁<br>
          <strong>Valid until:</strong> ${new Date(expiryDate).toLocaleDateString()}
        </p>
        <p style="font-size: 16px; color: #555; text-align: center;">
          Don't wait too long—celebrate your birthday with something special!
        </p>
        <div style="text-align: center; margin-top: 30px;">
          <img src="https://example.com/happy-birthday.gif" alt="Happy Birthday" style="max-width: 100%; height: auto; border-radius: 12px;">
        </div>
        <p style="font-size: 16px; text-align: center; margin-top: 20px; color: #555;">
          Wishing you the best birthday ever! 🎈
        </p>
        <p style="font-size: 14px; text-align: center; color: #999; margin-top: 20px;">
          This is an automated message, please do not reply.
        </p>
      </div>
    `,
  };

  try {
    await transporter.sendMail(mailOptions);
    console.log("Birthday promo code email sent successfully");
  } catch (error) {
    console.error("Error sending birthday promo code email:", error);
    throw new Error("Error sending birthday promo code email");
  }
};
