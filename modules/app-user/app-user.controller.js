let AppUser = require('./app-user.model');
let response = require('../../utils/response');
let jwt = require("jsonwebtoken");

async function Add(req, res) {
    try {
        let input = req.body;
        let data = await AppUser.create(input);
        res.status(201).json(response.success(201, data));
    } catch (error) {
        console.log(error);
        res.status(400).json(response.error(400, "Error: Something went wrong. Be sure we are fixing this."));
    }
}

async function GetById(req, res) {
    try {
        let id = req.params.id;
        let data = await AppUser.findAll({ where: { id, status: false }, attributes: { exclude: ['updatedAt', 'createdAt'] } });
        res.status(200).json(response.output(200, data, data.length));

    } catch (error) {
        console.log(error);
        res.status(400).json(response.error(400, "Error: Something went wrong. Be sure we are fixing this."));
    }
}

async function GetAll(req, res) {
    try {
        let data = await AppUser.findAll({ where: { status: false }, attributes: { exclude: ['updatedAt'] } });
        res.status(200).json(response.output(200, data, data.length));

    } catch (error) {
        console.log(error);
        res.status(400).json(response.error(400, "Error: Something went wrong. Be sure we are fixing this."));
    }
}


async function DeleteById(req, res) {
    try {

        let id = req.params.id;
        let data = await AppUser.update({ status: true, deleted_at: new Date() }, { where: { id, status: false }, attributes: { exclude: ['updatedAt', 'createdAt'] } });

        if (data[0]) {
            res.status(200).json(response.success(200, 'Data Deleted Successfully.'));
        } else {
            res.status(404).json(response.error(404, 'Data NOT Found'));
        }

    } catch (error) {
        console.log(error);
        res.status(400).json(response.error(400, "Error: Something went wrong. Be sure we are fixing this."));
    }
}

async function UpdateById(req, res) {
    try {
        let id = req.params.id;
        let updateData = req.body;

        let data = await AppUser.update({ ...updateData }, { where: { id, status: false } });
        if (data[0]) {
            res.status(200).json(response.success(200, "Data Updated Successfully."));
        } else {
            res.status(404).json(response.error(404, 'Data NOT Found'));
        }

    } catch (error) {
        console.log(error);
        res.status(400).json(response.error(400, "Error: Something went wrong. Be sure we are fixing this."));
    }
}

// ======== GENERATE ACCESS TOKEN
function generateAccessToken(appId, appKey) {
    return jwt.sign({ data: appId + "|" + appKey }, process.env.TOKEN_SECRET, { expiresIn: '315569520000s' });
}

// ======= APP USER LOGIN AND TOKEN GENERATION
async function appLogin(req, res) {
    let appId = req.body.appId;
    let appKey = req.body.appKey;
    const token = generateAccessToken(appId, appKey);
    res.status(200).json(response.output(200, token));
}


module.exports = {
    Add,
    GetById,
    GetAll,
    DeleteById,
    UpdateById,
    appLogin
};