const NotesService = require("../Service/notes_service");
exports.saveNotes = async (req, res) => {
  const { course, notes } = req.body;

  try {
    const result = await NotesService.saveOrUpdateNotes(course, notes);

    res.status(200).json(result);
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, message: "Internal server error" });
  }
};

exports.getNotes = async (req, res) => {
  const { course } = req.body;
  try {
    const result = await NotesService.fetchNotes(course);
    res.json(result);
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, message: "Internal server error" });
  }
};
