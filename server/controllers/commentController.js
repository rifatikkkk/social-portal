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
    const { id } = req.params;
    const { userId } = req.user;

    try {
      const isValidObjectId = /^[a-fA-F0-9]{24}$/.test(id);
      if (!isValidObjectId) {
        console.error("Invalid ObjectID format:", id);
        return res.status(400).json({ error: "Invalid Id!" });
      }
      const comment = await prisma.comment.findUnique({ where: { id } });

      if (!comment)
        return res.status(404).json({ error: "Comment not found!" });

      if (comment.userId !== userId)
        return res.status(403).json({ error: "No access!" });

      await prisma.comment.delete({ where: { id } });

      res.status(200).json(comment);
    } catch (error) {
      console.error("Error in Delete Comment", error);
      res.status(500).json({ error: "Internal server error!" });
    }
  },
};

module.exports = CommentController;
