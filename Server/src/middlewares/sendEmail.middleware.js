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
  console.log(user);
  console.log("-----------------------");
  
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


export const sendPaymentReceiptEmail = async (user, bookingDetails, tickets, totalAmount, discount) => {
  const today = new Date().toLocaleDateString();

  const eventDate = new Date(bookingDetails.date).toLocaleDateString();


  const mailOptions = {
    from: "tripify.planner@gmail.com",
    to: user.email,
    subject: "🧾 Payment Receipt for Your Booking",
    text: `Dear ${user.name || 'User'},\n\nThank you for your payment! We’re excited to confirm your booking.\n\nHere are the details of your booking and payment:\n\n- Booking Type: ${bookingDetails.type}\n- Booking Name: ${bookingDetails.name}\n- Number of Tickets: ${tickets}\n- Total Amount Paid: $${totalAmount}\n- Discount Applied: ${discount}%\n- Payment Date: ${today}\n\nWe appreciate your trust in us and look forward to providing you with an amazing experience!\n\nIf you have any questions or need assistance, please don’t hesitate to reach out.\n\nBest regards,\nYour Support Team`, // Plain text fallback
    html: `
      <div style="font-family: Arial, sans-serif; color: #333; max-width: 600px; margin: auto; padding: 20px; border: 1px solid #ccc; border-radius: 12px; background-color: #f9f9f9;">
        <h1 style="color: #4caf50; text-align: center;">🧾 Payment Receipt</h1>
        <p style="font-size: 18px; color: #555; text-align: center;">
          Thank you, <strong>${user.name || 'User'}</strong>, for your payment! We are delighted to confirm your booking.
        </p>
        <h2 style="color: #1976d2; text-align: center; margin: 20px 0;">"${bookingDetails.name}"</h2>
        <div style="font-size: 16px; color: #333; margin: 20px 0;">
          <p><strong>Booking Details:</strong></p>
          <ul style="list-style-type: none; padding: 0;">
            <li>📝 <strong>Booking Type:</strong> ${bookingDetails.type}</li>
            <li>🎟️ <strong>Number of Tickets:</strong> ${tickets}</li>
            <li>💰 <strong>Total Amount Paid:</strong> ${totalAmount} EGP</li>
            <li>🎉 <strong>Discount Applied:</strong> ${discount}%</li>
            <li>📅 <strong>Event Date:</strong> ${eventDate}</li>
            <li>📅 <strong>Payment Date:</strong> ${today}</li>
          </ul>
        </div>
        <p style="font-size: 16px; text-align: center; color: #555;">
          Please keep this receipt for your records. If you have any questions or need further assistance, feel free to reach out to our support team.
        </p>
        <div style="text-align: center; margin-top: 30px;">
          <img src="https://example.com/payment-confirmation.png" alt="Payment Confirmed" style="max-width: 100%; height: auto; border-radius: 12px;">
        </div>
        <p style="font-size: 16px; text-align: center; margin-top: 20px; color: #555;">
          Thank you for choosing us! We look forward to making your experience memorable. 😊
        </p>
        <p style="font-size: 14px; text-align: center; color: #999; margin-top: 20px;">
          This is an automated message, please do not reply.
        </p>
      </div>
    `,
  };

  try {
    await transporter.sendMail(mailOptions);
  } catch (error) {
    console.error("Error sending birthday promo code email:", error);
    throw new Error("Error sending birthday promo code email");
  }

};


