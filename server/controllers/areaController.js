const db = require('../database/db');
const AreaDAO = require('../DAO/areaDAO');
const Area = require('../models/area');

const areaDAO = new AreaDAO(db);

function formatAreas(areas) {
    return areas.map(a => a.toJSON());
}

exports.getAreas = async (req, res) => {
    try {
        const areas = await areaDAO.findAreas(req.query);

        if (!areas || (Array.isArray(areas) && areas.length === 0)) {
            return res.status(404).json({
                success: false,
                error: null,
                message: "Areas not found"
            });
        }

        return res.status(200).json({
            success: true,
            data: formatAreas(areas),
            message: "Areas retrieved successfully"
        });

    } catch (error) {
        return res.status(400).json({
            success: false,
            error: error.message || error,
            message: "Failed to get Areas"
        });
    }
};

exports.updateArea = async (req, res) => {
    const { institute_id, area_id, acronym, area_name, max_workload, is_hidden } = req.body;

    const area = new Area({
        institute_id,
        id: area_id,
        acronym,
        area_name,
        max_workload,
        is_hidden
    });

    try {
        const updatedArea = await areaDAO.update(area);

        if (!updatedArea) {
            return res.status(404).json({
                success: false,
                error: null,
                message: "Area not found"
            });
        }

        return res.status(200).json({
            success: true,
            data: updatedArea.toJSON(),
            message: "Successfully updated Area"
        });

    } catch (error) {
        return res.status(500).json({
            success: false,
            error: error.message || error,
            message: "Error updating Area"
        });
    }
};

exports.getAreaById = async (req, res) => {
    try {
        const { id } = req.params;

        const area = await areaDAO.getAreaById(id);

        if (!area) {
            return res.status(404).json({
                success: false,
                error: null,
                message: "Area not found"
            });
        }

        return res.status(200).json({
            success: true,
            data: area.toJSON(),
            message: "Area retrieved successfully"
        });

    } catch (error) {
        return res.status(400).json({
            success: false,
            error: error.message || error,
            message: "Failed to get Area"
        });
    }
};

