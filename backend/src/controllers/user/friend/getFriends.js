import { User } from "../../../models/index.js";
import { errorHelper, getText } from "../../../utils/index.js";

const getFriends = async (req, res) => {
  const userId = req.user._id;

  try {
    const user = await User.findById(userId);
    
    if (!user) {
      return res.status(404).json(errorHelper("00041", req));
    }

    return res.status(200).json({
      resultMessage: getText("00046"),
      resultCode: "00046",
      friends:user
    });
  } catch (err) {
    console.error(err);
    return res.status(500).json(errorHelper("00047", req, err.message));
  }
};

export default getFriends;