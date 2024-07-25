const mongoose = require("mongoose");
const validator = require("validator");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

const userSchema = new mongoose.Schema(
  {
    name: { type: String, required: true, trim: true },
    email: {
      type: String,
      unique: true,
      required: true,
      trim: true,
      lowercase: true,
      validate(value) {
        if (!validator.isEmail(value)) {
          throw new Error("Invalid Email");
        }
      },
    },
    password: {
      type: String,
      required: true,
      minlength: 7,
      trim: true,
      validate(value) {
        if (value.toLowerCase().includes("password")) {
          throw new Error("Password cannot contain the word password!");
        }
      },
    },

    otp: { type: String },

    verified: { type: Boolean, default: false },

    tokens: [
      {
        token: {
          type: String,
          required: true,
        },
      },
    ],
  },
  {
    timestamps: true,
  }
);

userSchema.methods.generateAuthToken = async function () {
  const user = this;
  const token = jwt.sign({ _id: user._id.toString() }, process.env.JWT_SECRET, {
    expiresIn: "7 days",
  });
  user.tokens = user.tokens.concat({ token });
  user.save();
  return token;
};

userSchema.methods.generateOTP = async function () {
  const user = this;
  const length = 6;
  const digits = "123456789";
  const letters = "ABCDEFGHIJKLMNPQRSTUVWXYZ";
  const characters = digits + letters;

  let otp = "";
  // Ensure at least one digit
  otp += digits[Math.floor(Math.random() * digits.length)];
  // Ensure at least one letter
  otp += letters[Math.floor(Math.random() * letters.length)];

  for (let i = 2; i < length; i++) {
    const randomIndex = Math.floor(Math.random() * characters.length);
    otp += characters[randomIndex];
  }

  // Shuffle the OTP to randomize the order
  otp = otp
    .split("")
    .sort(() => 0.5 - Math.random())
    .join("");
  return otp;
};

userSchema.methods.toJSON = function () {
  const user = this;
  const userObject = user.toObject();
  delete userObject.password;
  delete userObject.tokens;
  delete userObject.avatar;
  return userObject;
};

userSchema.statics.findByCredentials = async (email, password) => {
  const user = await User.findOne({ email: email.toLowerCase() });

  if (!user) {
    throw new Error("Invalid Credentials");
  }

  const isMatch = await bcrypt.compare(password, user.password);

  if (!isMatch) {
    throw new Error("Invalid Credentials");
  }

  return user;
};

userSchema.pre("save", async function (next) {
  const user = this;
  if (user.isModified("password")) {
    user.password = await bcrypt.hash(user.password, 8);
  }
  next();
});

const User = mongoose.model("User", userSchema);

module.exports = User;
