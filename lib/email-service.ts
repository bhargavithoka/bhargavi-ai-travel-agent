// Example: Real OTP sending with EmailJS
// 1. Sign up at https://www.emailjs.com/
// 2. Create an email service (Gmail, Outlook, etc.)
// 3. Create an email template
// 4. Get your service ID, template ID, and public key

import emailjs from '@emailjs/browser';

// Initialize EmailJS with your public key
emailjs.init('YOUR_PUBLIC_KEY'); // Replace with your actual public key

export const sendEmailOTP = async (email: string, otp: string, userName: string) => {
  const templateParams = {
    to_email: email,
    to_name: userName,
    otp_code: otp,
    subject: 'Your Travel AI Verification Code'
  };

  try {
    const result = await emailjs.send(
      'YOUR_SERVICE_ID', // Replace with your service ID
      'YOUR_TEMPLATE_ID', // Replace with your template ID
      templateParams
    );
    console.log('Email sent successfully:', result);
    return result;
  } catch (error) {
    console.error('Failed to send email:', error);
    throw error;
  }
};

// Example email template you would create in EmailJS:
// Subject: Your Travel AI Verification Code
//
// Hi {{to_name}},
// Your verification code is: {{otp_code}}
//
// This code will expire in 10 minutes.
//
// Best regards,
// Travel AI Team