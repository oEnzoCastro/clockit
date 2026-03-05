const db = require('../database/db')

const Sector = require('../models/sector')
const SectorDAO = require('../DAO/sectorDAO')

const sectorDAO = new SectorDAO(db)

exports.create = async (req, res) => {
  const { sector_name, acronym, area_id, is_hidden } = req.body

  try {
    const sector = await sectorDAO.create(
      new Sector({ sector_name, acronym, area_id, is_hidden })
    )

    if (!sector) {
      return res.status(500).json({
        success: false,
        error: null,
        message: 'Failed to create Sector',
      })
    }

    return res.status(200).json({
      success: true,
      data: sector.toJSON(),
      message: 'Successfully created Sector',
    })
  } catch (error) {
    return res.status(400).json({
      success: false,
      error: error.message || error,
      message: 'Failed to create Sector',
    })
  }
}

exports.update = async (req, res) => {
  const { id, sector_name, acronym, area_id, is_hidden } = req.body

  try {
    if (!id) {
      throw new Error('Id missing')
    }

    const sector = await sectorDAO.update(
      new Sector({ id, sector_name, acronym, area_id, is_hidden })
    )

    if (!sector) {
      return res.status(404).json({
        success: false,
        error: null,
        message: 'Sector not Found',
      })
    }

    return res.status(200).json({
      success: true,
      data: sector.toJSON(),
      message: 'Successfully updated Sector',
    })
  } catch (error) {
    return res.status(400).json({
      success: false,
      error: error.message || error,
      message: 'Failed to update Sector',
    })
  }
}

exports.updateHidden = async (req, res) => {
  const { id, is_hidden } = req.body

  try {
    const sector = await sectorDAO.updateHiddenSector(id, is_hidden)

    if (!sector) {
      return res.status(404).json({
        success: false,
        error: null,
        message: 'Sector not Found',
      })
    }

    return res.status(200).json({
      success: true,
      data: sector.toJSON(),
      message: 'Successfully updated Sector',
    })
  } catch (error) {
    return res.status(400).json({
      success: false,
      error: error.message || error,
      message: 'Failed to update Sector',
    })
  }
}

// ✅ DELETE corrigido: pega id do req.params (porque sua rota é /delete/:sector_id)
exports.delete = async (req, res) => {
  const { sector_id } = req.params
  const id = sector_id

  try {
    if (!id) {
      return res.status(400).json({
        success: false,
        error: 'Id missing',
        message: 'Failed to delete Sector',
      })
    }

    const result = await sectorDAO.delete(id)

    if (result <= 0) {
      return res.status(404).json({
        success: false,
        error: null,
        message: 'Sector not Found',
      })
    }

    return res.status(200).json({
      success: true,
      message: 'Successfully deleted Sector',
    })
  } catch (error) {
    return res.status(400).json({
      success: false,
      error: error.message || error,
      message: 'Failed to delete Sector',
    })
  }
}

exports.get = async (req, res) => {
  try {
    const result = await sectorDAO.findSectors(req.query)

    if (!result || (Array.isArray(result) && result.length === 0)) {
      return res.status(404).json({
        success: false,
        error: null,
        message: 'Sectors not found',
      })
    }

    return res.status(200).json({
      success: true,
      data: result.map((r) => r.toJSON()),
      message: 'Successfully fetched Sectors',
    })
  } catch (error) {
    return res.status(400).json({
      success: false,
      error: error.message || error,
      message: 'Failed to get Sectors',
    })
  }
}