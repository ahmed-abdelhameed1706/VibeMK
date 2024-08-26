import { sender, mailtrapClient } from "./mailtrap.config.js";

import { INVITATION_EMAIL_TEMPLATE } from "./emailTemplates.js";

export const sendGroupInvitationEmail = async (
  email,
  groupCode,
  senderName,
  groupName
) => {
  const recipient = [{ email }];
  try {
    const response = await mailtrapClient.send({
      from: sender,
      to: recipient,
      subject: "Invitation to join a group",
      html: INVITATION_EMAIL_TEMPLATE.replace("{groupCode}", groupCode)
        .replace("{EMAIL_SENDER}", senderName)
        .replace("{GROUP_NAME}", groupName),
      category: "Group Invitation",
    });

    console.log("response from sendGroupInvitationEmail", response);
  } catch (error) {
    console.log("error in sendGroupInvitationEmail", error);
    throw new Error(`Error sending group invitation email ${error}`);
  }
};
