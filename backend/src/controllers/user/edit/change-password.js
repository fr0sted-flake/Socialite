import { User } from "../../../models/index.js";
import { validateChangePassword } from "../../../validators/user.validator.js";
import { errorHelper, logger, getText } from "../../../utils/index.js";
import bcrypt from "bcryptjs";
const { hash, compare } = bcrypt;

export default async (req, res) => {
  const { error } = validateChangePassword(req.body);
  if (error)
    return res
      .status(400)
      .json(errorHelper("00069", req, error.details[0].message));

  if (req.body.oldPassword === req.body.newPassword)
    return res.status(400).json(errorHelper("00073", req));

  const user = await User.findById(req.user._id)
    .select("password")
    .catch((err) => {
      return res.status(500).json(errorHelper("00070", req, err.message));
    });

  const match = await compare(req.body.oldPassword, user.password).catch(
    (err) => {
      return res.status(500).json(errorHelper("00071", req, err.message));
    }
  );

  if (!match) return res.status(400).json(errorHelper("00072", req));

  const hashed = await hash(req.body.newPassword, 10).catch((err) => {
    return res.status(500).json(errorHelper("00074", req, err.message));
  });

  user.password = hashed;

  await user.save().catch((err) => {
    return res.status(500).json(errorHelper("00075", req, err.message));
  });

  logger("00076", req.user._id, getText("00076"), "Info", req);
  return res.status(200).json({
    resultMessage: getText("00076"),
    resultCode: "00076",
  });
};

