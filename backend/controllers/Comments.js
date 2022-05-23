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


export const getComByPost = async (req, res) => { }



export const publishComment = async (req, res) => { }


export const deleteComment = async (req, res) => { }