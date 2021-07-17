const fs = require("fs");
const filesFolder = "dist";
const path = require("path");
const csv = require("csvtojson");
const Policy = require("../models/policy");
const HttpError = require("../models/HttpError");

/**
 * The below function is used for getting the months from date
 * @param {*} data : The data received as response
 * @returns
 */
const getStatsForAllMonths = (data) => {
  const policyCounts = [];
  data.forEach((item) => {
    const month = new Date(item.dateOfPurchase.toString()).getMonth();
    if (policyCounts[month] === undefined) {
      policyCounts[month] = 1;
    } else {
      policyCounts[month]++;
    }
  });
  return policyCounts;
};

/**
 * The below controller is used to retrieve policy by customer id or policy id
 * @param {*} req
 * @param {*} res
 * @param {*} next
 */
const getPolicy = async (req, res, next) => {
  try {
    let params = { policyId: { $all: [req.query.policyId] } };
    if (req.query.customerId) {
      params = { customerId: { $all: [req.query.customerId] } };
    }
    const policy = new Policy();
    policy.fetchdetails(params)
      .then((results) => {
        if (!results) {
          const error = new HttpError(
            "Policy not found. Please enter a valid Customer or Policy id",
            404
          );
          throw error;
        }
        res.status(200).send(results);
      })
      .catch((error) => {
        res.status(error.code || 500).json({ message: error.message });
      });
  } catch (e) {
    res.status(500).send("Something Went Wrong. Please Try Again");
  }
};

/**
 * The below controller is used to retrieve no. of policies per month by region
 * @param {*} req
 * @param {*} res
 * @param {*} next
 */
const getStatsByRegion = async (req, res, next) => {
  try {
    const limitPipeline = [
      { $match: { customerRegion: req.query.region } },
      { $project: { _id: 0, dateOfPurchase: 1 } },
    ];
    const policy = new Policy();
    policy.fetchAllDates(limitPipeline)
      .then((results) => {
        if (!results) {
          const error = new HttpError(
            "Region is invalid. Please provide a valid one.",
            404
          );
          throw error;
        }
        const policyCount = getStatsForAllMonths(results);
        res.status(200).send(policyCount);
      })
      .catch((error) => {
        res.status(error.code || 500).json({ message: error.message });
      });
  } catch (e) {
    res.status(500).send("Something Went Wrong. Please Try Again");
  }
};

/**
 * The below controller is used to update fields in an existing policy
 * @param {*} req
 * @param {*} res
 * @param {*} next
 */
const updatePolicy = async (req, res, next) => {
  const {
    fuel,
    vehicleSegment,
    premium,
    bodilyInjuryLiability,
    personalInjuryProtection,
    propertyDamageLiability,
    collision,
    comprehensive,
    customerGender,
    customerIncomeGroup,
    customerRegion,
    customerMaritalStatus,
  } = req.body;
  const updatedPolicy = {};
  updatedPolicy.fuel = fuel.toString();
  updatedPolicy.vehicleSegment = vehicleSegment.toString();
  updatedPolicy.premium = premium.toString();
  updatedPolicy.bodilyInjuryLiability = bodilyInjuryLiability.toString();
  updatedPolicy.personalInjuryProtection = personalInjuryProtection.toString();
  updatedPolicy.propertyDamageLiability = propertyDamageLiability.toString();
  updatedPolicy.collision = collision.toString();
  updatedPolicy.comprehensive = comprehensive.toString();
  updatedPolicy.customerGender = customerGender.toString();
  updatedPolicy.customerIncomeGroup = customerIncomeGroup.toString();
  updatedPolicy.customerRegion = customerRegion.toString();
  updatedPolicy.customerMaritalStatus = customerMaritalStatus.toString();
  try {
    const policy = new Policy();
    policy.updatePolicy(req.params.policyId, updatedPolicy)
      .then((results) => {
        if (results.matchedCount === 0) {
          const error = new HttpError(
            "Policy not found. Please provide a valid policy id",
            404
          );
          throw error;
        }
        res.status(200).send(results);
      })
      .catch((error) => {
        res.status(error.code || 500).json({ message: error.message });
      });
  } catch (e) {
    res.status(500).send("Something Went Wrong. Please Try Again:", e);
  }
};

/**
 * The below controller is used to reset policy data
 * @param {*} req
 * @param {*} res
 * @param {*} next
 */
const resetPolicyData = async (req, res, next) => {
  try {
    const policy = new Policy();
    csv()
      .fromFile("policies_data.csv")
      .then((jsonObj) => {
        policy.resetPolicyData(jsonObj).then(() => {
          res.status(200).send(jsonObj);
        });
      })
      .catch((error) => {
        res.status(error.code || 500).json({ message: error.message });
      });
  } catch (e) {
    res.status(500).send("Something Went Wrong. Please Try Again");
  }
};

exports.getPolicy = getPolicy;
exports.updatePolicy = updatePolicy;
exports.getStatsByRegion = getStatsByRegion;
exports.resetPolicyData = resetPolicyData;
