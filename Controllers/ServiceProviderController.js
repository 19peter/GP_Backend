const serviceProviderModel = require("../Models/ServiceProviderModel");

let getCount = async (req, res) => {
  let usersCount = await serviceProviderModel.countDocuments({});
  return res.json(usersCount).status(200);
};

let getUnapproved = async (req, res) => {
  let unapprovedServiceProviders = await serviceProviderModel.find({
    approvalStatus: "pending",
  });
  return res.json(unapprovedServiceProviders).status(200);
};

let getRating = async (req, res) => {
  console.log(req.body);
  let provider = await serviceProviderModel.findOne({
    _id: req.body.providerId,
  });
  return res.json(provider.rating).status(200);
};

let updateRating = async (req, res) => {
  console.log(req.body);
  let provider = await serviceProviderModel.findOneAndUpdate(
    { _id: req.body.providerId },
    { rating: req.body.rating }
  );
  return res.json("updated successfully").status(200);
};

let getApprovalStatus = async (req, res) => {
  console.log(req.body);
  let status = await serviceProviderModel.findOne({ _id: req.body.providerId });
  console.log(status);
  return res.json(status.approvalStatus).status(200);
};
let changeApprovalStatus = async (req, res) => {
  let { email, status } = req.body;
  let sp = await serviceProviderModel
    .findOneAndUpdate({ email: email }, { $set: { approvalStatus: status } })
    .then((doc) => {
      console.log("Updated Document:", doc);
      return res.json("status updated");
    })
    .catch((err) => {
      console.error("Error:", err);
    });
};

let createServiceProvider = async (req, res, next) => {
  try {
    let userData = req.body;
    userData.approvalStatus = "pending";
    console.log(userData);
    let { email, make, model, year, license_plate } = userData;
    let duplicateEmail = await serviceProviderModel.findOne({ email: email });

    if (duplicateEmail) {
      return res.status(400).json("Bad Request, Email is already registered");
    }

    const keysToRemove = ["make", "model", "year"];

    let owned_car = {};
    let sanitizedUser = Object.keys(userData).reduce((acc, key) => {
      if (!keysToRemove.includes(key)) {
        acc[key] = userData[key];
      }
      return acc;
    }, {});

    if (make && model && year) {
      owned_car = { make, model, year, license_plate };
    }

    sanitizedUser.owned_car = owned_car;

    let newSProvider = new serviceProviderModel(sanitizedUser);

    newSProvider
      .save()
      .then(() => {
        req.newSProvider = newSProvider;
        return res.json(newSProvider).status(200);
      })
      .catch((e) => {
        console.log(e);
        return res.status(400).json("Bad Request");
      });
  } catch (e) {
    console.log(e);
    return res.status(400).json("Couldn't create Provider");
  }
};

/// IMPLEMENTED
let getServiceProvider = async (req, res) => {
  let id = req.params.id;

  let sProvider = await serviceProviderModel.findOne({ _id: id });

  if (!sProvider) {
    return res.status(404).json("User Not Found");
  }

  return res.status(200).json({ sProvider });
};

let getServiceProvidersByIds = async (req, res) => {
  let idArray = req.body;
  // console.log(req.body);
  if (!idArray || !Array.isArray(idArray)) {
    return res.status(400).json("Bad Request");
  }

  try {
    let providersArray = await serviceProviderModel.find({
      _id: { $in: idArray },
    });
    return res.status(200).send({ providersArray });
  } catch (error) {
    console.error("Error fetching service providers:", error);
    return res.status(500).json("Internal Server Error");
  }
};

/// IMPLEMENTED
let getAllServiceProviders = async (req, res) => {
  try {
    let sProviders = await serviceProviderModel.find();
    return res.status(200).json({ sProviders });
  } catch (e) {
    console.log(e);
    return res.status(500).json("Error Finding data");
  }
};

let getServicesProvidersWithComplaints = async (req, res) => {
  try {
    let sProviders = await serviceProviderModel.find({ "complaints.0": { $exists: true } });
    return res.status(200).json({ sProviders });
  } catch (e) {
    console.log(e);
    return res.status(500).json("Error Finding data");
  }
};



