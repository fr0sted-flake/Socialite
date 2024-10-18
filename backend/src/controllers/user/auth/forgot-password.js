import { User } from "../../../models/index.js";
import { validateForgotPassword } from "../../../validators/user.validator.js";
import { errorHelper, getText } from "../../../utils/index.js";
import bcrypt from "bcryptjs";
const { hash } = bcrypt;

export default async (req, res) => {
  const { error } = validateForgotPassword(req.body);
  if (error)
    return res
      .status(400)
      .json(errorHelper("00066", req, error.details[0].message));

  const hashed = await hash(req.body.password, 10);

  await User.updateOne(
    { _id: req.user._id, isVerified: true, isActivated: true },
    { $set: { password: hashed } }
  ).catch((err) => {
    return res.status(500).json(errorHelper("00067", req, err.message));
  });

  return res.status(200).json({
    resultMessage: getText("00068"),
    resultCode: "00068",
  });
};
