/* Import des modules necessaires */
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const dotenv = require("dotenv").config({ encoding: "latin1" });
import multer from "multer";


/* Controleur inscription */
exports.signup = (req, res, next) => {
  // Hashage du mot de passe utilisateur
  bcrypt
    .hash(req.body.password, parseInt(process.env.BRYPT_SALT_ROUND))
    .then((hash) => {
      const user = new User({
        email: req.body.email,
        password: hash,
      });
      // Creation de l'utilisateur
      user
        .save()
        .then(() => res.status(201).json({ message: "Utilisateur créé !" }))
        .catch((error) => res.status(400).json({ error }));
    })
    .catch((error) => res.status(500).json({ error }));
};

/* Controleur login */
exports.login = (req, res, next) => {
  // Verification utilisateur existant
  User.findOne({ email: req.body.email })
    .then((user) => {
      if (!user) {
        return res.status(401).json({ error: "Utilisateur non trouvé !" });
      }
      // Verification mot de passe utilisateur
      bcrypt
        .compare(req.body.password, user.password)
        .then((valid) => {
          if (!valid) {
            return res.status(401).json({ error: "Mot de passe incorrect !" });
          }
          // Connection valide = token 24H
          res.status(200).json({
            userId: user._id,
            token: jwt.sign({ userId: user._id }, process.env.SECRET_KEY, {
              expiresIn: "24h",
            }),
          });
        })
        .catch((error) => res.status(500).json({ error }));
    })
    .catch((error) => res.status(500).json({ error }));
};


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