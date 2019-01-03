const httpStatus = require("http-status");
const Debate = require("../models/debate.model");

//Create debate
exports.create = async (req, res, next) => {
  try {
    let body = req.body;
    const debate = await new Debate(body).save();
    const transformedDebate = debate.transform();
    return res.status(httpStatus.CREATED).send({ message: "Successfully debate created" ,debate:transformedDebate});
  } catch (error) {
    return res.status(httpStatus.INTERNAL_SERVER_ERROR).send({ message: "Please try again" });
  }
};

//Get debate
exports.list = async (req, res, next) => {
  try {
    let count;
    Debate.find({},(err, result) => {
      if (result) {
        count = result.length;
      }
      console.log(result)
      const transformedDebate = result.map(debate => debate.transform());
      res.send({ count, transformedDebate });
    });
  } catch (error) {
    next(error);
  }
};

//Update Debate
exports.update = async (req, res, next) => {
  try {
    let debate = await Debate.findByIdAndUpdate(
      req.params.debateId,
      { $set: req.body },
      { new: true }
    );
    if (debate) {
      debate = debate.transform();
      return res.status(httpStatus.OK).send({ message: "debate updated", debate });
    }
  } catch (err) {
    res.status(httpStatus.INTERNAL_SERVER_ERROR).send(err);
  }
};

//Delete Debate
exports.remove = async (req, res, next) => {
  try {
    let debate = await Post.findByIdAndRemove(req.params.eventId);
    if (debate) {
      return res.status(httpStatus.OK)
        .send({ message: "Debate successfully deleted" });
    }
    return res.status(httpStatus.INTERNAL_SERVER_ERROR).send({ message: "Something went wrong" });
  } catch (error) {
    return res.send(httpStatus.INTERNAL_SERVER_ERROR).send(error);
  }
};

