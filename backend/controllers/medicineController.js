import Medicine from '../models/Medicine.js';

// @desc    Get all medicines
// @route   GET /api/medicines
export const getAllMedicines = async (req, res) => {
  try {
    const { category, search } = req.query;
    let filter = {};

    if (category) {
      filter.category = category;
    }

    if (search) {
      filter.$or = [
        { name: { $regex: search, $options: 'i' } },
        { description: { $regex: search, $options: 'i' } },
      ];
    }

    const medicines = await Medicine.find(filter);

    res.status(200).json({
      success: true,
      data: medicines,
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Get medicine by ID
// @route   GET /api/medicines/:id
export const getMedicineById = async (req, res) => {
  try {
    const medicine = await Medicine.findById(req.params.id);

    if (!medicine) {
      return res.status(404).json({ success: false, message: 'Medicine not found' });
    }

    res.status(200).json({
      success: true,
      data: medicine,
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Create medicine (Admin only)
// @route   POST /api/medicines
export const createMedicine = async (req, res) => {
  try {
    const { name, description, dosage, category, price, stock, image, manufacturer } = req.body;

    const medicine = await Medicine.create({
      name,
      description,
      dosage,
      category,
      price,
      stock,
      image,
      manufacturer,
    });

    res.status(201).json({
      success: true,
      message: 'Medicine added successfully',
      data: medicine,
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Get medicines by category
// @route   GET /api/medicines/category/:category
export const getMedicinesByCategory = async (req, res) => {
  try {
    const medicines = await Medicine.find({ category: req.params.category });

    res.status(200).json({
      success: true,
      data: medicines,
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};
