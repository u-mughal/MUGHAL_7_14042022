import Comments from "../models/CommentModel.js"
import Posts from "../models/PostModel.js";
import Users from "../models/UserModel.js";

export const getComByUser = async (req, res) => {
    try {
        const comments = await Comments.findAll({
            where: { userId: req.params.id }
        });
        res.json(comments);
    } catch (error) {
        res.json({ msg: error.msg });
    }
}


export const getComByPost = async (req, res) => {
    try {
        const comments = await Comments.findAll({
            include: [{ model: Users }],
            where: { PostId: req.params.id },
            order: [['createdAt', 'desc']]
        });
        res.json(comments);
    } catch (error) {
        res.json({ msg: error.msg });
    }
}



export const publishComment = async (req, res) => { }


export const deleteComment = async (req, res) => { }