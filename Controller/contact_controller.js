const ContactService = require("../Service/contact_service");

exports.createContact = async (req, res) => {
  try {
    const { fname, lname, email, phone, msg } = req.body;
    const newContact = await ContactService.createContact({
      fname,
      lname,
      email,
      phone,
      msg,
    });
    res.json({ success: true, message: "Submitted" });
  } catch (error) {
    res.status(500).json({ success: false, message: "Internal server error" });
  }
};

exports.getContacts = async (req, res) => {
  try {
    const contacts = await ContactService.getAllContacts();
    res.json(contacts);
  } catch (error) {
    res.status(500).send("Internal Server Error");
  }
};
