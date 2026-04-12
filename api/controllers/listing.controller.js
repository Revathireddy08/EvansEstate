import Listing from "../models/listing.model.js"
import { errorHandler } from "../utils/error.js"

export const createListing = async (req, res, next) => {
  try {
    const listing = await Listing.create({
      ...req.body,
      userRef: req.user.id, // 🔥 ADD HERE (IMPORTANT)
    });

    return res.status(201).json(listing);
  } catch (error) {
    next(error);
  }
};

export const deleteListing = async (req, res, next) => {
  const listing = await Listing.findById(req.params.id);

  if(!listing) {
    return next(errorHandler(404, 'Listing not found!'))
  }

  if (req.user.id !== listing.userRef.toString()) {
    return next(errorHandler(401, 'You can only delete your own listings'))
  }

  try {
    await Listing.findByIdAndDelete(req.params.id);
    res.status(200).json('Listing has been deleted successfully!');
  } catch (error) {
    next(error)
  }
}

export const updateListing = async (req, res, next) => {
  const listing = await Listing.findById(req.params.id)

  if(!listing) {
    return next(errorHandler(404, 'Listing Not Found!'))
  }

if (req.user.id !== listing.userRef.toString()) {
      return next(errorHandler(401, 'You can only update your own listings'))
  }

  try {
    const updatedListing = await Listing.findByIdAndUpdate(
      req.params.id,
      req.body,
      {new: true}
    );
    res.status(200).json(updatedListing)
  } catch (error) {
    next(error)
  }
}

export const getListing = async (req, res, next) => {
  try {
    const listing = await Listing.findById(req.params.id);
    if(!listing) {
      return next(errorHandler(404, 'Listing not found'))
    }
    res.status(200).json(listing)
  } catch (error) {
    next(error)
  }
}

export const getListings = async (req, res, next) => {
  try {
    const limit = parseInt(req.query.limit) || 9;
    const startIndex = parseInt(req.query.startIndex) || 0;

    let offer = req.query.offer;
    if (offer === undefined || offer === 'false') {
      offer = {$in: [false, true]}
    }

    let furnished = req.query.furnished;
    if(furnished === undefined || furnished === 'false') {
      furnished = {$in: [false, true]}
    }

    let parking = req.query.parking;
    if(parking === undefined || parking === 'false') {
      parking = {$in: [false, true]}
    }

    let type = req.query.type;
    if(type === undefined || type === 'all') {
      type = {$in: ['sale', 'rent']}
    }

const searchTerm = req.query.searchTerm || "";
const cleanedSearch = searchTerm
  .toLowerCase()
  .replace("near", "")
  .replace("homes", "")
  .replace("house", "")
  .replace("property", "")
  .replace("properties", "")
  .replace("cheap", "");

const words = cleanedSearch.trim().split(/\s+/);
let locationKeyword = null;
let maxPrice = null;
let bedrooms = null;
let furnishedFilter = null;
let parkingFilter = null;
let offerFilter = null;

// detect keywords
words.forEach((word, index) => {

  // price detection (under 20000)
  if (word === "under" && words[index + 1]) {
    maxPrice = parseInt(words[index + 1]);
  }

  // bedrooms detection (2bhk or 3bhk)
  if (word.includes("bhk") || words[index + 1] === "bhk") {
  bedrooms = parseInt(word);
}

  if (word === "furnished") {
    furnishedFilter = true;
  }

  if (word === "parking") {
    parkingFilter = true;
  }

  if (word === "offer") {
    offerFilter = true;
  }

 if (
  !["under","bhk","furnished","parking","offer","rent","sale"].includes(word) &&
  isNaN(word)
) {
  locationKeyword = word;
}
});
    const sort = req.query.sort || 'createdAt';

    const order = req.query.order || 'desc';

    const listings = await Listing.find({
  $or: [
    { name: { $regex: searchTerm, $options: "i" } },
    { address: { $regex: locationKeyword || searchTerm, $options: "i" } },
    { description: { $regex: searchTerm, $options: "i" } },
  ],

  ...(maxPrice && { regularPrice: { $lte: maxPrice } }),
  ...(bedrooms && { bedrooms }),
  ...(furnishedFilter !== null && { furnished: furnishedFilter }),
  ...(parkingFilter !== null && { parking: parkingFilter }),
  ...(offerFilter !== null && { offer: offerFilter }),

  type,
})
.sort({ [sort]: order })
.limit(limit)
.skip(startIndex);

    return res.status(200).json(listings)
    
  } catch (error) {
    next(error)
  }
}