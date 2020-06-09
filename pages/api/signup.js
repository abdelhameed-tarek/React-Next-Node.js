import connectDb from "../../utils/connectDb";
import User from "../../models/User";
import Cart from "../../models/Cart";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import isEmail from "validator/lib/isEmail";
import isLength from "validator/lib/isLength";

connectDb();

export default async (req, res) => {
  const { name, email, password } = req.body;
  try {
    if (!isLength(name, { min: 3, max: 10 })) {
      return res.status(422).send("Name must be 3-10 characters long");
    } else if (!isLength(password, { min: 6 })) {
      return res.status(422).send("Password must be at least 6 characters");
    } else if (!isEmail(email)) {
      return res.status(422).send("Email must be valid");
    }
    //1-check if user existing in DB
    const user = await User.findOne({ email });
    if (user) {
      return res.status(422).send(`User Already Exists with email ${email}`);
    }
    //2-hash Password
    const hash = await bcrypt.hash(password, 10);
    //3-save User
    const newUser = await new User({
      name,
      email,
      password: hash,
    }).save();
    await new Cart({ user: newUser._id }).save();
    //4-generate token for the newUser
    const token = jwt.sign({ userId: newUser._id }, process.env.JWT_SECRET, {
      expiresIn: "7d",
    });
    res.status(201).json(token);
  } catch (error) {
    console.error(error);
    res
      .status(500)
      .json("Server Error For Signup New User, Please try again later");
  }
};
