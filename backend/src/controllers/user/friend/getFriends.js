import { User } from "../../../models/index.js";
import { errorHelper, getText } from "../../../utils/index.js";

const getFriends = async (req, res) => {
  const userId = req.user._id;

  try {
    const user = await User.findById(userId).populate('friends', 'name photoUrl');
    
    if (!user) {
      return res.status(404).json(errorHelper("00041", req));
    }

    const friends = user.friends.map(friend => ({
      id: friend._id,
      name: friend.name,
      photoUrl: friend.photoUrl
    }));

    return res.status(200).json({
      resultMessage: getText("00046"),
      resultCode: "00046",
      friends
    });
  } catch (err) {
    console.error(err);
    return res.status(500).json(errorHelper("00047", req, err.message));
  }
};

export default getFriends;