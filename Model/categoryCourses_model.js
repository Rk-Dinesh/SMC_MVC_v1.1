const mongoose = require("mongoose");

const categoryCoursesSchema = new mongoose.Schema(
  {
  category: { 
    type: String, 
    required: true 
  },
  subCategory1: [String],  
  subCategory2: [String]   
},
  { timestamps: true }
);

const CategoryCourse = mongoose.model("categoryCourse", categoryCoursesSchema);
module.exports = CategoryCourse;