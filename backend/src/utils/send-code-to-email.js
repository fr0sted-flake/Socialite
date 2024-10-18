import { createTransport } from "nodemailer";
import getText from "./lang/get-text.js";
import errorHelper from "./helpers/error-helper.js";
import { email as senderEmail } from "../config/index.js";
export default async (email, name, confirmCode, lang, type, req, res) => {
  new Promise(async (resolve, reject) => {
    if (!email || !confirmCode || (lang !== "tr" && lang !== "en")) {
      return res.status(400).send(errorHelper("00005", req)).end();
    }

    let body = "";
    if (type == "register") {
      body = `${getText(lang, "welcomeCode")} ${name}!\r\n\r\n${getText(
        lang,
        "verificationCodeBody"
      )} ${confirmCode}`;
    } else {
      body = `${getText(lang, "verificationCodeBody")} ${confirmCode}`;
    }

    const emailInfo = {
      from: senderEmail,
      to: email,
      subject: getText(lang, "verificationCodeTitle"),
      text: body,
    };

    try {
      await emailTransfer.sendMail(emailInfo);
      return resolve("Success");
    } catch (err) {
      return reject(err);
    }
  });
};
