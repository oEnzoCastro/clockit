
const db = require('../database/db');
const AreaDAO = require('../DAO/areaDAO');
const Area = require('../models/area');

const areaDAO = new AreaDAO(db);


exports.getAreas = async (req, res, next) => {
    const { institute_id } = req.body;
    try {
        const areas = await areaDAO.getAreasByInstitute(institute_id);
        if (!areas) {
            return res.status(404).send("No Areas Found");
        } else {
            
            const areasJson = areas.map(a => a.toJSON());
            return res.status(202).json({
                data: areasJson,
                message: "Successful in getArea",
            });
        }
    } catch (error) {
        return res.status(500).send("Error in getAreas: " + error);
    }
}

exports.getAreaById = async (req, res, next) => {
    const { area_id } = req.body;
    try {
        const areas = await areaDAO.getAreaById(area_id);
        if (!areas) {
            return res.status(404).send("No Areas Found");
        } else {
            return res.status(202).json({
                data: area.toJSON(),
                message: "Successful in getArea",
            });
        }
    } catch (error) {
        return res.status(500).send("Error in getAreaById: " + error);
    }
}

exports.getAreaByName = async (req, res, next) => {
    const { area_name, institute_id } = req.body;
    try {
        const area = await areaDAO.getByNameInstitute(area_name, institute_id);
        if (!area ) {
            return res.status(404).send("No Area Found");
        }
       
        return res.status(202).json({
            data: area.toJSON(),
            message: "Successful in getAreaByName",
        });
    } catch (error) {
        return res.status(500).send("Error in getAreaByNameInstitute: " + error);
    }
}

exports.getAreaByAcronym = async (req, res, next) => {
    const { acronym, institute_id } = req.body;
    try {
        const area = await areaDAO.getByAcronymInstitute(acronym, institute_id);
        if (!area ) {
            return res.status(404).send("No Area Found");
        }
       
        return res.status(202).json({
            data: area.toJSON(),
            message: "Successful in getAreaByAcronym",
        });
    } catch (error) {
        return res.status(500).send("Error in getAreaByAcronym: " + error);
    }
}

exports.updateArea = async (req, res, next) => {
    const {institute_id, area_id, acronym, area_name, max_workload, is_hidden } = req.body;
    const area = new Area({ institute_id,id:area_id, acronym, area_name, max_workload, is_hidden });
    try {
        const updatedArea = await areaDAO.update(area);
        if (!updatedArea) {
            return res.status(404).send('No areas found');
        } else {
            return res.status(200).json({
                data:updatedArea.toJSON(),
                message:"Successful in updating Area"
            })
        }
    } catch (error) {
        return res.status(500).send("Error in updateArea: " + error);
    }
}
