const certificateCourseService = require("../Service/certificate_Service");

exports.getCertificateByIdandUserId = async (req, res) => {
  const { courseId, userId } = req.params;

  try {
    const certificate =
      await certificateCourseService.getCertificateByIdandUserId(
        courseId,
        userId
      );
    if (!certificate) {
      return res.status(404).json({ message: "Certificate not found" });
    }
    res.status(200).json({ data: certificate });
  } catch (error) {
    console.error("Error fetching certificate:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};

exports.getcertificatebyUserId = async (req, res) => {
  const page = parseInt(req.query.page) || 1; // Default to page 1 if not provided
  const limit = parseInt(req.query.limit) || 10; // Default to 10 items per page
  const searchValue = req.query.search || ""; // Default to empty string if not provided
  const userId = req.query.userId; // Assuming userId is passed as a query parameter

  try {
    const {certificates,totalCount} = await certificateCourseService.getCertificateByUserId(
      page,
      limit,
      searchValue,
      userId
    );

    res.status(200).json({
          status: true,
          message: "PreCourse retrieved successfully",
          data: certificates,
          metadata: {
              currentPage: page,
              totalPages: Math.ceil(totalCount / limit),
              totalItems: totalCount,
          },
      });
  } catch (error) {
    console.error("Error fetching certificates:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};
