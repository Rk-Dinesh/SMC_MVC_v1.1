require("dotenv").config();
const Language = require("../Model/lang_model");
const PreCourse = require("../Model/pre_genCourses_model");
const { createApi } = require("unsplash-js");
const unsplash = createApi({ accessKey: process.env.UNSPLASH_ACCESS_KEY });

exports.precreateCourse = async (courseData) => {
  const {
    content,
    type,
    mainTopic,
    lang,
    category,
    subCategory1,
    subCategory2,
  } = courseData;
  let photo;
  try {
    const result = await unsplash.search.getPhotos({
      query: mainTopic,
      page: 1,
      perPage: 1,
      orientation: "landscape",
    });

    const photos = result.response.results;
    if (photos.length > 0) {
      photo = photos[0].urls.regular;
    } else {
      photo =
        "https://images.unsplash.com/photo-1659079631665-eb95370fb173?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w2MzQyNTB8MHwxfHNlYXJjaHwxfHxqYXZhc2NyaXB0fGVufDB8MHx8fDE3MzY3NDU1ODR8MA&ixlib=rb-4.0.3&q=80&w=1080";
    }
  } catch (error) {
    // console.error("Error fetching photo from Unsplash:", error);
    photo =
      "https://images.unsplash.com/photo-1659079631665-eb95370fb173?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w2MzQyNTB8MHwxfHNlYXJjaHwxfHxqYXZhc2NyaXB0fGVufDB8MHx8fDE3MzY3NDU1ODR8MA&ixlib=rb-4.0.3&q=80&w=1080";
  }
  const newCourse = new PreCourse({
    content,
    type,
    mainTopic,
    lang,
    photo,
    category,
    subCategory1,
    subCategory2,
  });
  const newLang = new Language({ course: newCourse._id, lang: lang });
  await newLang.save();
  return await newCourse.save();
};

exports.addUserToPreCourse = async (courseId, userId) => {
  const course = await PreCourse.findById(courseId);

  if (!course) {
    throw new Error("Course not found");
  }

  const userExists = course.user.some(
    (user) => user.userId.toString() === userId.toString()
  );

  if (!userExists) {
    // console.log("User  does not exist, adding user:", userId);
    course.user.push({
      userId: userId,
      completed: false,
      startDate: Date.now(), // Corrected Date reference
    });

    try {
      await course.save();
      //  console.log("User  added successfully:", course.user);
    } catch (error) {
      console.error("Error saving course:", error);
    }
  } else {
    console.log("User  already exists in the course:", userId);
  }

  return course;
};

exports.updatePreCourse = async (courseId, content) => {
  const precourse = await PreCourse.findOneAndUpdate(
    { _id: courseId },
    { $set: { content } },
    { new: true }
  );
  return precourse;
};

exports.finishPreCourse = async (courseId, userId) => {
  await PreCourse.findOneAndUpdate(
    {
      _id: courseId,
      "user.userId": userId,
    },
    {
      $set: {
        "user.$.completed": true,
        "user.$.endDate": new Date(),
      },
    },
    { new: true }
  );
};

// exports.finishPreCourse = async (courseId) => {
//   return await PreCourse.findOneAndUpdate(
//     { _id: courseId },
//     { $set: { completed: true, end: Date.now() } },
//     { new: true }
//   );
// };

exports.getAllPreCourses = async () => {
  return await PreCourse.find({});
};

exports.deletePreCourse = async (id) => {
  return await PreCourse.findByIdAndDelete(id);
};

exports.getAllPreCourseLimit = async (
  page,
  limit,
  searchValue,
  category,
  subcategory1,
  subcategory2
) => {
  const skip = (page - 1) * limit;

  const query = {
    ...(searchValue && {
      $or: [{ mainTopic: { $regex: searchValue, $options: "i" } }],
    }),
    ...(category && { category: category }),
    ...(subcategory1 && { subCategory1: subcategory1 }),
    ...(subcategory2 && { subCategory2: subcategory2 }),
  };

  // Fetch paginated data
  const course = await PreCourse.find(query)
    .skip(skip)
    .limit(limit)
    .sort({ date: -1 });

  // Fetch total count of matching documents for pagination metadata
  const totalCount = await PreCourse.countDocuments(query);

  return { course, totalCount };
};

exports.getCourseById = async (courseId) => {
  try {
    return await PreCourse.findById(courseId)
      .populate({
        path: "user.userId",
        select: "id fname lname email phone type",
      })
      .select("+user.completed +user.startDate +user.endDate +user.quizMarks +user.quizPassed");
  } catch (error) {
    throw error;
  }
};

exports.updateMarks = async (courseId, marksString, userId) => {
  try {
    return await PreCourse.findOneAndUpdate(
      {
        _id: courseId,
        "user.userId": userId,
      },
      {
        $set: {
          "user.$.quizMarks": marksString,
          "user.$.quizPassed": true,
        },
      },
      { new: true }
    );
  } catch (error) {
    throw error;
  }
};

// async getCourseById(courseId) {
//   try {
//     const course = await PreCourse.findById(courseId)
//       .populate({
//         path: 'user.userId',
//         select: 'id fname lname email phone type'
//       });

//     // Manually include the user sub-document fields
//     return {
//       ...course.toObject(),
//       user: course.user.map(u => ({
//         ...u.toObject(),
//         completed: u.completed,
//         startDate: u.startDate,
//         endDate: u.endDate
//       }))
//     };
//   } catch (error) {
//     throw error;
//   }
// }

// {
//   "_id": "course123",
//   "content": "Course content...",
//   "user": [
//     {
//       "userId": {
//         "id": "user123",
//         "fname": "John",
//         "lname": "Doe",
//         "email": "john@example.com",
//         "phone": "+1234567890",
//         "type": "student"
//       },
//       "completed": true,
//       "startDate": "2023-10-01T00:00:00.000Z",
//       "endDate": "2023-10-15T00:00:00.000Z"
//     }
//   ],
//   "createdAt": "2023-10-01T00:00:00.000Z",
//   "updatedAt": "2023-10-15T00:00:00.000Z"
// }
