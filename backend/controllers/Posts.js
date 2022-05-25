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



export const getAllPosts = async (req, res) => { }


export const publishPost = async (req, res) => { }

export const deletePost = async (req, res) => { }