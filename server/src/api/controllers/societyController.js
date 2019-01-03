const httpStatus = require("http-status");
const Lounge = require("../models/lounge.model");
const Event = require("../models/events.model");

//Get Lounge
exports.listLounges = async (req, res, next) => {
  try {
    Lounge.find({}, (err, result) => {
      if (result) {
        count = result.length;
      }
      const transformedLounge = result.map(lounge => lounge.transform());
      res.send({ transformedLounge });
    });
  } catch (error) {
    res.status(httpStatus.INTERNAL_SERVER_ERROR).send(error);
  }
};

//Get Events
exports.listEvents = async (req, res, next) => {
  try {
    const event = await Event.find({}).sort("-createdAt").populate({ path: "profile", select: "nickName class city" });
    if (event) {
      return res.send({ event });
    }
  } catch (error) {
    res.status(httpStatus.INTERNAL_SERVER_ERROR).send(error);
  }
};
