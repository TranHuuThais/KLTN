const TourPackage = require("../models/tourPackage");
const Duration = require("../models/duration");
const mongoose = require('mongoose');  // Make sure mongoose is imported

const createTour = async (req, res) => {
  try {
    const image = req.files && req.files['image'] ? req.files['image'][0].path : "";
    const groupImages = req.files && req.files["groupImages"] ? req.files["groupImages"].map((file) => file.path) : [];
    const { package_name, description, price, durations, destinationId, tourGuideId, locationId, incAndExc } = req.body;

    let parsedDurations = durations;
    if (typeof durations === 'string') {
      parsedDurations = JSON.parse(durations);
    }

    if (!Array.isArray(parsedDurations) || parsedDurations.length === 0) {
      return res.status(400).json({ message: "Durations phải là một mảng các ObjectId hợp lệ và không được rỗng." });
    }

    const invalidDurations = parsedDurations.filter(id => !mongoose.Types.ObjectId.isValid(id));
    if (invalidDurations.length > 0) {
      return res.status(400).json({ message: `Các ID trong durations không hợp lệ: ${invalidDurations.join(', ')}` });
    }

    const newTour = new TourPackage({
      package_name,
      description,
      price,
      image,
      durations: parsedDurations,
      destinationId,
      tourGuideId,
      locationId,
      incAndExc,
      groupImages
    });

    await newTour.save();

    await Duration.updateMany(
      { _id: { $in: parsedDurations } },
      { $set: { tourPackageId: newTour._id } }
    );

    return res.status(201).json({ message: "Tour package created successfully!", tour: newTour });
  } catch (error) {
    console.error("Error creating tour:", error);
    return res.status(500).json({ message: "Đã xảy ra lỗi trong quá trình tạo tour.", error: error.message });
  }
};


// Api Delete tourPacket
const deleteTour = async (req, res) => {
  const { id } = req.params;

  // Validate if the provided ID is a valid ObjectId
  if (!mongoose.Types.ObjectId.isValid(id)) {
    return res.status(400).json({ message: "ID không hợp lệ" }); // Invalid ID
  }

  try {
    // Find the tour package by ID and delete it
    const deleteTour = await TourPackage.findByIdAndDelete(id);

    if (!deleteTour) {
      console.log("Tour not found with ID:", id); // Add logging
      return res.status(404).json({ message: "Gói tour không tồn tại" });
    }

    // Success response
    res.status(200).json({ message: "Gói tour đã được xóa thành công" });
  } catch (error) {
    // Log the error for debugging purposes
    console.error("Lỗi khi xóa gói tour:", error);
    res.status(500).json({ message: "Lỗi máy chủ nội bộ" });
  }
};

//Api edit tour
const editTour = async (req, res) => {
  const { id } = req.params;

  if (!mongoose.Types.ObjectId.isValid(id)) {
    return res.status(400).json({ message: "ID không hợp lệ" });
  }

  try {
    const image = req.files && req.files['image'] ? req.files['image'][0].path : "";
    const groupImages = req.files && req.files["groupImages"] ? req.files["groupImages"].map((file) => file.path) : [];
    const { package_name, description, price, durations, destinationId, tourGuideId, locationId, incAndExc } = req.body;

    let parsedDurations = durations;
    if (typeof durations === 'string') {
      parsedDurations = JSON.parse(durations);
    }

    if (!Array.isArray(parsedDurations) || parsedDurations.length === 0) {
      return res.status(400).json({ message: "Durations phải là một mảng các ObjectId hợp lệ và không được rỗng." });
    }

    const invalidDurations = parsedDurations.filter(id => !mongoose.Types.ObjectId.isValid(id));
    if (invalidDurations.length > 0) {
      return res.status(400).json({ message: `Các ID trong durations không hợp lệ: ${invalidDurations.join(', ')}` });
    }

    const tour = await TourPackage.findById(id);
    if (!tour) {
      return res.status(404).json({ message: "Gói tour không tồn tại" });
    }

    tour.package_name = package_name || tour.package_name;
    tour.description = description || tour.description;
    tour.price = price || tour.price;
    tour.durations = parsedDurations || tour.durations;
    tour.destinationId = destinationId || tour.destinationId;
    tour.tourGuideId = tourGuideId || tour.tourGuideId;
    tour.locationId = locationId || tour.locationId;
    tour.incAndExc = incAndExc || tour.incAndExc;
    tour.image = image || tour.image;
    tour.groupImages = groupImages.length > 0 ? groupImages : tour.groupImages;

    await tour.save();

    await Duration.updateMany(
      { _id: { $in: parsedDurations } },
      { $set: { tourPackageId: id } }
    );

    return res.status(200).json({ message: "Gói tour đã được cập nhật thành công", tour });
  } catch (error) {
    console.error("Lỗi khi cập nhật gói tour:", error);
    return res.status(500).json({ message: "Đã xảy ra lỗi trong quá trình cập nhật gói tour", error: error.message });
  }
};

// API get all tourPacket
const getAllTour = async (req, res) => {
  try {

    const tourpackages = await TourPackage.find({})
      .populate("destinationId", "DestinationName")
      .populate("tourGuideId")
      .populate("locationId", "firstname")
      .populate({
        path: "durations",
        select: "itinerary start_date end_date durationText",
        options: { virtuals: true }
      })
      .exec();

    res.status(200).json(tourpackages);
  } catch (error) {
    console.error("Error fetching tour packages", error);
    res.status(500).json({ message: "Lỗi máy chủ nội bộ." });
  }
};
const getAllTourById = async (req, res) => {
  try {
    const tourPackageId = req.params.id;

    const tourPackage = await TourPackage.findById(tourPackageId)
      .populate("destinationId", "DestinationName")
      .populate("tourGuideId")
      .populate("locationId", "firstname")
      .populate({
        path: "durations",
        select: "itinerary start_date end_date durationText",
        options: { virtuals: true }
      })
      .exec();

    if (!tourPackage) {
      return res.status(404).json({ message: "Tour package not found." });
    }

    res.status(200).json(tourPackage);
  } catch (error) {
    console.error("Error fetching tour package by ID", error);
    res.status(500).json({ message: "Internal server error." });
  }
};

module.exports = {
  createTour,
  deleteTour,
  editTour,
  getAllTour,
  getAllTourById
};
