var express = require("express");
const { Prompt } = require("../model/prompt");
var router = express.Router();

/* GET home page. */
router.get("/search-prompt", async function (req, res, next) {
  try {
    let query = {};
    if (req.query.search) {
      query = {
        $text: {
          $search: req.query.search,
        },
      };
    }
    const prompts = await Prompt.find(query).populate("author_id");
    return res.status(200).json({
      message: "Prompt fetched successfully",
      prompts,
    });
  } catch (error) {
    return res.status(500).json({
      message: "Error creating prompt",
      error: error.message,
    });
  }
});

router.get("/get-my-prompt", async function (req, res, next) {
  try {
    let query = { author_id: req.user._id };
    if (req.query.search) {
      query = {
        $and: [
          {
            $text: {
              $search: req.query.search,
            },
          },
          { author_id: req.user._id },
        ],
      };
    }
    const prompts = await Prompt.find(query).populate("author_id");
    return res.status(200).json({
      message: "Prompt fetched successfully",
      prompts,
    });
  } catch (error) {
    return res.status(500).json({
      message: "Error creating prompt",
      error: error.message,
    });
  }
});

router.post("/create-prompt", async function (req, res) {
  try {
    req.body.author_id = req.user._id;
    const prompt = new Prompt(req.body);
    await prompt.save();
    return res.status(201).json({
      message: "Prompt created successfully",
      prompt,
    });
  } catch (error) {
    return res.status(500).json({
      message: "Error creating prompt",
      error: error.message,
    });
  }
});

router.put("/vote-prompt/:id", async function (req, res) {
  try {
    let action = {};

    if (req.query.action && req.query.action == "like") {
      action = {
        $inc: {
          likes: 1,
          totalVotes: 1,
        },
      };
    }

    if (req.query.action && req.query.action == "dislike") {
      action = {
        $inc: {
          totalVotes: 1,
        },
      };
    }
    const prompt = await Prompt.findOneAndUpdate(
      { _id: req.params.id },
      action,
    );
    return res.status(200).json({
      message: "Prompt voted successfully",
      prompt,
    });
  } catch (error) {
    return res.status(500).json({
      message: "Error voting prompt",
      error: error.message,
    });
  }
});

router.get("/get-prompt/:id", async function (req, res, next) {
  try {
    const prompt = await Prompt.findOne({ _id: req.params.id });
    return res.status(200).json({
      message: "Prompt fetched successfully",
      prompt,
    });
  } catch (error) {
    return res.status(500).json({
      message: "Error fetching prompt",
      error: error.message,
    });
  }
});

module.exports = router;