export const sendItineraryActiveEmail = async (user, itineraryName, bookingLink) => {
  const mailOptions = {
    from: "tripify.planner@gmail.com",
    to: user.email,
    subject: "📢 Your Favorite Itinerary is Active Again! 🌟",
    text: `Dear ${user.name || 'User'},\n\nGood news! The itinerary you showed interest in, "${itineraryName}", is now active again and ready for booking! 🌍✨\n\nDon't miss your chance to secure it before it's gone.\n\nClick here to book now: ${bookingLink}\n\nHappy planning!\n\nBest regards,\nYour Tripify Team`, // Plain text fallback
    html: `
      <div style="font-family: Arial, sans-serif; color: #333; max-width: 600px; margin: auto; padding: 20px; border: 2px solid #4caf50; border-radius: 12px; background-color: #e8f5e9;">
        <h1 style="color: #388e3c; text-align: center;">📢 Exciting News, ${user.name || 'User'}! 🌟</h1>
        <p style="font-size: 18px; color: #555; text-align: center;">
          The itinerary you were interested in, <strong>"${itineraryName}"</strong>, is now <span style="color: #388e3c; font-weight: bold;">active</span> and ready for booking! 🎉
        </p>
        <p style="font-size: 18px; text-align: center; color: #444;">
          Don’t miss this opportunity—secure your spot today!
        </p>
        <div style="text-align: center; margin: 20px 0;">
          <a href="${bookingLink}" style="font-size: 20px; font-weight: bold; color: #fff; background-color: #388e3c; padding: 15px 30px; text-decoration: none; border-radius: 8px; display: inline-block;">Book Now</a>
        </div>
       
        <div style="text-align: center; margin-top: 30px;">
          <img src="https://example.com/itinerary-active.jpg" alt="Itinerary Active" style="max-width: 100%; height: auto; border-radius: 12px;">
        </div>
        <p style="font-size: 16px; text-align: center; margin-top: 20px; color: #555;">
          Ready to explore the world? 🌍✨
        </p>
        <p style="font-size: 14px; text-align: center; color: #999; margin-top: 20px;">
          This is an automated message, please do not reply.
        </p>
      </div>
    `,
  };

  try {
    await transporter.sendMail(mailOptions);
  } catch (error) {
    console.error("Error sending itinerary active email:", error);
    throw new Error("Error sending itinerary active email");
  }
};


export const sendActivityActiveEmail = async (user, activityName, bookingLink) => {
  const mailOptions = {
    from: "tripify.planner@gmail.com",
    to: user.email,
    subject: "📢 Your Favorite Activity is Now Available! 🌟",
    text: `Dear ${user.name || 'User'},\n\nExciting news! The activity you showed interest in, "${activityName}", is now available for booking! 🎉\n\nDon't miss out on this incredible experience.\n\nClick here to book now: ${bookingLink}\n\nBest regards,\nYour Tripify Team`, // Plain text fallback
    html: `
      <div style="font-family: Arial, sans-serif; color: #333; max-width: 600px; margin: auto; padding: 20px; border: 2px solid #2196f3; border-radius: 12px; background-color: #e3f2fd;">
        <h1 style="color: #1565c0; text-align: center;">📢 Exciting News, ${user.name || 'User'}! 🌟</h1>
        <p style="font-size: 18px; color: #555; text-align: center;">
          The activity you were interested in, <strong>"${activityName}"</strong>, is now <span style="color: #1565c0; font-weight: bold;">available</span> and open for booking! 🎉
        </p>
        <p style="font-size: 18px; text-align: center; color: #444;">
          Don’t wait—secure your spot for this amazing activity today!
        </p>
        <div style="text-align: center; margin: 20px 0;">
          <a href="${bookingLink}" style="font-size: 20px; font-weight: bold; color: #fff; background-color: #1565c0; padding: 15px 30px; text-decoration: none; border-radius: 8px; display: inline-block;">Book Now</a>
        </div>
       
        <div style="text-align: center; margin-top: 30px;">
          <img src="https://example.com/activity-active.jpg" alt="Activity Active" style="max-width: 100%; height: auto; border-radius: 12px;">
        </div>
        <p style="font-size: 16px; text-align: center; margin-top: 20px; color: #555;">
          Get ready for your next adventure! 🌍✨
        </p>
        <p style="font-size: 14px; text-align: center; color: #999; margin-top: 20px;">
          This is an automated message, please do not reply.
        </p>
      </div>
    `,
  };

  try {
    await transporter.sendMail(mailOptions);
  } catch (error) {
    console.error("Error sending activity active email:", error);
    throw new Error("Error sending activity active email");
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
          <strong>Valid until the end of the day</strong> 
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
  } catch (error) {
    console.error("Error sending birthday promo code email:", error);
    throw new Error("Error sending birthday promo code email");
  }
};


