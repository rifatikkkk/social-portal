const { prisma } = require("../prisma/prisma.client");

const PostController = {
  createPost: async (req, res) => {
    const { content } = req.body;

    const authorId = req.user.userId;

    if (!content)
      return res.status(400).json({ error: "All fields is important!" });

    try {
      const post = await prisma.post.create({
        data: {
          content,
          authorId,
        },
      });

      res.status(200).json(post);
    } catch (error) {
      console.error("Error in Create Post", error);
      res.status(500).json({ error: "Internal server error!" });
    }
  },
  getAllPosts: async (req, res) => {
    res.send("get all");
  },
  getPostById: async (req, res) => {
    res.send("get post by id");
  },
  deletePost: async (req, res) => {
    res.send("delete post");
  },
};

module.exports = PostController;
