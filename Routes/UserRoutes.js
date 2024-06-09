const express = require('express');
const router = express.Router();
const UserController = require('../Controllers/UserController');



router.post('/', UserController.createUser);

router.put('/:id', UserController.updateUser);

///add new car
router.put('/:id/cars/add', UserController.updateUserCars);

///update current car
router.put('/:id/cars/:carid', UserController.updateCurrentCar);

router.delete('/:id', UserController.deleteUser);

///delete a car
router.delete('/:id/cars/:carid', UserController.deleteCar);


module.exports = router;