const router = require("express").Router();

const UserController = require("../controllers/UserController");
const LicenseController = require("../controllers/LicenseController");
const PivotTableController = require("../controllers/PivotTableController");
const RolController = require("../controllers/RolController");
const AdminController = require("../controllers/AdminController");

//Metodos Get
router.get("/users", UserController.getUsers);
router.get("/users/:id", UserController.getUserById);
router.get("/user", UserController.searchUser);

router.get("/licenses", LicenseController.getLicenses);
router.get("/licenses/:id", LicenseController.getLicenseById);
router.get("/license", LicenseController.searchLicense);

router.get("/pivot", PivotTableController.getPivotTable);
router.get("/pivot/:id", PivotTableController.getPivotById);
router.get("/userrollic", PivotTableController.searchPivot);

router.get("/rols", RolController.getRols);

router.get("/admins/:id", AdminController.getAdminById);

//Metodos Post
router.post("/users/store", UserController.createUser);

router.post("/licenses/store", LicenseController.createLicense);
router.post("/pivot/store", PivotTableController.createPivot);

//Metodos Put
router.put("/users/:id", UserController.updateUser);
router.put("/licenses/:id", LicenseController.updateLicense);
router.put("/pivot/:id", PivotTableController.updatePivot);

//Metodos Delete
router.delete("/users/:id", UserController.deleteUser);
router.delete("/licenses/:id", LicenseController.deleteLicense);
router.delete("/pivot/:id", PivotTableController.deletePivot);

module.exports = router;
