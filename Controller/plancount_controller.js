const CountService = require("../Service/plancount_service");

exports.createOrUpdateCount = async (req, res) => {
  try {
    const { user, count } = req.body;
    const result = await CountService.createOrUpdateCount(user, count);

    res.status(200).json({
      success: true,
      message: result ? "Count updated for existing user" : "Count created successfully",
    });
  } catch (error) {
    res.status(500).json({ success: false, message: "Internal server error" });
  }
};

exports.decrementCount = async (req, res) => {
  try {
    const { user } = req.body;
    const result = await CountService.decrementCount(user);

    if (!result) {
      return res.status(404).json({ success: false, message: "User not found" });
    }

    res.status(200).json({
      success: true,
      message: "Count updated successfully",
      count: result.count,
    });
  } catch (error) {
    res.status(500).json({ success: false, message: "Internal server error" });
  }
};

exports.getCountByUser = async (req, res) => {
  try {
    const { user } = req.query;
    const result = await CountService.getCountByUser(user);

    res.status(200).json(result);
  } catch (error) {
    res.status(500).send("Internal Server Error");
  }
};
