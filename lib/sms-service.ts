// Example: Real OTP sending with Twilio SMS
// 1. Sign up at https://www.twilio.com/
// 2. Get your Account SID, Auth Token, and phone number
// 3. Install twilio package: npm install twilio

// For client-side, you'd typically call your backend API
export const sendSMSOTP = async (phone: string, otp: string) => {
  try {
    const response = await fetch('/api/send-sms', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        phone,
        otp
      }),
    });

    if (!response.ok) {
      throw new Error('Failed to send SMS');
    }

    const result = await response.json();
    console.log('SMS sent successfully:', result);
    return result;
  } catch (error) {
    console.error('Failed to send SMS:', error);
    throw error;
  }
};