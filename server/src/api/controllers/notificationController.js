const httpStatus = require("http-status");
const Notification = require("../models/notification.model");
const {io,socket} = require('../../config/socket'); 

//Add Notification
exports.create = async (req, res, next) => {
  try {
    let body = req.body;
    const notification = await new Notification(body).save();
    const transformedNotification = notification.transform();
    return res.status(httpStatus.CREATED).send({message: "Successfully Notification Created",debate: transformedNotification});
     }catch (error) {
    return res.status(httpStatus.INTERNAL_SERVER_ERROR).send({ message: "Please try again", error });
  }
};

//Get Notification By userId
exports.listById = async (req, res, next) => {
  try {
    const userId = req.params.userId;
    const notification = await Notification.find({ to: userId }).sort("-createdAt");
    if(notification){
        const total = await Notification.find({ to: userId }).countDocuments();
        // io.sockets.emit('notification', {notification: notification});
        return res.status(httpStatus.CREATED).send({ notification, total }); 
    }
    }catch (error) {
    return res.status(httpStatus.INTERNAL_SERVER_ERROR).send({ message: "Please try again", error });
  }
};

//Update notification status
exports.update = async (req,res,next) => {
  try{
  var id = req.params.notificationId;
  const notification = await Notification.findByIdAndUpdate({_id:id},{seen:true});
  console.log(notification)
  if (notification) {
    return res.status(httpStatus.OK).send({ message: "Notification updated" ,notification});
  }
} catch (error) {
  res.status(httpStatus.INTERNAL_SERVER_ERROR).send(error);
}
}


//Remove Notification
exports.remove = async (req, res, next) => {
  try {
    let notification = await Notification.findByIdAndRemove(req.params.notificationId);
    if (notification) {
      return res.status(httpStatus.OK).send({ message: "Notification successfully deleted" });
    }
    return res.status(httpStatus.INTERNAL_SERVER_ERROR).send({ message: "Something went wrong" });
  } catch (error) {
    return res.status(httpStatus.INTERNAL_SERVER_ERROR).send({ message: "Something went wrong" }, error);
  }
};

// Remove all by userID
exports.removeAll = async (req, res, next) => {
  try {
    let notification = await Notification.findOneAndRemove(req.params.userId);
    if (notification) {
     res.status(httpStatus.OK).send({ message: "All Notification successfully deleted" });
    }
     res.status(httpStatus.INTERNAL_SERVER_ERROR).send({ message: "Something went wrong" });
    }catch (error) {
    return res.send(httpStatus.INTERNAL_SERVER_ERROR).send(error);
  }
};
