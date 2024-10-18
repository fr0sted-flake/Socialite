import { User } from "../../../models/index.js";
import { validateLogin } from "../../../validators/user.validator.js";
import {
  errorHelper,
  getText,
  logger,
  signAccessToken,
} from "../../../utils/index.js";
import bcrypt from "bcryptjs";
const { compare } = bcrypt;

export default async (req, res) => {
  const { error } = validateLogin(req.body);
  if (error) {
    let code = "00038";
    if (error.details[0].message.includes("email")) code = "00039";
    else if (error.details[0].message.includes("password")) code = "00040";

    return res
      .status(400)
      .json(errorHelper(code, req, error.details[0].message));
  }

  const user = await User.findOne({
    email: req.body.email,
    isActivated: true,
  })
    .select("+password")
    .catch((err) => {
      return res.status(500).json(errorHelper("00041", req, err.message));
    });

  if (!user) return res.status(404).json(errorHelper("00042", req));

  if (!user.isActivated) return res.status(400).json(errorHelper("00043", req));

  const match = await compare(req.body.password, user.password);
  if (!match) return res.status(400).json(errorHelper("00045", req));

  const accessToken = signAccessToken(user._id);

  logger("00047", user._id, getText("00047"), "Info", req);
  return res.status(200).json({
    resultMessage: getText("00047"),
    resultCode: "00047",
    user,
    accessToken
  });
};