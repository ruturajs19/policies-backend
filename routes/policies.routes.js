const express = require("express");
const router = express.Router();
const policiesControllers = require("../controllers/policies.controllers");

router.get("/", policiesControllers.getPolicy);
router.get("/stats", policiesControllers.getStatsByRegion);
router.post("/resetPolicies", policiesControllers.resetPolicyData);
router.patch("/updatePolicy/:policyId", policiesControllers.updatePolicy);

module.exports = router;
