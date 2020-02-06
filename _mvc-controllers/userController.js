const User = require('./../_mvc-models/userModel');
const catchAsync = require('../utils/catchAsync');
const AppError = require('../utils/appError');
const factory = require('./_handlerFactory');

//create filtered object to filter thru select fields. for filtering allowed updates
const filterObj = (obj, ...allowedFields) => {
  const newObj = {};
  Object.keys(obj).forEach(field => {
    if (allowedFields.includes(field)) newObj[field] = obj[field];
  });
  return newObj;
};

//NOT DEFINED
exports.createUser = (req, res) => {
  res.status(500).json({
    status: 'error',
    message: 'This route is not defined. Please use /signup'
  });
};

//CRUD
exports.getAllUsers = factory.getAll(User);
//
//do NOT update passwords with this one
exports.updateUser = factory.updateOne(User);
exports.getUser = factory.getOne(User);
exports.deleteUser = factory.deleteOne(User);

//SPECIAL
//
//middleware to pass currently logged in user ID to getOne
exports.getMe = (req, res, next) => {
  req.params.id = req.user.id;
  next();
};

exports.updateMe = catchAsync(async (req, res, next) => {
  //create error if user POSTS password data
  if (req.body.password || req.body.passwordConfirm) {
    return next(
      new AppError(
        'This route is not for password updates. Please use /updateMyPassword',
        400
      )
    );
  }

  //update user document
  //only allow select properties to be changed, filter unwanted object fields
  const filteredBody = filterObj(req.body, 'name', 'email');

  //new option will return the new, updated object
  const updatedUser = await User.findByIdAndUpdate(req.user.id, filteredBody, {
    new: true,
    runValidators: true
  });

  res.status(200).json({
    status: 'success',
    data: {
      user: updatedUser
    }
  });
});

exports.deleteMe = catchAsync(async (req, res, next) => {
  await User.findByIdAndUpdate(req.user.id, { active: false });

  res.status(204).json({
    status: 'success',
    data: null
  });
});
