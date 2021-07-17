const database = require("../utils/database");

/**
 * This class is used to perform various query operations on the database
 */
class Policy {
  constructor() {
    this.items = [];
  }
  resetPolicyData(policies) {
    policies.forEach((policy) => {
      this.items.push(policy);
    });
    const db = database.getDB();
    // db.collection("policies").drop();
    return db
      .collection("policies")
      .insertMany(this.items)
      .then((result) => result)
      .catch((error) => {
        console.log("Error:", error);
      });
  }
  updatePolicy(policyId, policyDetails) {
    const db = database.getDB();
    return db
      .collection("policies")
      .updateOne({ policyId }, { $set: policyDetails })
      .then((results) => results)
      .catch((error) => {
        console.log("Error:", error);
      });
  }
  fetchAllDates(limitPipeline) {
    const db = database.getDB();
    return db
      .collection("policies")
      .aggregate(limitPipeline)
      .toArray()
      .then((result) => result)
      .catch((error) => {
        console.log("Error:", error);
      });
  }
  fetchdetails(query) {
    const db = database.getDB();
    return db
      .collection("policies")
      .findOne(query)
      .then((result) => result)
      .catch((error) => {
        console.log("Error:", error);
      });
  }
  deleteCollection() {
    const db = database.getDB();
    return db
      .collection("policies")
      .then((result) => result)
      .catch((error) => {
        console.log("Error:", error);
      });
  }
}

module.exports = Policy;
