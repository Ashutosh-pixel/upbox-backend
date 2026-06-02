const { SendEmailCommand } = require("@aws-sdk/client-ses");
const { sesClient } = require("../utils/config");

const sendEmail = async ({ to, subject, html, text }) => {

  const params = {
    Source: process.env.SES_FROM_EMAIL,

    Destination: {
      ToAddresses: Array.isArray(to) ? to : [to],
    },

    Message: {
      Subject: {
        Data: subject,
      },

      Body: {
        Html: {
          Data: html || "",
        },

        Text: {
          Data: text || "",
        },
      },
    },
  };

  const command = new SendEmailCommand(params);

  return await sesClient.send(command);
};

module.exports = sendEmail;