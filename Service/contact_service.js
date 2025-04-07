const Contact = require("../Model/contact_model");

exports.createContact = async (ContactData) => {
  const newContact = new Contact(ContactData);
  return await newContact.save();
};


exports.getAllContacts = async () => {
  return await Contact.find({});
};