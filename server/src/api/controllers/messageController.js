const Message = require("../models/message.model");
const User = require("../models/user.model");
const httpStatus =require("http-status");
const {io,socket} = require('../../config/socket'); 


exports.newMessage = async function(req, res, next) {
    try {
      const sender =req.body._id;
      const recipient = req.params.recipient;
      const message =req.body.message;
      
      let users = await User.findOne({ _id: sender });
      if(!users){
        return res.send({ message: "No such user exists" });
      }
      let reciever = await User.findOne({_id:recipient})
      if(!reciever){
        return res.send({ message: "No such user exists" });
      }
      if (!recipient) {
        res.status(422).send({ error: "Please choose a valid recipient for your message." });
        return next();
      }
      if (!message) {
      res.status(422).send({ error: "Please enter a message." });
      return next();
      }
      const newMessage = await new Message({ to:reciever, from: sender, message:message}).save();
      // io.sockets.emit('new_message',newMessage);
  
      res.status(200).json({message: "Successfully sent"});
      return next();
    } catch (error) {
      return res.send(httpStatus.INTERNAL_SERVER_ERROR).send(error);
    }
  };

  exports.list = async (req, res, next) => {
    try {
      let count;
      Message.find({}, (err, result) => {
        if (result) {
          count = result.length;
        }
        const transformedMessage = result.map(message => message.transform());
        res.send({ count, transformedMessage });
      });
    } catch (error) {
      return res.send(httpStatus.INTERNAL_SERVER_ERROR).send(error);
    }
  };

  exports.listById = async (req, res, next) => {
    try {
      const userId = req.params.userId;
      let message = await Message.findOne({ from: userId });
      if (message) {
        const transformedMessage = message.transform();
        return res.send({ transformedMessage });
      }
    } catch (error) {
      return res.send(httpStatus.INTERNAL_SERVER_ERROR).send(error);
    }
  };

  exports.remove = async (req, res, next) => {
    // const { user } = req.locals;
    try {
      let userId = req.params.userId;
      console.log(userId);
      let updatedMessage = await Message.findOneAndRemove({from:userId});
      if( updatedMessage ) {
        return res.status(httpStatus.OK).send({ message: "Message successfully deleted"} );
      }
      res.status(httpStatus.INTERNAL_SERVER_ERROR).send({ message: "Something went wrong."});
    } catch ( error ) {
      return res.send(httpStatus.INTERNAL_SERVER_ERROR).send(error);
    }
  };


