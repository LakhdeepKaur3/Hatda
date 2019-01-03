const httpStatus = require("http-status");
const Post = require("../models/post.model");
const Like = require("../models/like.model");
const User = require("../models/user.model");


//Create new Post
exports.create = async (req, res, next) => {
  try {
    let body = req.body;
    const post = await new Post(body).save();
    const transformedPosts = post.transform();
    res.status(httpStatus.CREATED);
    res.json(transformedPosts);
  } catch (err) {
    res.status(httpStatus.INTERNAL_SERVER_ERROR).send(err);
  }
};

//Get All Post
exports.list = async (req, res, next) => {
  try {
    let count;
    Post.find({}, (err, result) => {
      if (result) {
        count = result.length;
      }
      const transformedPosts = result.map(post => post.transform());
      res.send({ count, transformedPosts });
    });
  } catch (error) {
    res.status(httpStatus.INTERNAL_SERVER_ERROR).send(err);
  }
};

//Get Post By userId
exports.listById = async (req, res, next) => {
  try {
    const userId = req.params.userId;
    const post = await Post.find({userId}).sort('-createdAt').populate({path:'userId',select:'realName'});
    console.log(post);
    if (post) {
    //   const transformedPosts = post.transform();
      return res.send({ post });
    }
  } catch (err) {
    res.status(httpStatus.INTERNAL_SERVER_ERROR).send(err);
  }
};

//Update Post
exports.update = async (req, res, next) => {
  try {
    let post = await Post.findByIdAndUpdate(
      req.params.postId,
      { $set: req.body },
      { new: true }
    );
    if (post) {
      post = post.transform();
      return res.status(httpStatus.OK).send({ message: "post updated", post });
    }
  } catch (err) {
    res.status(httpStatus.INTERNAL_SERVER_ERROR).send(err);
  }
};

//Delete Post
exports.remove = async (req, res, next) => {
  try {
    let post = await Post.findByIdAndRemove(req.params.postId);
    if (post) {
      return res.status(httpStatus.OK).send({ message: "Post successfully deleted" });
    }
    return res.status(httpStatus.INTERNAL_SERVER_ERROR).send({ message: "Something went wrong" });
  } catch (error) {
    return res.send(httpStatus.INTERNAL_SERVER_ERROR).send(error);
  }
};

exports.like = async (req, res, next) => {
  try {
    const action =req.params.action;
    const { userId } = req.body;
    const postId = req.params.postId;
    let users = await User.findOne({ _id: userId });
    if (!users) {
      return res.send({ message: "No such user exists" });
    }
    let posts = await Post.findOne({ _id: postId });
    if (!posts) {
      return res.send({ message: "No such post exists" });
    }
    if (action == 'Like') {
      let like =await Like.findOne({postId:postId});
      if(like){
       let like =await Like.update( { postId: postId },{ $addToSet: { likeBy: userId } } )
      }else{
       let like = await new Like({likeBy: [req.body.userId], postId:postId}).save();
     }  
      let likeExists = false;
      posts.likes.forEach(element => {
      if(element == userId){
       likeExists = true;
     }      
     });  
     console.log(likeExists)
     if(likeExists){
       return res.status(httpStatus.FORBIDDEN).send({message:'User already liked',likes:posts.likesCount}); 
     }
     if(posts.likesCount>0 || posts.likesCount==0) {
      let post = await Post.findOneAndUpdate({ _id: postId },{ $inc: { likesCount: 1 } },{ new: true } );
      let newPost = await Post.update( { _id: postId },{ $addToSet: { likes: userId } } );
      return res.send({ message: "Updated successfully", likes: post.likesCount });
    }   
  }else{
        let post = await Post.findOneAndUpdate({ _id: postId }, { $inc: { likesCount: -1 } } );
        let newPost = await Post.update({ _id: postId },{ $pull: { likes: userId } } );
        let like =await Like.findOne({postId:postId});
        if(like){
        let like = await Like.update({postId:postId},{ $pull: { likeBy: userId } });
        }
        res.status(httpStatus.OK).send({message:'Disliked',likes:post.likesCount})
      }
  } 
  catch (error) {
    res.status(httpStatus.INTERNAL_SERVER_ERROR).send(error);
  }
};

