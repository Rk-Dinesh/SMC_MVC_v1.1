const certificateCourse = require("../Model/certificate_model");

exports.getCertificateByIdandUserId = async (courseId, userId) => {
  return await certificateCourse.findOne({
    courseId: courseId,
    userId: userId,
  });
};  

exports.getCertificateByUserId = async (page,limit, searchValue,userId) => {
    const skip = (page - 1) * limit;
    
    const query = {
        userId: userId, // Filter by userId
        ...(searchValue && {
        $or: [{ courseName: { $regex: searchValue, $options: "i" } }],
        }),
    };
    
    // Fetch paginated data
    const certificates = await certificateCourse.find(query)
        .skip(skip)
        .limit(limit)
        .sort({ issueDate: -1 });
    
    const totalCount = await certificateCourse.countDocuments(query);
    
    return { certificates, totalCount };
};