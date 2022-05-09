import Users from "../models/UserModel.js";
import Posts from "../models/PostModel.js";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import multer from "multer";
import path from "path";
import fse from "fs-extra";



export const getUser = async (req, res) => {
  try {
    const user = await Users.findByPk(req.params.id, {
      attributes: { exclude: ["password"] }
    });
    res.json(user);
  } catch (error) {
    console.log(error);
  }
}

export const getUsers = async (req, res) => {
  try {
    const users = await Users.findAll({});
    res.json(users);
  } catch (error) {
    console.log(error);
  }
}

export const Register = async (req, res) => {
  const { nom, prenom, email, password, confPassword } = req.body;
  if (password !== confPassword) return res.status(400).json({ msg: "Veuillez confirmer le mot de passe" });
  const emailExists = await Users.findOne({ where: { email: req.body.email } });
  if (!emailExists) {
    const salt = await bcrypt.genSalt();
    const hashPassword = await bcrypt.hash(password, salt);
    try {
      await Users.create({
        nom: nom,
        prenom: prenom,
        userImg: "128x128.png",
        email: email,
        password: hashPassword
      });
      res.json({ msg: "Inscription réussie" });
    } catch (error) {
      console.log(error);
    }
  } else {
    return res.status(400).json({ msg: "Cette adresse email existe déjà" });
  }
}

export const Login = async (req, res) => {
  //===== Check if user exists in DB ======
  const { user_email, user_password: clearPassword } = req.body;
  const sql = `SELECT user_firstname, user_lastname, user_password, user_id, active FROM users WHERE user_email=?`;
  const db = dbc.getDB();
  db.query(sql, [user_email], async (err, results) => {
    if (err) {
      return res.status(404).json({ err });
    }

    // ===== Verify password with hash in DB ======
    if (results[0] && results[0].active === 1) {
      try {
        const { user_password: hashedPassword, user_id } = results[0];
        const match = await bcrypt.compare(clearPassword, hashedPassword);
        if (match) {
          // If match, generate JWT token
          const maxAge = 1 * (24 * 60 * 60 * 1000);
          const token = jwt.sign({ user_id }, process.env.JWT_TOKEN, {
            expiresIn: maxAge,
          });

          // remove the password key of the response
          delete results[0].user_password;

          res.cookie("jwt", token);
          res.status(200).json({
            user: results[0],
            token: jwt.sign({ userId: user_id }, process.env.JWT_TOKEN, {
              expiresIn: "24h",
            }),
          });
        }
      } catch (err) {
        console.log(err);
        return res.status(400).json({ err });
      }
    } else if (results[0] && results[0].active === 0) {
      res.status(200).json({
        error: true,
        message: "Votre compte a été désactivé",
      });
    } else if (!results[0]) {
      res.status(200).json({
        error: true,
        message: "Mauvaise combinaison email / mot de passe"
      })
    }
  });
};


export const Logout = async (req, res) => {
  res.clearCookie("jwt");
  res.status(200).json("OUT");
};

export const updateUser = async (req, res) => { }

export const deleteUser = async (req, res) => { }


const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, '../frontend/public/images/profilepictures')
  },
  filename: (req, file, cb) => {
    cb(null, req.body.nom + '-' + req.body.prenom + '_' + Date.now() + path.extname(file.originalname))
  }
})

export const uploadImage = multer({
  storage: storage,
  limits: { fileSize: 1000000 },
  fileFilter: (req, file, cb) => {
    const fileTypes = /jpeg|jpg|png|gif/
    const mimeType = fileTypes.test(file.mimetype)
    const extname = fileTypes.test(path.extname(file.originalname))

    if (mimeType && extname) {
      return cb(null, true)
    }
    cb('Give proper files formate to upload')
  }
}).single('userImg')