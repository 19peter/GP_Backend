const express = require("express");
const router = express.Router();
///CONTROLLERS
const ServiceProviderController = require("../Controllers/ServiceProviderController");
const LoginController = require("../Controllers/LoginController");

router.get("/unapproved", ServiceProviderController.getUnapproved);

router.get("/count", ServiceProviderController.getCount);

router.get("/nearest", ServiceProviderController.getNearestProviders);

router.get("/allproviders", ServiceProviderController.getAllServiceProviders)
router.get("/providerswithcomplaints", ServiceProviderController.getServicesProvidersWithComplaints)

router.get("/:id", ServiceProviderController.getServiceProvider);
router.post("/approvalStatus", ServiceProviderController.getApprovalStatus);

router.post("/", ServiceProviderController.createServiceProvider);
router.post("/getRating", ServiceProviderController.getRating);
router.post("/updateRating", ServiceProviderController.updateRating);

router.post("/", ServiceProviderController.createServiceProvider);

router.post(
  "/updateApprovalStatus",
  ServiceProviderController.changeApprovalStatus
);

router.post("/login", LoginController.ProviderLogin);

router.post("/providers", ServiceProviderController.getServiceProvidersByIds);
router.post("/complaint", ServiceProviderController.addComplaint);

// router.post('/login', LoginController.ProviderLogin)
module.exports = router;
