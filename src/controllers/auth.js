const { user } = require("../../models");
const Joi = require("joi");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

exports.register = async (req, res) => {

  const schema = Joi.object({
    fullName: Joi.string().min(5).required(),
    email: Joi.string().email().min(6).required(),
    password: Joi.string().min(6).required(),
    role: Joi.string().min(5).required(),
  });

  const { error } = schema.validate(req.body);

  if (error)
    return res.status(400).send({
      error: {
        message: error.details[0].message,
      },
    });

    const emailExist = await user.findOne({
      where: {
        email : req.body.email,
      },
    });

    if (emailExist) {
      return res.send({
        status: "Failed",
        message: "Email Already Registered",
      });
    }

  try {
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(req.body.password, salt);

    const newUser = await user.create({
      fullName: req.body.fullName,
      email: req.body.email,
      password: hashedPassword,
      role: req.body.role,
    });

    const token = jwt.sign({ id: user.id }, process.env.TOKEN_KEY);
    
    res.status(200).send({
      status: "success",
      data: {
        user :{
          email: newUser.email,
          token
        }
      },
    });
  } catch (error) {
    console.log(error);
    res.status(500).send({
      status: "failed",
      message: "Server Error",
    });
  }
};

exports.login = async (req, res) => {
  const schema = Joi.object({
    email: Joi.string().email().min(6).required(),
    password: Joi.string().min(6).required(),
  });

  const { error } = schema.validate(req.body);

  if (error)
    return res.status(400).send({
      error: {
        message: error.details[0].message,
      },
    });

  try {
    const userExist = await user.findOne({
      where: {
        email: req.body.email,
      },
      attributes: {
        exclude: ["createdAt", "updatedAt"],
      },
    });

    const isValid = await bcrypt.compare(req.body.password, userExist.password);

    if (!isValid) {
      return res.status(400).send({
        status: "failed",
        message: "data invalid",
      });
    }


    const token = jwt.sign({ id: userExist.id }, process.env.TOKEN_KEY);

    res.status(200).send({
      status: "success",
      data:  {
        user : {
          id: userExist.id,
          email: userExist.email,
          fullName: userExist.fullName,
          role: userExist.role,
          status: userExist.status,
          gender: userExist.gender,
          phone: userExist.phone,
          address: userExist.address,
          image: process.env.FILE_PATH +userExist.image,
          token,
        }
      },
    });
  } catch (error) {
    console.log(error);
    res.status(500).send({
      status: "failed",
      message: "Server Error",
    });
  }
};

exports.checkAuth = async (req, res) => {
  try {
    const id = req.user.id;

    const dataUser = await user.findOne({
      where: {
        id,
      },
      attributes: {
        exclude: ["createdAt", "updatedAt", "password"],
      },
    });

    if (!dataUser) {
      return res.status(404).send({
        status: "failed",
      });
    }

    res.send({
      status: "success...",
      data: {
        user: {
          id: dataUser.id,
          fullName: dataUser.fullName,
          email: dataUser.email,
          gender: dataUser.gender,
          phone: dataUser.phone,
          address: dataUser.address,
          role: dataUser.role,
          image: process.env.FILE_PATH +dataUser.image,
        },
      },
    });
  } catch (error) {
    console.log(error);
    res.status({
      status: "failed",
      message: "Server Error",
    });
  }
};