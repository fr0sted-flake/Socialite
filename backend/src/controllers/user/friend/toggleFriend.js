import { User } from "../../../models/index.js";
import { errorHelper, getText } from "../../../utils/index.js";

const toggleFriend = async (req, res) => {
  const userId = req.user._id;
  const { friendId } = req.params;

  try {
    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json(errorHelper("00041", req));
    }

    const friend = await User.findById(friendId);
    if (!friend) {
      return res.status(404).json(errorHelper("00042", req));
    }

    const isFriend = user.friends.includes(friendId);

    if (isFriend) {
      // Remove friend
      await User.findByIdAndUpdate(userId, { $pull: { friends: friendId } });
      await User.findByIdAndUpdate(friendId, { $pull: { friends: userId } });
      return res.status(200).json({
        resultMessage: getText("00043"),
        resultCode: "00043",
        isFriend: false
      });
    } else {
      // Add friend
      await User.findByIdAndUpdate(userId, { $addToSet: { friends: friendId } });
      await User.findByIdAndUpdate(friendId, { $addToSet: { friends: userId } });
      return res.status(200).json({
        resultMessage: getText("00044"),
        resultCode: "00044",
        isFriend: true
      });
    }
  } catch (err) {
    console.error(err);
    return res.status(500).json(errorHelper("00045", req, err.message));
  }
};

export default toggleFriend;