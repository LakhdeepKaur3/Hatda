const httpStatus = require("http-status");
const Lounge = require("../models/lounge.model");

//Create Lounge
exports.create = async (req, res, next) => {
  try {
    let body = req.body;
    const lounge = await new Lounge(body).save();
    const transformedLounge = lounge.transform();
    return res.status(httpStatus.CREATED).send({message: "Successfully event created",event: transformedLounge});
  } catch (error) {
    return res.status(httpStatus.INTERNAL_SERVER_ERROR).send({ message: "Please try again" });
  }
};

//Get Lounge
exports.list = async (req, res, next) => {
  try {
    let count;
    Lounge.find({}, (err, result) => {
      if (result) {
        count = result.length;
      }
      const transformedLounge = result.map(event => event.transform());
      res.send({ count, transformedLounge });
    });
  } catch (error) {
    next(error);
  }
};

//Update Lounge
exports.update = async (req, res, next) => {
  try {
    if (req.body.members) {
      let lounge = await Lounge.findOneAndUpdate(req.params.adminId,{ $addToSet: { members: req.body.members } },{ new: true });
      if (lounge) {
        lounge = lounge.transform();
        return res.status(httpStatus.OK).send({ message: "Member added successfully", lounge });
      }
    } else {
      let lounge = await Lounge.findOneAndUpdate(req.params.adminId,{ $set: req.body },{ new: true });
      if (lounge) {
        lounge = lounge.transform();
        return res.status(httpStatus.OK).send({ message: "Lounge updated successfully", lounge });
      }
    }
  } catch (err) {
    res.status(httpStatus.INTERNAL_SERVER_ERROR).send(err);
  }
};

//Delete Lounge
exports.remove = async (req, res, next) => {
  try {
    let lounge = await Lounge.findOneAndRemove(req.params.adminId);
    if (lounge) {
      return res.status(httpStatus.OK).send({ message: "Lounge successfully deleted" });
    }
    return res.status(httpStatus.INTERNAL_SERVER_ERROR).send({ message: "Something went wrong" });
  } catch (error) {
    return res.send(httpStatus.INTERNAL_SERVER_ERROR).send(error);
  }
};
