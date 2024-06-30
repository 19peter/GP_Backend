const express = require('express');
const router = express.Router();
const UserController = require('../Controllers/UserController');
const LoginController = require('../Controllers/LoginController');

//consumer login
router.post('/login',LoginController.consumerLogin)
router.post('/history/:consumerId',UserController.insertHistory)

router.get('/count',UserController.getCount)

router.post('/profile',UserController.getUserInfo)


router.post('/history',UserController.getHistory)

router.post('/', UserController.createUser);

router.put('/:id', UserController.updateUser);

///add new car
router.put('/:id/cars/add', UserController.updateUserCars);

///update current car
router.put('/:id/cars/:carid', UserController.updateCurrentCar);

router.delete('/:id', UserController.deleteUser);

///delete a car
router.delete('/:id/cars/:carid', UserController.deleteCar);

router.get('/:id', UserController.getUser);

module.exports = router;