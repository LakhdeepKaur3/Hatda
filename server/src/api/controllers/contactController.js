const httpStatus = require("http-status");
const Contact = require("../models/contact.model");

exports.contact = async (req, res, next) => {
  try {
    let body = req.body;
    const contact = await new Contact(body).save();
    return res.status(httpStatus.CREATED).send({message: "Thank you for contacting.We will get back to you soon"});
  } catch (error) {
    return res.status(httpStatus.INTERNAL_SERVER_ERROR).send({ message: "Please try again" });
  }
};
