
const db = require('../database/db');
const AreaDAO = require('../DAO/areaDAO');
const Area = require('../models/area');

const areaDAO = new AreaDAO(db);

function formatAreas(areas) {
    const result = [];
    areas.forEach(element => {
        result.push(areas.toJSON());
    });
}

exports.getAreas = async (req, res, next) => {
    try {
        const areas = await areaDAO.find(req.body); 
        if (!areas || (Array.isArray(areas) && areas.length === 0)) {
            return res.status(404).send("Area not found");
        }

        return res.status(200).json({
            data: formatAreas(areas), // always an array
            message: "Areas retrieved successfully"
        });
    } catch (error) {
        return res.status(400).send("Failed to get Agent(s): " + error);
    }
};

exports.updateArea = async (req, res, next) => {
    const { institute_id, area_id, acronym, area_name, max_workload, is_hidden } = req.body;
    const area = new Area({ institute_id, id: area_id, acronym, area_name, max_workload, is_hidden });
    try {
        const updatedArea = await areaDAO.update(area);
        if (!updatedArea) {
            return res.status(404).json(
                {
                    message: "Area not Found",
                    success: false
                }
            );
        } else {
            return res.status(200).json({
                data: updatedArea.toJSON(),
                message: "Successful in updating Area",
                success: true
            })
        }
    } catch (error) {
        return res.status(500).json(
            {
                message: "Error in updating area" + error,
                success: false,

            }
        )
    }
}
