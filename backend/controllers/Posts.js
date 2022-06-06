import Posts from "../models/PostModel.js";
import Users from "../models/UserModel.js";
import Comments from "../models/CommentModel.js";

export const getAPost = async (req, res) => {
    try {
        const posts = await Posts.findAll({
            include: [{ model: Users }],
            where: { id: req.params.id }
        });
        res.json(posts);
    } catch (error) {
        res.json({ msg: error.msg });
    }
}


export const getMyPosts = async (req, res) => {
    try {
        const posts = await Posts.findAll({
            include: [{ model: Users }, { model: Comments }],
            where: { userId: req.params.id }
        });
        res.json(posts);
    } catch (error) {
        res.json({ msg: error.msg });
    }
}


export const getAllPosts = async (req, res) => {
    try {
        const posts = await Posts.findAll({
            include: [{ model: Users }, { model: Comments }],
            order: [['createdAt', 'desc']]
        });
        res.json(posts);
    } catch (error) {
        res.json({ msg: error.msg });
    }
}


export const publishPost = async (req, res) => {
    const refreshToken = req.cookies.refreshToken;

    try {
        const user = await Users.findAll({
            where: { refresh_token: refreshToken }
        });
        const userId = user[0].id;
        const post = {
            ...req.body,
            userId: userId
        };
        await Posts.create(post);
        res.json({ msg: "Publication postée avec succès!" });
    } catch (error) {
        res.json({ msg: error.msg });
    }
}

export const deletePost = async (req, res) => {
    try {
        const postId = req.params.id;
        await Posts.destroy({
            where: {
                id: postId
            }
        });
        res.json({ msg: "Publication supprimée avec succès!" });
    } catch (error) {
        res.json({ msg: error.msg });
    }
}