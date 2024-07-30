const { prisma } = require("../prisma/prisma.client");

const LikeController = {
  likePost: async (req, res) => {
    const { postId } = req.body;
    const { userId } = req.user;

    if (!postId)
      return res.status(400).json({ error: "All fields is important!" });

    try {
      const existingLike = await prisma.like.findFirst({
        where: { postId, userId },
      });

      if (existingLike)
        return res
          .status(400)
          .json({ error: "You are already liked this post!" });

      const like = await prisma.like.create({
        data: { postId, userId },
      });

      res.status(201).json(like);
    } catch (error) {
      console.error("Error in Like Post", error);
      res.status(500).json({ error: "Internal server error!" });
    }
  },
  unlikePost: async (req, res) => {
    const { id } = req.params;
    const { userId } = req.user;

    try {
      const isValidObjectId = /^[a-fA-F0-9]{24}$/.test(id);
      if (!isValidObjectId) {
        console.error("Invalid ObjectID format:", id);
        return res.status(400).json({ error: "Invalid Id!" });
      }
      const post = await prisma.post.findUnique({ where: { id } });
      if (!post) return res.status(404).json({ error: "Post not found!" });

      const existingLike = await prisma.like.findFirst({
        where: { postId: id, userId },
      });

      if (!existingLike)
        return res.status(400).json({ error: "Unlike already exist!" });

      const like = await prisma.like.deleteMany({
        where: { postId: id, userId },
      });

      res.status(200).json(like);
    } catch (error) {
      console.error("Error in Unlike Post", error);
      res.status(500).json({ error: "Internal server error!" });
    }
  },
};

module.exports = LikeController;
