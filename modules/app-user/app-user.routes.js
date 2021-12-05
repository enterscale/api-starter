let router = require('express').Router();

let AppUser = require('./app-user.controller');

router.post("/app/user", (req, res) => {
    AppUser.Add(req, res);
});

router.get("/app/user/:id", (req, res) => {
    AppUser.GetById(req, res);
});

router.get("/app/user", (req, res) => {
    AppUser.GetAll(req, res);
});

router.delete("/app/user/:id", (req, res) => {
    AppUser.DeleteById(req, res);
});

router.put("/app/user/:id", (req, res) => {
    AppUser.UpdateById(req, res);
});

router.post("/app/login", (req, res) => {
    AppUser.appLogin(req, res);
});

module.exports = router;