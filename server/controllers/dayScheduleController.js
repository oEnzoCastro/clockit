const db = require('../database/db');

const DaySchedule = require('../models/daySchedule');
const DayScheduleDAO = require('../DAO/dayScheduleDAO');

const dayScheduleDAO = new DayScheduleDAO(db);

function checkScheduleTime(schedule) {
    const timeRegex = /^([01]\d|2[0-3]):[0-5]\d-([01]\d|2[0-3]):[0-5]\d(\|([01]\d|2[0-3]):[0-5]\d-([01]\d|2[0-3]):[0-5]\d)*$/;
    return timeRegex.test(schedule);
}

function isWeekDay(schedule_day) {
    const WEEK_DAYS = ['SEG', 'TER', 'QUA', 'QUI', 'SEX'];
    return WEEK_DAYS.includes(schedule_day);
}

exports.create = async (req, res) => {
    const { agent_id, sector_id, schedule_day, schedule } = req.body;

    try {
        if (schedule && !checkScheduleTime(schedule)) {
            throw new Error("Invalid time format");
        }

        if (schedule_day && !isWeekDay(schedule_day)) {
            throw new Error("Invalid weekday");
        }

        const daySchedule = await dayScheduleDAO.create(
            new DaySchedule({ agent_id, sector_id, schedule_day, schedule })
        );

        if (!daySchedule) {
            return res.status(404).json({
                success: false,
                error: null,
                message: "DaySchedule not found"
            });
        }

        return res.status(200).json({
            success: true,
            data: daySchedule.toJSON(),
            message: "Successfully created daySchedule"
        });

    } catch (error) {
        return res.status(400).json({
            success: false,
            error: error.message || error,
            message: "Failed to create daySchedule"
        });
    }
};

exports.update = async (req, res) => {
    const { agent_id, sector_id, schedule_day, schedule } = req.body;

    try {
        const daySchedule = await dayScheduleDAO.update(
            new DaySchedule({ agent_id, sector_id, schedule_day, schedule })
        );

        if (!daySchedule) {
            return res.status(404).json({
                success: false,
                error: null,
                message: "DaySchedule not found"
            });
        }

        return res.status(200).json({
            success: true,
            data: daySchedule.toJSON(),
            message: "Successfully updated daySchedule"
        });

    } catch (error) {
        return res.status(400).json({
            success: false,
            error: error.message || error,
            message: "Failed to update daySchedule"
        });
    }
};

exports.delete = async (req, res) => {
    const { sector_id, agent_id, schedule_day } = req.body;

    try {
        const result = await dayScheduleDAO.delete(
            agent_id,
            sector_id,
            schedule_day
        );

        if (result<=0) {
            return res.status(404).json({
                success: false,
                error: null,
                message: "DaySchedule not found"
            });
        }

        return res.status(200).json({
            success: true,
            message: "Successfully deleted daySchedule"
        });

    } catch (error) {
        return res.status(400).json({
            success: false,
            error: error.message || error,
            message: "Failed to delete daySchedule"
        });
    }
};

exports.get = async (req, res) => {
    try {
        const result = await dayScheduleDAO.find(req.query);

        if (!result || (Array.isArray(result) && result.length === 0)) {
            return res.status(404).json({
                success: false,
                error: null,
                message: "DaySchedules not found"
            });
        }

        return res.status(200).json({
            success: true,
            data: result.map(r => r.toJSON()),
            message: "Successfully fetched daySchedule"
        });

    } catch (error) {
        return res.status(400).json({
            success: false,
            error: error.message || error,
            message: "Failed to get daySchedules"
        });
    }
};
