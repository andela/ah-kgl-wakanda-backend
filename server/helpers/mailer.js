import unirest from 'unirest';
import dotenv from 'dotenv';

dotenv.config();

/**
 * An asychronous function to send emails.
 * Returns an object with a sent boolean property,
 * If false, check the error
 *
 * @param {object} {
 *   email,
 *   subject,
 *   link,
 *   linkText,
 *   name,
 *   title,
 *   body
 * }
 * @returns {Promise} Promise
 */
const mailer = async ({
  email,
  subject,
  link,
  linkText,
  name,
  title,
  body,
  usersInfo,
}) => {
  const req = unirest('POST', 'https://api.sendgrid.com/v3/mail/send');

  req.headers({
    'content-type': 'application/json',
    authorization: `Bearer ${process.env.SENDGRID_API_KEY}`
  });

  const message = {
    personalizations: [
      {
        to: usersInfo || [{ email, name }],
        dynamic_template_data: {
          name,
          link,
          linkText,
          subject,
          title,
          body
        },
        subject
      }
    ],
    from: { email: 'noreply@authorshaven.com' },
    template_id: 'd-29060466d3544ef7845065aad76956f3'
  };

  req.type('json');
  await req.send(message);

  return new Promise((resolve, reject) => {
    req.end((res) => {
      if (res.error) {
        reject(new Error({
          sent: false,
          error: res.raw_body.errors[0].message
        }));
      }

      resolve({
        sent: true
      });
    });
  });
};

export default mailer;
