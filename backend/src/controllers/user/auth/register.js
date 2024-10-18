import { User } from "../../../models/index.js";
import { validateRegister } from "../../../validators/user.validator.js";
import {
  errorHelper,
  logger,
  getText,
  signAccessToken,
} from "../../../utils/index.js";
import bcrypt from "bcryptjs";
const { hash } = bcrypt;

export default async (req, res) => {
  console.log(req.body);
  const { error } = validateRegister(req.body);
  if (error) {
    let code = "00025";
    if (error.details[0].message.includes("email")) code = "00026";
    else if (error.details[0].message.includes("password")) code = "00027";
    else if (error.details[0].message.includes("name")) code = "00028";

    return res
      .status(400)
      .json(errorHelper(code, req, error.details[0].message));
  }

  const exists = await User.exists({ email: req.body.email }).catch((err) => {
    return res.status(500).json(errorHelper("00031", req, err.message));
  });

  if (exists) return res.status(409).json(errorHelper("00032", req));

  const hashed = await hash(req.body.password, 10);

  let name = req.body.name;

  let user = new User({
    email: req.body.email,
    password: hashed,
    name: name,
  });

  user = await user.save().catch((err) => {
    return res.status(500).json(errorHelper("00034", req, err.message));
  });

  const accessToken = signAccessToken(user._id);
  user.password = null;

  logger("00035", user._id, getText("00035"), "Info", req);
  return res.status(200).json({
    resultMessage: getText("00035"),
    resultCode: "00035",
    user,
    accessToken,
  });
};
