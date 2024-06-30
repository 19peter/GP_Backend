const ServiceProviderModel = require("../Models/ServiceProviderModel");
const UserModel = require("../Models/UserModel");

let getHistory = async (req,res)=>{
  
  let {consumerId} = req.body;
  console.log(consumerId)
  let {history} = await UserModel.findOne({_id:consumerId})
  if(history)
    return res.json(history).status(200)
  return res.json("user not found").status(400)
}
let insertHistory = async(req,res)=>{
  let {providerId,serviceName,servicePrice} = req.body;
  let {consumerId} = req.params;
  let {name} = await ServiceProviderModel.findOne({_id:providerId})
  let consumer = await UserModel.findOneAndUpdate({_id:consumerId},{$push:{history:{providerId,serviceName,servicePrice,providerName:name}}},{new:true})
  console.log(consumer);
  if(consumer)
    return res.json(consumer).status(200)
  return res.status(400).json("consumer not found")
}
let getCount = async (req, res) => {
  let usersCount = await UserModel.countDocuments({});
  return res.json(usersCount).status(200);
};

let getUserInfo = async (req, res) => {
    
  const {userId} = req.body;
  console.log(req.body);

  let userInfo = await UserModel.findOne({ _id: userId });
  if (!userInfo) {
    return res.status(404).json("User Not Found");
  }

  return res.status(200).json({ userInfo });
};

let getUser = async (req, res) => {
  let id = req.params.id;
  let user = await UserModel.findOne({ _id: id });
  if (!user) {
    return res.status(404).json("User Not Found");
  }

  return res.status(200).json({ user });
};

let createUser = async (req, res) => {
  let data = req.body;
  let { car_make, model, year } = data;
  let owned_cars = [];
  let newUser;

  let duplicateEmail = await UserModel.findOne({ email: data.email });

  if (duplicateEmail) {
    return res.status(400).json("Bad Request, Email is already registered");
  }
  const keysToRemove = ["car_make", "model", "year"];

  let sanitizedUser = Object.keys(data).reduce((acc, key) => {
    if (!keysToRemove.includes(key)) {
      acc[key] = data[key];
    }
    return acc;
  }, {});

  if (car_make && model && year) {
    owned_cars.push({ make: car_make, model, year });
  }

  sanitizedUser.owned_cars = owned_cars;

  try {
    newUser = new UserModel(sanitizedUser);
  } catch (e) {
    console.log(e);
  }

  newUser
    .save()
    .then(() => {
      return res.json({ newUser }).status(200);
    })
    .catch((e) => {
      console.log(e);
    });
};

let updateUser = async (req, res) => {
  let data = req.body;
  let id = req.params.id;

  try {
    let updatedUser = await UserModel.findByIdAndUpdate({ _id: id }, data, {
      new: true,
      runValidators: true, // Ensures validators are run during update
    });

    if (!updatedUser) {
      return res.status(404).json("User not found");
    }

    return res.status(200).json({ updatedUser });
  } catch (e) {
    console.log(e);
  }
};

let updateUserCars = async (req, res) => {
  let id = req.params.id;
  let data = req.body;
  let { make, model, year } = data;
  let carObject = {};

  if (make && model && year) {
    carObject = { make, model, year };
    try {
      let updatedUser = await UserModel.findOne({ _id: id });

      if (!updatedUser) return res.status(404).json("User Not Found");

      updatedUser.owned_cars.push(carObject);
      await UserModel.updateOne({ _id: id }, updatedUser, { new: true });
      return res.status(200).json({ updatedUser });
    } catch (e) {
      console.log(e);
      return res.status(401).json("Failed Update");
    }
  }

  return res.status(404).json("Data not found");
};

let updateCurrentCar = async (req, res) => {
  let id = req.params.id;
  let carId = req.params.carid;
  let data = req.body; //make , model , year
  let { make, model, year } = data;

  try {
    let currentUser = await UserModel.findOne({ _id: id });

    if (!currentUser) return res.status(404).json("User Not Found");

    currentUser.owned_cars.forEach((car, index) => {
      if (car._id == carId) {
        console.log(car);
        make ? (car.make = make) : null;
        model ? (car.model = model) : null;
        year ? (car.year = year) : null;
      }
    });

    await UserModel.updateOne({ _id: id }, currentUser, { new: true });
    return res.status(200).json({ currentUser });
  } catch (e) {
    console.log(e);
    return res.status(404).json("error updating car details");
  }
};

let deleteCar = async (req, res) => {
  let id = req.params.id;
  let carId = req.params.carid;

  try {
    let currentUser = await UserModel.findOne({ _id: id });

    if (!currentUser) return res.status(404).json("User Not Found");

    currentUser.owned_cars = currentUser.owned_cars.filter(
      (car) => car._id != carId
    );

    await UserModel.updateOne({ _id: id }, currentUser, { new: true });
    return res.status(200).json({ currentUser });
  } catch (e) {
    return res.status(404).json("Error Deleting car");
  }
};

let deleteUser = async (req, res) => {
  let id = req.params.id;

  try {
    await UserModel.findOneAndDelete({ _id: id });
    return res.status(200).json("User Deleted");
  } catch (e) {
    console.log(e);
    return res.status(400).json("user not found");
  }
};

module.exports = {
  getUser,
  createUser,
  updateUser,
  updateUserCars,
  updateCurrentCar,
  deleteCar,
  deleteUser,
  getCount,
  getUserInfo,
  insertHistory,
  getHistory
};
