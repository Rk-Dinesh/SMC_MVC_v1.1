const { SubCategory1, SubCategory2, CategoryCourse  } = require('../Model/categoryCourses_model');
const fs = require("fs");
const path = require("path");

exports.parseCSVAndBuildCategories1 = (filePath) => {
  return new Promise((resolve, reject) => {
    const csvData = [];

    const stream = fs.createReadStream(filePath, "utf8");

    // Read file line by line
    let data = "";
    stream.on("data", (chunk) => {
      data += chunk;
    });

    stream.on("end", () => {
      try {
        const lines = data.trim().split("\n");
        const headers = lines[0].split(",").map((h) => h.trim());

        // Validate required headers
        if (
          !headers.includes("category") ||
          !headers.includes("subCategory1") ||
          !headers.includes("subCategory2")
        ) {
          return reject(new Error("Missing required headers in CSV."));
        }

        const result = {};

        for (let i = 1; i < lines.length; i++) {
          const values = lines[i].split(",").map((v) => v.trim());
          const row = {};
          headers.forEach((header, index) => {
            row[header] = values[index];
          });

          const { category, subCategory1, subCategory2 } = row;

          if (!result[category]) {
            result[category] = {
              category,
              subCategory1: [],
              subCategory2: [],
            };
          }

          const catObj = result[category];

          // Add subCategory1
          if (subCategory1 && !catObj.subCategory1.includes(subCategory1)) {
            catObj.subCategory1.push(subCategory1);
          }

          // Add nested subCategory2
          if (subCategory1 && subCategory2) {
            let subCatEntry = catObj.subCategory2.find(
              (item) => item.subCategory1 === subCategory1
            );

            if (!subCatEntry) {
              subCatEntry = {
                subCategory1,
                subCategories: [],
              };
              catObj.subCategory2.push(subCatEntry);
            }

            if (!subCatEntry.subCategories.includes(subCategory2)) {
              subCatEntry.subCategories.push(subCategory2);
            }
          }
        }

        const output = Object.values(result);

        // Optional: Save to DB here using Mongoose or other ORM
        resolve(output);
      } catch (error) {
        reject(error);
      } finally {
        // Delete temp file after processing
        fs.unlinkSync(filePath);
      }
    });

    stream.on("error", (err) => {
      reject(err);
    });
  });
};

exports.parseCSVAndBuildCategories = (filePath) => {
  return new Promise(async (resolve, reject) => {
    let data = "";

    const stream = fs.createReadStream(filePath, "utf8");

    // Read file line by line
    stream.on("data", (chunk) => {
      data += chunk;
    });

    stream.on("end", async () => {
      try {
        const lines = data.trim().split("\n");
        const headers = lines[0].split(",").map((h) => h.trim());

        // Validate required headers
        if (
          !headers.includes("category") ||
          !headers.includes("subCategory1") ||
          !headers.includes("subCategory2")
        ) {
          return reject(new Error("Missing required headers in CSV."));
        }

        const result = {};

        for (let i = 1; i < lines.length; i++) {
          const values = lines[i].split(",").map((v) => v.trim());
          const row = {};
          headers.forEach((header, index) => {
            row[header] = values[index];
          });

          const { category, subCategory1, subCategory2 } = row;

          if (!result[category]) {
            result[category] = {
              category,
              subCategory1: [],
              subCategory2: [],
            };
          }

          const catObj = result[category];

          // Add subCategory1
          if (subCategory1 && !catObj.subCategory1.some(sc => sc.name === subCategory1)) {
            catObj.subCategory1.push({ name: subCategory1, subCategories: [] });
          }

          const currentSubCat1 = catObj.subCategory1.find(sc => sc.name === subCategory1);

          // Add subCategory2
          if (subCategory1 && subCategory2 && !currentSubCat1.subCategories.includes(subCategory2)) {
            currentSubCat1.subCategories.push(subCategory2);
          }
        }

        // Now insert into database
        const dbResult = await insertIntoDB(result);

        resolve(dbResult);
      } catch (error) {
        reject(error);
      } finally {
        // Delete temp file after processing
        if (fs.existsSync(filePath)) {
          fs.unlinkSync(filePath);
        }
      }
    });

    stream.on("error", (err) => {
      reject(err);
    });
  });
};

async function insertIntoDB(parsedData) {
  const output = [];

  for (const categoryName in parsedData) {
    const categoryData = parsedData[categoryName];

    // Step 1: Save CategoryCourse
    const categoryDoc = await CategoryCourse.findOneAndUpdate(
      { name: categoryData.category },
      { name: categoryData.category },
      { upsert: true, new: true, setDefaultsOnInsert: true }
    );

    const insertedSubCategory1 = [];

    for (const subCat1 of categoryData.subCategory1) {
      // Step 2: Save SubCategory1
      const subCat1Doc = await SubCategory1.findOneAndUpdate(
        { name: subCat1.name, category: categoryDoc._id },
        { name: subCat1.name, category: categoryDoc._id },
        { upsert: true, new: true, setDefaultsOnInsert: true }
      );

      const insertedSubCategory2 = [];

      for (const subCat2 of subCat1.subCategories) {
        // Step 3: Save SubCategory2
        const subCat2Doc = await SubCategory2.findOneAndUpdate(
          { name: subCat2, subCategory1: subCat1Doc._id },
          { name: subCat2, subCategory1: subCat1Doc._id },
          { upsert: true, new: true, setDefaultsOnInsert: true }
        );

        insertedSubCategory2.push(subCat2Doc);
      }

      insertedSubCategory1.push({
        ...subCat1Doc.toObject(),
        subCategories: insertedSubCategory2,
      });
    }

    output.push({
      ...categoryDoc.toObject(),
      subCategory1: insertedSubCategory1,
    });
  }

  return output;
}

exports.deleteCategoryCourse = async (id) => {
    return await CategoryCourse.findByIdAndDelete(id);
};

exports.getCategoriesCourse = async () => {
    return await CategoryCourse.find();
};