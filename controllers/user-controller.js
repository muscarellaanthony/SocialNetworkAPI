const { User} = require("../models");
const { ObjectId } = require('mongoose').Types;


module.exports = {
  // get all users
  async getUsers(req, res) {
    try{
      const users = await User.find();
    res.json(users)
    } catch (err) {
      console.log(err);
      return res.status(500).json(err);
    }
  },

  // get single user by id
  async getSingleUser(req, res) {
    try {
    const user = await User.findOne({ _id: req.params.userId });

    if (!user) {
      return res.status(404).json({ message: 'No student matches that ID' })
    }

    res.json(user)
  } catch (err) {
    console.log(err);
    return res.status(500).json(err);
  }
  },

  // create a new user
  async createUser(req, res) {
    try{
      const user = await User.create(req.body)
      res.json(user)
    } catch (err) {
      console.log(err);
      return res.status(500).json(err);
    }
  },

  // update a user
  async updateUser(req, res) {
    try {
      const user = await User.findOneAndUpdate(
        {_id: req.params.userId},
        { $set: req.body},
        { new: true, runValidators: true}
      );
      
      if (!user) {
        return res.status(404).json({ message: 'No such student exists' });
      }
      res.status(200).json(user);
    } catch (err) {
      console.log(err);
      res.status(500).json(err);
    }
  },

  // delete user (BONUS: and delete associated thoughts)
  async deleteUser(req, res) {
    try {
      const user = await User.findOneAndDelete({ _id: req.params.userId });
  
      if (!user) {
        return res.status(404).json({ message: 'No such user exists' });
      }

      const userFriends = await User.findOneAndUpdate(
        { friends: req.params.userId },
        { $pull: { friends: req.params.userId } },
        { new: true, runValidators: true}
      )

      if (!userFriends) {
        return res.status(404).json({
          message: 'User deleted, user had no friends',
        })
      }

    } catch (err) {
      console.log(err);
      return res.status(500).json(err);
    }
  },

  // add friend to friend list
  async addFriend(req, res) {
    try {
      const user = await User.findOneAndUpdate(
        { _id: req.params.userId },
        { $addToSet: { friends: req.body } },
        { new: true, runValidators: true},
      );
  
      if (!user) {
        return res
          .status(404)
          .json({ message: 'No user matches that id' });
      }
  
      res.json(user);
    } catch (err) {
      res.status(500).json(err);
    }
  },

  // remove friend from friend list
  async removeFriend(req, res) {
    try {
      const user = await User.findOneAndUpdate(
        { _id: req.params.userId },
        { $pull: { friends: req.params.friendId } },
        { new: true, runValidators: true},
      );
  
      if (!user) {
        return res
          .status(404)
          .json({ message: 'No user matches that id' });
      }
  
      res.json(user);
    } catch (err) {
      res.status(500).json(err);
    }
  },
}