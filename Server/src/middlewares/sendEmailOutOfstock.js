import nodemailer from "nodemailer";

// Create a transporter using Nodemailer
const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: "tripify.planner@gmail.com",
    pass: "pcfnbalanziakyst",
  },
});

// Function to send an email notification
export const sendEmailNotification = async (recipientEmail, productName) => {
  try {
    const mailOptions = {
      from: "Tripify",
      to: recipientEmail,
      subject: `Product Out of Stock: ${productName}`,
      text: `Dear user,\n\nThe product "${productName}" is now out of stock.\n\nThank you,\nYour Company Name`,
    };

    await transporter.sendMail(mailOptions);
    console.log("Email sent successfully!");
  } catch (error) {
    console.error("Error sending email:", error);
  }
};
