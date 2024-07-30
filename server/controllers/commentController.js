const { prisma } = require("../prisma/prisma.client");

const CommentController = {
  createComment: async (req, res) => {
    const { postId, content } = req.body;
    const { userId } = req.user;

    if (!postId || !content)
      return res.status(400).json({ error: "All fields is important!" });

    try {
      const comment = await prisma.comment.create({
        data: {
          postId,
          userId,
          content,
        },
      });

      res.status(200).json(comment);
    } catch (error) {
      console.error("Error in Create Comment", error);
      res.status(500).json({ error: "Internal server error!" });
    }
  },
  deleteComment: async (req, res) => {
    res.send("delete");
  },
};

module.exports = CommentController;
