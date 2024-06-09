const userModel = require('../Models/UserModel');

let createUser = (req, res) => {
    let data = req.body;
    let { make, model, year } = data;
    let owned_cars = [];
    let newUser;

    const keysToRemove = ['make', 'model', 'year'];

    let sanitizedUser = Object.keys(data).reduce((acc, key) => {
        if (!keysToRemove.includes(key)) {
            acc[key] = data[key];
            console.log(acc);
        }
        return acc;
    }, {})

    if (make && model && year) {
        owned_cars.push({ make, model, year })
    }

    sanitizedUser.owned_cars = owned_cars;

    try {
        newUser = new userModel(sanitizedUser);

    } catch (e) {
        console.log(e);
    }

    newUser.save()
        .then(() => {
            return res.json({ newUser });
        })
        .catch((e) => {
            console.log(e);
        })


}


let updateUser = async (req, res) => {
    let data = req.body;
    let id = req.params.id;

    try {
        let updatedUser = await userModel.findByIdAndUpdate({ _id: id },
            data,
            {
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

}


let updateUserCars = async (req, res) => {
    let id = req.params.id;
    let data = req.body;
    let { make, model, year } = data;
    let carObject = {};

    if (make && model && year) {
        carObject = { make, model, year }
        try {

            let updatedUser = await userModel.findOne({ _id: id });

            if (!updatedUser)
                return res.status(404).json("User Not Found")

            updatedUser.owned_cars.push(carObject);
            await userModel.updateOne({ _id: id }, updatedUser, { new: true })
            return res.status(200).json({ updatedUser })

        } catch (e) {

            console.log(e);
            return res.status(401).json("Failed Update")
        }
    }

    return res.status(404).json("Data not found")
}

let updateCurrentCar = async (req, res) => {
    let id = req.params.id;
    let carId = req.params.carid;
    let data = req.body;  //make , model , year
    let { make, model, year } = data;

    try {
        let currentUser = await userModel.findOne({ _id: id })

        if (!currentUser)
            return res.status(404).json("User Not Found")

        currentUser.owned_cars.forEach((car, index) => {
            if (car._id == carId) {
                console.log(car);
                make ? car.make = make : null;
                model ? car.model = model : null;
                year ? car.year = year : null;
            }
        })


        await userModel.updateOne({ _id: id }, currentUser, { new: true })
        return res.status(200).json({ currentUser })


    } catch (e) {
        console.log(e);
        return res.status(404).json('error updating car details')

    }

}


let deleteCar = async (req, res) => {
    let id = req.params.id;
    let carId = req.params.carid;

    try {
        let currentUser = await userModel.findOne({ _id: id })

        if (!currentUser)
            return res.status(404).json("User Not Found")

        currentUser.owned_cars = currentUser.owned_cars.filter((car) => car._id != carId)

        await userModel.updateOne({ _id: id }, currentUser, { new: true });
        return res.status(200).json({ currentUser });

    } catch (e) {
        return res.status(404).json("Error Deleting car")
    }

}


let deleteUser = async (req, res) => {
    let id = req.params.id;

    try {
        await userModel.findOneAndDelete({ _id: id });
        return res.status(200).json("User Deleted");
    } catch (e) {
        console.log(e);
        return res.status(400).json("user not found");
    }

}

module.exports = { createUser, updateUser, updateUserCars, updateCurrentCar, deleteCar, deleteUser }