const { Thought, User } = require("../models");

module.exports = {
  // get all thoughts
  async getThoughts(req, res) {
    try {
      const thoughts = await Thought.find();
      res.json(thoughts);
    } catch (err) {
      res.status(500).json(err);
    }
  },

  // get single thought by id
  async getSingleThought(req, res) {
    try {
      const thought = await Thought.findOne({ _id: req.params.thoughtId });

      if (!thought) {
        return res.status(404).json({ message: 'No thought matches that id' });
      }

      res.json(thought);
    } catch (err) {
      res.status(500).json(err);
    }
  },

  // create a thought
  async createThought(req, res) {
    try {
      const thought = await Thought.create(req.body);
      res.json(thought);
    } catch (err) {
      console.log(err);
      return res.status(500).json(err);
    }
  },

  // update thought
  async updateThought(req, res) {
    try {
      const thought = await Thought.findOneAndUpdate(
        {_id: req.params.thoughtId},
        { $set: req.body},
        { new: true, runValidators: true}
      );
      
      if (!thought) {
        return res.status(404).json({ message: 'No thought matches that id' });
      }
      res.status(200).json(thought);
    } catch (err) {
      console.log(err);
      res.status(500).json(err);
    }
  },

  // delete thought
  async deleteThought(req, res) {
    try {
      const thought = await Thought.findOneAndDelete({ _id: req.params.thoughtId });

      if (!thought) {
        res.status(404).json({ message: 'No thought matches that id' });
      }

      await User.findOneAndUpdate(
        { _id: req.params.userId },
        {$pull: {thoughts: {thoughtId: req.params.thoughtId}}},
        {new: true, runValidators: true}
    );
      res.json({ message: 'Thought Deleted' });
    } catch (err) {
      res.status(500).json(err);
    }
  },

  // add a reaction to a thought
  async addReaction(req, res) {
    try {
      const thought = await Thought.findOneAndUpdate(
        { _id: req.params.thoughtId },
        { $addToSet: { reactions: req.body } },
        { new: true, runValidators: true}
      );
      
      if (!thought) {
        return res.status(404).json({ message: 'No thought matches that id' });
      }
      res.status(200).json({message: 'Reaction Added.'});
    } catch (err) {
      console.log(err);
      res.status(500).json(err);
    }
  },

  // remove reaction from a thought
  async removeReaction(req, res) {
    try {
      const thought = await Thought.findOneAndUpdate(
        { _id: req.params.thoughtId },
        { $pull: { reactions: {_id: req.params.reactionId}}},
        { new: true, runValidators: true},
      );
  
      if (!thought) {
        res.status(404).json({ message: 'No thought matches that id' });
      }
  
      res.json({ message: 'Reaction Removed' });
    } catch (err) {
      res.status(500).json(err);
    }
  },
};