let getNearestProviders = async (req, res) => {
  // console.log(req.body);
};

///Search For Providers By Name
let getProviderByName = async (req, res) => {
  let name = req.body;

  try {
    let sProviders = serviceProviderModel.find({ name: name });

    return res.status(200).json(sProviders);
  } catch (e) {
    console.log(e);
    return res.status(500).json("Error fetching data");
  }
};

let getNearestProvidersByPrice = async (req, res) => {};

///Filter Providers By Price -- Get Cheapest
let getCheapestProviders = async (req, res) => {
  let limit = req.body.limit || 5;

  try {
    // Find users sorted by price in ascending order and limit to 1
    const users = await serviceProviderModel
      .find()
      .sort({ price: 1 })
      .limit(limit);

    return res.json(users).status(200);
  } catch (error) {
    console.error("Error fetching users with the least price:", error);
  }
};

///Adds Location when user registers or logs in => accessed in frontend by GeoLocation
let setInitialLocation = async (req, res) => {
  let id = req.params.id;
  let location = req.body;

  if (!location || location.length != 2) {
    return res.status(400).json("bad request");
  }

  try {
    let user = serviceProviderModel.findOneAndUpdate(id, req.body, {
      new: true,
    });

    if (!user) {
      return res.status(404).json("user not found");
    }
    let { location } = user;

    return res.status(200).json({ location });
  } catch (e) {}
};

///Returns Car details to be viewed for the user
let getProviderCarDetails = async (req, res) => {
  let id = req.params.id;

  try {
    let sProvider = await serviceProviderModel.findOne({ _id: id });

    if (!sProvider) {
      return res.status(404).json("User Not Found");
    }

    let { owned_car } = sProvider;

    return res.status(200).json({ owned_car });
  } catch (e) {
    console.log(e);
    return res.status(500).json("Error Fetching Data");
  }
};

///Used in Method 2 Live Location Tracking --> is called by Provider Frontend in a setInterval to update his location
let updateLiveLocation = async (req, res) => {
  let LiveLocation = req.body;
  let id = req.params.id;

  try {
    let user = await serviceProviderModel.findByIdAndUpdate(id, LiveLocation, {
      new: true,
    });

    if (!user) {
      return res.status(404).json("Can't find user/update data");
    }

    return res.status(200).json(user);
  } catch (e) {
    console.log(e);
    return res.status(500).json("error updating location");
  }
};

///Used in Method 2 Live Location Tracking --> is called by Consumer Fri=ontend in a setInterval to get Provider latest location
let getLiveLocation = async (req, res) => {
  let id = req.params.id;

  try {
    let user = serviceProviderModel.findById(id);

    if (!user) {
      return res.status(404).json("Can't find user/update data");
    }

    return res.status(200).json(user.live_location);
  } catch (e) {
    console.log(e);
    return res.status(500).json("error fetching location");
  }
};

let addComplaint = async (req, res) => {
  try {
    let id = req.body.providerId;
    let { complaint } = req.body;

    let updatedProvider = await serviceProviderModel.findOne({ _id: id });

    if (!updatedProvider) return res.status(404).json("provider Not Found");

    updatedProvider.complaints.push(complaint);
    await serviceProviderModel.updateOne({ _id: id }, updatedProvider, {
      new: true,
    });
    return res.status(200).json({ updatedProvider });
  } catch (e) {
    console.log(e);
    return res.status(500).json("error in add complaint");
  }
};

module.exports = {
  createServiceProvider,
  getServiceProvidersByIds,
  getServiceProvider,
  updateLiveLocation,
  getLiveLocation,
  getProviderCarDetails,
  setInitialLocation,
  getCheapestProviders,
  getProviderByName,
  getNearestProviders,
  getCount,
  getUnapproved,
  changeApprovalStatus,
  getApprovalStatus,
  getRating,
  updateRating,
  addComplaint,
  getAllServiceProviders,
  getServicesProvidersWithComplaints
};
