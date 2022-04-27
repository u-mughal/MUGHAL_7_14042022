/* Import des modules necessaires */
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const dotenv = require("dotenv").config({ encoding: "latin1" });

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