export const sendActivityReminderEmail = async (tourist, activity) => {
  const formattedDate = new Date(activity.date).toLocaleDateString();

  const mailOptions = {
    from: "tripify.planner@gmail.com",
    to: tourist.email,
    subject: "📅 Reminder: Your Activity is Scheduled for Tomorrow!",
    text: `Dear ${tourist.name || 'Traveler'},\n\nThis is a friendly reminder about your upcoming activity scheduled for tomorrow:\n\nActivity: ${activity.name}\nDate: ${formattedDate}\nLocation: ${activity.location}\n\nPlease make sure you're prepared and on time. If you have any questions or need assistance, feel free to reach out.\n\nSafe travels and enjoy your activity!\n\nBest regards,\nYour Tripify Support Team`, // Plain text fallback
    html: `
      <div style="font-family: Arial, sans-serif; color: #333; max-width: 600px; margin: auto; padding: 20px; border: 2px solid #2196f3; border-radius: 12px; background-color: #e3f2fd;">
        <h1 style="color: #1565c0; text-align: center;">📅 Reminder: Your Activity is Scheduled for Tomorrow!</h1>
        <p style="font-size: 18px; color: #555; text-align: center;">
          Dear <strong>${tourist.name || 'Traveler'}</strong>,<br>
          We’re excited to remind you of your activity tomorrow! Here are the details:
        </p>
        <div style="font-size: 16px; color: #444; background-color: #bbdefb; padding: 15px; border-radius: 12px; margin: 20px auto; text-align: left;">
          <p><strong>Activity:</strong> ${activity.name}</p>
          <p><strong>Date:</strong> ${formattedDate}</p>
          <p><strong>Location:</strong> ${activity.location}</p>
        </div>
        <p style="font-size: 16px; text-align: center; color: #444;">
          Don’t forget to arrive on time and have everything you need for the activity. If you have questions, we’re just a message away!
        </p>
        <div style="text-align: center; margin-top: 30px;">
          <img src="https://example.com/activity-reminder.jpg" alt="Activity Reminder" style="max-width: 100%; height: auto; border-radius: 12px;">
        </div>
        <p style="font-size: 16px; text-align: center; margin-top: 20px; color: #555;">
          Have an amazing experience!
        </p>
        <p style="font-size: 14px; text-align: center; color: #999; margin-top: 20px;">
          This is an automated message, please do not reply.
        </p>
      </div>
    `,
  };

  try {
    await transporter.sendMail(mailOptions);
    console.log("Activity reminder email sent successfully");
  } catch (error) {
    console.error("Error sending activity reminder email:", error);
    throw new Error("Error sending activity reminder email");
  }
};


export const sendItineraryReminderEmail = async (tourist, itinerary) => {
  const formattedStartDate = new Date(itinerary.timeline.startTime).toLocaleDateString();
  const formattedEndDate = new Date(itinerary.timeline.endTime).toLocaleDateString();  

  const mailOptions = {
    from: "tripify.planner@gmail.com",
    to: tourist.email,
    subject: "🗺️ Reminder: Your Itinerary Starts Tomorrow!",
    text: `Dear ${tourist.name || 'Traveler'},\n\nThis is a friendly reminder about your exciting journey that starts tomorrow:\n\nItinerary: ${itinerary.name}\nStart Date: ${formattedStartDate}\nEnd Date: ${formattedEndDate}\n\nPlease double-check your plans, and feel free to reach out if you have any questions.\n\nHave a fantastic trip!\n\nBest regards,\nYour Tripify Support Team`, // Plain text fallback
    html: `
      <div style="font-family: Arial, sans-serif; color: #333; max-width: 600px; margin: auto; padding: 20px; border: 2px solid #ff5722; border-radius: 12px; background-color: #ffe0b2;">
        <h1 style="color: #e64a19; text-align: center;">🗺️ Reminder: Your Itinerary Starts Tomorrow!</h1>
        <p style="font-size: 18px; color: #555; text-align: center;">
          Dear <strong>${tourist.name || 'Traveler'}</strong>,<br>
          Your exciting journey begins tomorrow! Here’s a summary of your itinerary:
        </p>
        <div style="font-size: 16px; color: #444; background-color: #ffccbc; padding: 15px; border-radius: 12px; margin: 20px auto; text-align: left;">
          <p><strong>Itinerary:</strong> ${itinerary.name}</p>
          <p><strong>Start Date:</strong> ${formattedStartDate}</p>
          <p><strong>End Date:</strong> ${formattedEndDate}</p>
        </div>
        <p style="font-size: 16px; text-align: center; color: #444;">
          Make sure to review your plans and get ready for an unforgettable adventure! If you need assistance, we’re here to help.
        </p>
        <div style="text-align: center; margin-top: 30px;">
          <img src="https://example.com/itinerary-reminder.jpg" alt="Itinerary Reminder" style="max-width: 100%; height: auto; border-radius: 12px;">
        </div>
        <p style="font-size: 16px; text-align: center; margin-top: 20px; color: #555;">
          Have an amazing trip filled with wonderful memories!
        </p>
        <p style="font-size: 14px; text-align: center; color: #999; margin-top: 20px;">
          This is an automated message, please do not reply.
        </p>
      </div>
    `,
  };

  try {
    await transporter.sendMail(mailOptions);
    console.log("Itinerary reminder email sent successfully");
  } catch (error) {
    console.error("Error sending itinerary reminder email:", error);
    throw new Error("Error sending itinerary reminder email");
  }
};
