const express = require("express");
const dotenv = require("dotenv").config();
const auth = require("../middleware/auth");

const router = new express.Router();

const OpenAI = require("openai");
const openai = new OpenAI({
  apiKey: process.env.API_KEY,
  baseURL: process.env.BASE_URL,
});

const model = process.env.MODEL;

router.post("/chat", auth, async (req, res) => {
  const { messages } = req.body;
  if (req.user.verified === true) {
    try {
      const completion = await openai.chat.completions.create({
        model: model,
        messages: messages,
        temperature: 0.5,
        top_p: 1,
        max_tokens: 1024,
        stream: false,
      });

      const responseMessage = completion.choices[0]?.message;
      res.json(responseMessage);
    } catch (error) {
      res.status(500).send("Error in OpenAI API request");
    }
  } else {
    res.status(401).send("User not verified");
  }
});

module.exports = router;
