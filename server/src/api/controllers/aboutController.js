const httpStatus = require("http-status");
const About = require("../models/about.model")

exports.create = async(req,res,next) => {
    try {
        let body = req.body;
        const about = await new About(body).save();
        return res.status(httpStatus.CREATED).send({message: "Thank you for adding information",about});
      } catch (error) {
        return res.status(httpStatus.INTERNAL_SERVER_ERROR).send({ message: "Please try again" });
      }
};

exports.list = async (req, res, next) => {
  try {
    const type = req.params.type;
    const about = await About.find({type});
    if(about){
      return res.send({about});
    }
  } catch (error) {
    res.status(httpStatus.INTERNAL_SERVER_ERROR).send(error);
  }
};

