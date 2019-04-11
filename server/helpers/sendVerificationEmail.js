import mailer from './mailer';

/**
 * Send a link containing a token,
 * returns an object with a sent
 * property
 *
 * @param {string} email
 * @param {string} name
 * @param {string} token
 * @returns {object} {sent,error}
 */
const sendToken = async (email, name, token) => {
  const link = `app.heroku.com/api/v1/auth/verification/${token}`;
  const body = `
            Thank you for registering at Authors Haven,
            your account has been created and must be activated before you can use it 
            To activate your account use the link bellow.
    `;

  try {
    const response = await mailer({
      email,
      subject: 'Email verification',
      text: `${name}`,
      link,
      linkText: 'VERIFY MY ACCOUNT',
      name,
      title: 'Welcome to Authors Haven',
      body
    });

    return response;
  } catch (error) {
    return {
      sent: false,
      error
    };
  }
};

export default sendToken;
