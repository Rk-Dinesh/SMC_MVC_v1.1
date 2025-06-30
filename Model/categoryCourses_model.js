const mongoose = require("mongoose");

// Top-level categories
const categoryCourseSchema = new mongoose.Schema({
  name: { type: String, required: true, unique: true }
});

// First-level subcategories
const subCategory1Schema = new mongoose.Schema({
  name: { type: String, required: true },
  category: { type: mongoose.Schema.Types.ObjectId, ref: 'Category', required: true }
});

// Second-level subcategories
const subCategory2Schema = new mongoose.Schema({
  name: { type: String, required: true },
  subCategory1: { type: mongoose.Schema.Types.ObjectId, ref: 'SubCategory1', required: true }
});

const CategoryCourse = mongoose.model('CategoryCourse', categoryCourseSchema);
const SubCategory1 = mongoose.model('SubCategory1', subCategory1Schema);
const SubCategory2 = mongoose.model('SubCategory2', subCategory2Schema);

module.exports = { CategoryCourse, SubCategory1, SubCategory2 };
