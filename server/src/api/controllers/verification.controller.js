const mjml2html = require("mjml");
const credentials = require("../../config/credentials");
const registrationTemplate = require("../../templates/email/registration");
const client = require("../../config/client");
// const frontEnd = require("../../config/vars");
const BulkMailer = require("../services/bulkEmail");
const User = require("../models/user.model");

const bulkMailer = new BulkMailer({
  transport: credentials.email,
  verbose: true
});

const __mailerOptions = (hash, options) => {
  // const template = registrationTemplate();
  // console.log(template)
  // const html = mjml2html(template);
  const verificationUrl = `${client.baseUrl}${client.verifyEmail}/${hash}`;
  console.log(verificationUrl);
  const html = `<h4>Hi,Thanku for registeration We are happy to have you on-board. Please click on the button below to verify your account</h4><a href=${verificationUrl}
   background-color="#F45E43"> Verify </a>`;

  const mailOptions = options;
  mailOptions["html"] = html;
  mailOptions["text"] = "Hi there!";
  mailOptions["from"] = credentials.email.auth.user;
  mailOptions["subject"] = "Please verify your email";

  return mailOptions;
};

const __passwordMailerOptions = (string, options) => {
  const token = `${string}`;
  console.log(token + "---token");
  const html = `<p>You are receiving this because you (or someone else) have requested the reset of the password for your account.\n\n' +
  'Please click on the following link, or paste this into your browser to complete the process
   <a href=${token}>Create Password!</a></p>
  <p>If you did not request this, please ignore this email and your password will remain unchanged</p>`;
  console.log(html);
  const mailOptions = options;
  mailOptions["html"] = html;
  mailOptions["text"] = "Hi there";
  mailOptions["from"] = credentials.email.auth.user;
  mailOptions["subject"] = "Create new password";

  return mailOptions;
};

exports.sendPasswordEmail = (token, options) => {
  const mailerOptions = __passwordMailerOptions(token, options);
  bulkMailer.send(mailerOptions, true, (error, result) => {
    if (error) {
      console.log(error);
    } else {
      console.info(result);
    }
  });
};

const __UserIdMailerOptions = user => {
  const html = `Thanku ! You are successfully verified!`;

  const mailerOptions = {};
  mailerOptions["html"] = html;
  mailerOptions["text"] = "Hi there";
  mailerOptions["from"] = credentials.email.auth.user;
  mailerOptions["subject"] = "Successful Verification";
  mailerOptions["to"] = user.email;

  return mailerOptions;
};

exports.sendVerificationEmail = (hash, options) => {
  const mailerOptions = __mailerOptions(hash, options);
  bulkMailer.send(mailerOptions, true, (error, result) => {
    // arg1: mailinfo, agr2: parallel mails, arg3: callback
    if (error) {
      console.error(error);
    } else {
      console.info(result);
    }
  });
};

exports.verifyUserEmail = async (req, res, next) => {
  // console.log(req.params);
  const { userId } = req.params;
  try {
    const user = await User.verifyEmail(userId);
    if (user) {
      const __mailerOptions = __UserIdMailerOptions(user);
      bulkMailer.send(__mailerOptions, true, (error, result) => {
        if (error) {
          console.log(error);
        } else {
          console.info(result);
        }
      });
      return res.send("Thank you for verification.");
    }
    return res.send("Some error occurred. Please try again later");
  } catch (error) {
    return next(error);
  }
};
