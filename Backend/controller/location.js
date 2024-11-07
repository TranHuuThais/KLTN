const Location = require('../models/location'); // Import model

const create = async (req, res) => {
    try {
        const { firstname } = req.body;
        console.log('Dữ liệu nhận được:', req.body);  // Ghi log dữ liệu trong body của yêu cầu

        // Kiểm tra dữ liệu
        if (!firstname) {
            return res.status(400).json({ message: 'Firstname là bắt buộc' });
        }

        // Tạo vị trí mới
        const newLocation = new Location({ firstname });
        await newLocation.save();

        // Trả lại vị trí mới được tạo
        res.status(201).json(newLocation);
    } catch (error) {
        console.error('Lỗi khi tạo vị trí:', error);
        res.status(400).json({ message: 'Tạo vị trí không thành công', error: error.message });
    }
};
const getAll = async (req, res) => {
    try {
        const locations = await Location.find();
        res.status(200).json(locations);
    } catch (error) {
        res.status(500).json({ message: 'Error fetching locations', error: error.message });
    }
};

const deleteLocation = async (req, res) => {
    try {
        const { id } = req.params; // Get the ID from the request parameters
        const deletedLocation = await Location.findByIdAndDelete(id); // Delete the location

        if (!deletedLocation) {
            return res.status(404).json({ message: 'Location not found' });
        }

        res.status(200).json({ message: 'Location deleted successfully' });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

const updateLocation = async (req, res) => {
    try {
        const { id } = req.params;
        const { firstname } = req.body;

        const updatedLocation = await Location.findByIdAndUpdate(id, { firstname }, { new: true });
        if (!updatedLocation) {
            return res.status(404).json({ message: 'Location not found' });
        }

        res.status(200).json(updatedLocation);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
};


const getLocationById = async (req, res) => {
    try {
        const location = await Location.findById(req.params.id);
        if (!location) {
            return res.status(404).json({ message: 'Location not found' });
        }
        res.status(200).json(location);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

module.exports = {
    create,
    getAll,
    deleteLocation,
    updateLocation,
    getLocationById
};