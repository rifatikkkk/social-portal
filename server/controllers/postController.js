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
    const { userId } = req.user;

    try {
      const posts = await prisma.post.findMany({
        include: {
          likes: true,
          author: true,
          comments: true,
        },
        orderBy: { createdAt: "desc" },
      });

      const postWithLikeInfo = posts.map((post) => ({
        ...post,
        likedByUser: post.likes.some((like) => like.userId === userId),
      }));

      res.status(200).json(postWithLikeInfo);
    } catch (error) {
      console.error("Error in Get All posts", error);
      res.status(500).json({ error: "Internal server error!" });
    }
  },
  getPostById: async (req, res) => {
    res.send("get post by id");
  },
  deletePost: async (req, res) => {
    res.send("delete post");
  },
};

module.exports = PostController;
