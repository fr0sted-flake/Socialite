import { User } from "../../../models/index.js";
import { errorHelper, getText } from "../../../utils/index.js";

const searchFriends = async (req, res) => {
  const { query } = req.params;
  const userId = req.user._id;

  if (!query) {
    return res.status(400).json(errorHelper("00048", req));
  }

  try {
    const regex = new RegExp(query, 'i'); // 'i' flag for case-insensitive search
    const users = await User.find({
      _id: { $ne: userId }, // Exclude the current user
      name: { $regex: regex }
    }).select('_id name email photoUrl');

    if (users.length === 0) {
      return res.status(404).json({
        resultMessage: getText("00049"),
        resultCode: "00049",
        users: []
      });
    }

    return res.status(200).json({
      resultMessage: getText("00050"),
      resultCode: "00050",
      users
    });
  } catch (err) {
    console.error(err);
    return res.status(500).json(errorHelper("00051", req, err.message));
  }
};

export default searchFriends;