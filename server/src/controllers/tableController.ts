import { Request, Response } from 'express';
import Table from '../models/Table';
import Reservation from '../models/Reservation';

// Helper to convert "HH:MM" to minutes
const timeToMinutes = (time: string) => {
  const [hours, minutes] = time.split(':').map(Number);
  return hours * 60 + minutes;
};

// @desc    Get all tables
// @route   GET /api/tables
// @access  Private/Admin
export const getTables = async (req: Request, res: Response) => {
  try {
    const tables = await Table.find({}).sort({ tableNumber: 1 });
    res.json(tables);
  } catch (error) {
    res.status(500).json({ message: 'Server Error' });
  }
};

// @desc    Create a new table
// @route   POST /api/tables
// @access  Private/Admin
export const createTable = async (req: Request, res: Response) => {
  try {
    const { tableNumber, capacity, isActive } = req.body;
    
    const tableExists = await Table.findOne({ tableNumber });
    if (tableExists) {
      return res.status(400).json({ message: 'Table number already exists' });
    }

    const table = new Table({ tableNumber, capacity, isActive });
    const createdTable = await table.save();
    res.status(201).json(createdTable);
  } catch (error) {
    res.status(500).json({ message: 'Server Error' });
  }
};

// @desc    Delete a table
// @route   DELETE /api/tables/:id
// @access  Private/Admin
export const deleteTable = async (req: Request, res: Response) => {
  try {
    const table = await Table.findById(req.params.id);
    if (table) {
      await table.deleteOne();
      res.json({ message: 'Table removed' });
    } else {
      res.status(404).json({ message: 'Table not found' });
    }
  } catch (error) {
    res.status(500).json({ message: 'Server Error' });
  }
};

// @desc    Get available tables for a specific date, time, and party size
// @route   POST /api/tables/available
// @access  Public
export const getAvailableTables = async (req: Request, res: Response) => {
  try {
    const { date, time, partySize } = req.body;
    
    if (!date || !time || !partySize) {
      return res.status(400).json({ message: 'Please provide date, time, and party size' });
    }

    // Restrict based on size: find tables that can fit the party, but not excessively large
    // e.g., if party is 2, they can sit at a table of 2 to 4, but not a table of 10.
    const maxCapacityAllowed = Number(partySize) + 2; 

    const tables = await Table.find({
      isActive: true,
      capacity: { $gte: Number(partySize), $lte: maxCapacityAllowed }
    });

    // Check reservations for the given date to see which tables are booked
    const reservationsOnDate = await Reservation.find({ date, status: { $ne: 'Cancelled' } });
    
    const reqStart = timeToMinutes(time);
    const reqEnd = reqStart + 120; // 2 hours duration

    const availableTables = tables.filter((table) => {
      // Find any overlapping reservation for this specific table
      const hasOverlap = reservationsOnDate.some((resv) => {
        if (resv.table.toString() !== table._id.toString()) return false;
        
        const resvStart = timeToMinutes(resv.time);
        const resvEnd = timeToMinutes(resv.endTime);
        
        // Overlap condition
        return reqStart < resvEnd && reqEnd > resvStart;
      });
      
      return !hasOverlap;
    });

    res.json(availableTables);
  } catch (error) {
    res.status(500).json({ message: 'Server Error' });
  }
};
