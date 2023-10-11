const bcrypt = require("bcryptjs");

module.exports = class User {
  static findByToken(token) {
    return process.postgresql.query(
      "Select * from users where reset_token = $1 and reset_token_expiration > CURRENT_DATE",
      [token],
    );
  }

  static findByTokenAndUserId(token, userId) {
    return process.postgresql.query(
      "Select * from users where reset_token = $1 and reset_token_expiration > CURRENT_DATE and id = $2",
      [token, userId],
    );
  }

  static updatePassword(user, newPassword) {
    return process.postgresql.query(
      "Update users set reset_token = NULL, reset_token_expiration = NULL, password = $1 where id = $2",
      [newPassword, user.id],
    );
  }

  static saveResetToken(token, expirationDate) {
    return process.postgresql.query(
      "Update users set reset_token = $1, reset_token_expiration = $2",
      [token, expirationDate],
    );
  }

  static async signUp({ name, email, password, confirmPassword }) {
    const hashedPassword = await bcrypt.hash(password, 12);

    return process.postgresql.query(
      "Insert into users (name, email, password) values ($1, $2, $3) RETURNING *",
      [name, email, hashedPassword],
    );
  }

  static getUserByEmail(email) {
    return process.postgresql.query("Select * from users where email = $1", [
      email,
    ]);
  }
};
