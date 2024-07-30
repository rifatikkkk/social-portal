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
    const { id } = req.params;
    const { userId } = req.user;

    try {
      const isValidObjectId = /^[a-fA-F0-9]{24}$/.test(id);
      if (!isValidObjectId) {
        console.error("Invalid ObjectID format:", id);
        return res.status(400).json({ error: "Invalid Id!" });
      }

      const post = await prisma.post.findUnique({
        where: { id },
        include: {
          comments: {
            include: {
              user: true,
            },
          },
          likes: true,
          author: true,
        },
      });

      if (!post) return res.status(404).json({ error: "Post not found!" });

      const postWithLikeInfo = {
        ...post,
        likedByUser: post.likes.some((like) => like.userId === userId),
      };

      res.status(200).json(postWithLikeInfo);
    } catch (error) {
      console.error("Error in Get Post by Id", error);
      res.status(500).json({ error: "Internal server error!" });
    }
  },
  deletePost: async (req, res) => {
    const { id } = req.params;

    const isValidObjectId = /^[a-fA-F0-9]{24}$/.test(id);
    if (!isValidObjectId) {
      console.error("Invalid ObjectID format:", id);
      return res.status(400).json({ error: "Invalid Id!" });
    }

    const post = await prisma.post.findUnique({ where: { id } });

    if (!post) return res.status(404).json({ error: "Post not found!" });

    if (post.authorId != req.user.userId)
      return res.status(403).json({ error: "No access!" });

    try {
      const transaction = await prisma.$transaction([
        prisma.comment.deleteMany({ where: { postId: id } }),
        prisma.like.deleteMany({ where: { postId: id } }),
        prisma.post.delete({ where: { id } }),
      ]);

      res.status(200).json(transaction);
    } catch (error) {
      console.error("Error in Delete Post", error);
      res.status(500).json({ error: "Internal server error!" });
    }
  },
};

module.exports = PostController;
