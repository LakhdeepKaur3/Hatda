const httpStatus = require("http-status");
const Event = require("../models/events.model");

//Create Event
exports.create = async (req, res, next) => {
  try {
    let body = req.body;
    console.log(body);
    const event = await new Event(body).save();
    return res.status(httpStatus.CREATED).send({message: "Successfully event created" });
  } catch (error) {
    return res.status(httpStatus.INTERNAL_SERVER_ERROR).send({ message: "Please try again" ,error});
  }
};

//Get Event
exports.list = async (req, res, next) => {
  try {
    let count;
    Event.find({}, (err, result) => {
      if (result) {
        count = result.length;
      }
      const transformedEvents = result.map(event => event.transform());
      res.send({ count, transformedEvents });
    });
  } catch (error) {
    next(error);
  }
};

//Update Event
exports.update = async (req, res, next) => {
  try {
    let event = await Event.findByIdAndUpdate(
      req.params.eventId,
      { $set: req.body },
      { new: true }
    );
    if (event.members > 0) {
      console.log("members exist");
    }
    if (event) {
      event = event.transform();
      return res.status(httpStatus.OK).send({ message: "event updated", event });
    }
  } catch (err) {
    res.status(httpStatus.INTERNAL_SERVER_ERROR).send(err);
  }
};

//Delete Event
exports.remove = async (req, res, next) => {
  try {
    let event = await Event.findByIdAndRemove(req.params.eventId);
    if (event) {
      return res.status(httpStatus.OK).send({ message: "Event successfully deleted" });
    }
    return res
      .status(httpStatus.INTERNAL_SERVER_ERROR)
      .send({ message: "Something went wrong" });
  } catch (error) {
    return res.status(httpStatus.INTERNAL_SERVER_ERROR).send(error);
  }
};
