import { sender, mailtrapClient } from "./mailtrap.config.js";
import {
  PASSWORD_RESET_REQUEST_TEMPLATE,
  VERIFICATION_EMAIL_TEMPLATE,
  PASSWORD_RESET_SUCCESS_TEMPLATE,
} from "./emailTemplates.js";

export const sendVerificationEmail = async (email, verificationToken) => {
  const recipient = [{ email }];
  try {
    const response = await mailtrapClient.send({
      from: sender,
      to: recipient,
      subject: "Account Verification",
      html: VERIFICATION_EMAIL_TEMPLATE.replace(
        "{verificationCode}",
        verificationToken
      ),
      category: "Verification Email",
    });

    console.log("response from sendVerificationEmail", response);
  } catch (error) {
    console.log("error in sendVerificationEmail", error);
    throw new Error(`Error sending verification email ${error}`);
  }
};

export const sendWelcomeEmail = async (email, fullName) => {
  const recipient = [{ email }];
  try {
    const response = await mailtrapClient.send({
      from: sender,
      to: recipient,
      template_uuid: process.env.MAILTRAP_WELCOME_TEMPLATE_ID,
      template_variables: {
        company_info_name: process.env.APP_NAME,
        name: fullName,
        company_info_address: process.env.APP_ADDRESS,
        company_info_city: process.env.APP_CITY,
        company_info_zip_code: process.env.APP_ZIP_CODE,
        company_info_country: process.env.APP_COUNTRY,
      },
    });
    console.log("Welcome email sent successfully", response);
  } catch (error) {
    console.log("error in sendWelcomeEmail", error);
    throw new Error(`Error sending welcome email ${error}`);
  }
};

export const sendPasswordResetEmail = async (email, resetUrl) => {
  const recipient = [{ email }];
  try {
    const response = await mailtrapClient.send({
      from: sender,
      to: recipient,
      subject: "Password Reset Request",
      html: PASSWORD_RESET_REQUEST_TEMPLATE.replace("{resetURL}", resetUrl),
      category: "Password Reset Email",
    });

    console.log("response from sendPasswordResetEmail", response);
  } catch (error) {
    console.log("error in sendPasswordResetEmail", error);
    throw new Error(`Error sending password reset email ${error}`);
  }
};

export const sendResetSuccessEmail = async (email) => {
  const recipient = [{ email }];

  try {
    const response = await mailtrapClient.send({
      from: sender,
      to: recipient,
      subject: "Password Reset Success",
      html: PASSWORD_RESET_SUCCESS_TEMPLATE,
      category: "Password Reset Success",
    });

    console.log("response from sendResetSuccessEmail", response);
  } catch (error) {
    console.log("error in sendResetSuccessEmail", error);
    throw new Error(`Error sending reset success email ${error}`);
  }
};
