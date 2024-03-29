const User = require("../../database/config/database-config").User;
const { Op } = require("sequelize");
const bcrypt = require("bcrypt");
const Joi = require("@hapi/joi");

const schemaUser = Joi.object({
  name: Joi.string().min(3).max(255).required(),
  lastname: Joi.string().min(3).max(255).required(),
  phone: Joi.string().max(10).required(),
  email: Joi.string().min(3).max(255).required().email(),
  password: Joi.string().min(6).max(1024).required(),
  activo: Joi.boolean().default(1),
});

exports.getUsers = async (req, res) => {
  const pageAsNumber = Number.parseInt(req.query.page);
  const sizeAsNumber = Number.parseInt(req.query.size);

  let page = 0;
  if (!Number.isNaN(pageAsNumber) && pageAsNumber > 0) {
    page = pageAsNumber;
  }

  let size = 10;
  if (
    !Number.isNaN(sizeAsNumber) &&
    !(sizeAsNumber > 10) &&
    !(sizeAsNumber < 1)
  ) {
    size = sizeAsNumber;
  }

  const usersWithCount = await User.findAndCountAll({
    limit: size,
    offset: page * size,
  });
  res.send({
    content: usersWithCount.rows,
    totalPages: Math.ceil(usersWithCount.count / Number.parseInt(size)),
  });
};

exports.createUser = async (req, res) => {
  const { error } = schemaUser.validate(req.body);
  if (error) {
    return res.status(400).json({ error: error.details[0].message });
  }

  const isEmailExist = await User.findOne({
    where: { email: req.body.email },
  });
  if (isEmailExist) {
    return res.status(400).json({ error: "Usuario ya registrado" });
  }

  const salt = await bcrypt.genSalt(10);
  const password = await bcrypt.hash(req.body.password, salt);

  const user = User.create({
    name: req.body.name,
    lastname: req.body.lastname,
    phone: req.body.phone,
    email: req.body.email,
    activo: 1,
    password,
  });
  try {
    const savedUser = await user.save();
    res.json({
      data: savedUser,
    });
  } catch (error) {
    res.status(500).json({ error });
  }
};

exports.getUserById = async (req, res) => {
  let userId = req.params.id;
  User.findOne({ where: { id: userId } }).then((user) => {
    res.json(user);
  });
};

exports.updateUser = async (req, res) => {
  let userId = req.params.id;
  let updateRegister = req.body;

  User.findOne({ where: { id: userId } }).then((user) => {
    user.update(updateRegister).then((updateUser) => {
      res.json(updateUser);
    });
  });
};

exports.deleteUser = async (req, res) => {
  let userId = req.params.id;

  User.destroy({ where: { id: userId } }).then(() => {
    res.send("Usuario eliminado");
  });
};

exports.desactiveUser = async (req, res) => {
  let userId = req.params.id;

  User.findOne({ where: { id: userId } }).then((user) => {
    user.update({ activo: 0 }).then((updateUser) => {
      res.json(updateUser);
    });
  });
};

exports.searchUser = async (req, res) => {
  let { search } = req.query;

  User.findAll({
    where: {
      [Op.or]: {
        id: { [Op.like]: search },
        name: { [Op.like]: search },
        lastname: { [Op.like]: search },
        email: { [Op.like]: search },
      },
    },
  }).then((user) => {
    res.send({ content: user });
  });
};
