const db = require('../database/db');


const DaySchedule = require('../models/daySchedule');
const DayScheduleDAO = require('../DAO/dayScheduleDAO');
const { scheduler } = require('timers/promises');



const dayScheduleDAO = new DayScheduleDAO(db);





exports.create = async (req, res, next) => {
    const { agent_id, sector_id, schedule_day, schedule } = req.body;
    try {
        const daySchedule = await dayScheduleDAO
            .create(new DaySchedule({ agent_id, sector_id, schedule_day, schedule }));

        if (!daySchedule) {
            return res.status(500).send("Failed to create daySchedule");
        }

        return res.status(200).json({
            data: daySchedule.toJSON(), // always an array
            message: "Successfully created daySchedule"
        });
    } catch (error) {
        return res.status(400).send("Failed to Create: " + error);
    }
};


exports.update = async (req, res, next) => {
    const { agent_id, sector_id, schedule_day, schedule  } = req.body;
    try {
        const daySchedule = await dayScheduleDAO.update(new DaySchedule({ agent_id, sector_id, schedule_day, schedule }));

        if (!daySchedule) {
            return res.status(500).send("Failed to update daySchedule");
        }

        return res.status(200).json({
            data: daySchedule.toJSON(), // always an array
            message: "Successfully updated daySchedule"
        });
    } catch (error) {
        return res.status(400).send("Failed to update daySchedule: " + error);
    }
};


exports.delete = async (req, res, next) => {
    const { sector_id, agent_id,schedule_day } = req.body;
    try {
        const result = await dayScheduleDAO.delete(agent_id, sector_id,schedule_day);

        if (!result) {
            return res.status(500).json({
                success: false,
                message: "Successfully deleted daySchedule"
            }
            );
        }

        return res.status(200).json({
            success: true,
            message: "Successfully deleted contract"
        });
    } catch (error) {
        return res.status(400).send("Failed to delete Contracts: " + error);
    }
};
exports.get = async (req, res, next) => {
    try {
        const result = await dayScheduleDAO.find(req.body);

        if (!result) {
            return res.status(500).send("Failed to get daySchedule");
        }

        return res.status(200).json({
            data: agentSector.toJSON(), // always an array
            message: "Successfully fetched daySchedule"
        });
    } catch (error) {
        return res.status(400).send("Failed to get daySchedules: " + error);
    }
}

