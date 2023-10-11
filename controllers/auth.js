const bcrypt = require("bcryptjs");
const User = require("../models/user");
const Cart = require("../models/cart");
const crypto = require("crypto");

const transporter = require("../util/mailer");

exports.getLogin = (req, res, next) => {
  let message = req.flash("error");

  if (message.length > 0) {
    message = message[0];
  } else message = null;

  res.render("auth/login", {
    path: "/login",
    pageTitle: "Login",
    errorMessage: message,
  });
};

exports.getSignup = (req, res, next) => {
  let message = req.flash("error");

  if (message.length > 0) {
    message = message[0];
  } else message = null;
  console.log(message);

  res.render("auth/signup", {
    path: "/signup",
    pageTitle: "Signup",
    errorMessage: message,
  });
};

exports.postLogin = (req, res, next) => {
  const email = req.body.email;
  const password = req.body.password;

  process.postgresql
    .query("Select * from users where email = $1", [email])
    .then((rows) => {
      const user = rows[0];

      if (!user) {
        req.flash("error", "Invalid email or password.");
        return res.redirect("/login");
      }

      bcrypt
        .compare(password, user.password)
        .then((doMatch) => {
          if (doMatch) {
            req.session.isLoggedIn = true;
            req.session.user = user;
            return req.session.save((err) => {
              res.redirect("/");
            });
          }
          req.flash("error", "Invalid email or password.");
          res.redirect("/login");
        })
        .catch((err) => {
          console.log(err);
          res.redirect("/login");
        });
    })
    .catch((err) => console.error(err));
};

exports.postSignup = (req, res, next) => {
  User.signUp(req.body)
    .then((rows) => {
      const createdUser = rows[0];
      Cart.createCart(createdUser.id);
      res.redirect("/login");
    })
    .catch((err) => {
      console.log(err);
      req.flash("error", "E-Mail exists already, please pick a different one.");
      res.redirect("/signup");
    });
};

exports.postLogout = (req, res, next) => {
  req.session.destroy((err) => {
    console.log(err);
    res.redirect("/");
  });
};

exports.getReset = (req, res, next) => {
  let message = req.flash("error");

  if (message.length > 0) {
    message = message[0];
  } else message = null;

  res.render("auth/reset", {
    path: "/reset",
    pageTitle: "Reset Password",
    errorMessage: message,
  });
};

exports.postReset = (req, res, next) => {
  crypto.randomBytes(32, (err, buffer) => {
    if (err) {
      console.log(err);
      return res.redirect("/reset");
    }

    const token = buffer.toString("hex");

    User.getUserByEmail(req.body.email).then((rows) => {
      const user = rows[0];

      if (!user) {
        req.flash("error", "No account with that email exists.");
        return res.redirect("/reset");
      }

      const resetTokenExpiration = new Date();
      resetTokenExpiration.setHours(resetTokenExpiration.getHours() + 1);

      User.saveResetToken(
        token,
        resetTokenExpiration.toISOString().slice(0, 19).replace("T", " "),
      ).then(() => {
        res.redirect("/");
        transporter.sendMail({
          to: req.body.email,
          from: "shop@node-complete.com",
          subject: "Password reset",
          html: `
            <p>You requested a password reset</p>
            <p>Click this <a href="http://localhost:3000/reset/${token}">link</a> to set a new password.</p>
          `,
        });
      });
    });
  });
};

exports.getNewPassword = (req, res, next) => {
  const token = req.params.token;
  User.findByToken(token)
    .then((rows) => {
      const user = rows[0];

      let message = req.flash("error");

      if (message.length > 0) {
        message = message[0];
      } else message = null;

      res.render("auth/new-password", {
        path: "/new-password",
        pageTitle: "New Password",
        errorMessage: message,
        userId: user.id,
        passwordToken: token,
      });
    })
    .catch((err) => console.log(err));
};

exports.postNewPassword = (req, res, next) => {
  const newPassword = req.body.password;
  const userId = req.body.userId;
  const passwordToken = req.body.passwordToken;
  let resetUser;

  User.findByTokenAndUserId(passwordToken, userId)
    .then((rows) => {
      resetUser = rows[0];
      return bcrypt.hash(newPassword, 12);
    })
    .then((hashedPassword) => {
      return User.updatePassword(resetUser, hashedPassword);
    })
    .then(() => {
      return res.redirect("/login");
    })
    .catch((err) => console.log(err));
};
