const Notes = require("../Model/notes_model");

exports.saveOrUpdateNotes = async (course, notes) => {
  try {
    const existingNotes = await Notes.findOne({ course });

    if (existingNotes) {
      await NotesSchema.findOneAndUpdate({ course: course }, { $set: { notes : notes } });
      return { success: true, message: "Notes updated successfully" };
    } else {
      const newNotes = new Notes({ course, notes });
      await newNotes.save();
      return { success: true, message: "Notes created successfully" };
    }
  } catch (error) {
    console.error(error);
    throw new Error("Error saving or updating notes");
  }
};

exports.fetchNotes = async (course) => {
    try {
        const existingNotes = await Notes.findOne({ course: course });

        if (existingNotes) {
            return { success: true, message: existingNotes.notes };
        } else {
            return { success: false, message: '' };
        }
    } catch (error) {
        console.error(error);
        throw new Error('Error fetching notes');
    }
};