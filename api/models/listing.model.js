import mongoose from "mongoose";

const listingSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
    },
    description: {
      type: String,
      required: true,
    },
    address: {
      type: String,
      required: true,
    },
    regularPrice: {
      type: Number,
      required: true,
    },
    discountPrice: {
      type: Number,
      default: 0,
    },
    bathrooms: {
      type: Number,
      required: true,
    },
    bedrooms: {
      type: Number,
      required: true,
    },
    furnished: {
      type: Boolean,
      required: true,
    },
    parking: {
      type: Boolean,
      required: true,
    },
    type: {
      type: String,
      required: true,
    },
    offer: {
      type: Boolean,
      required: true,
    },
    imageUrls: {
      type: Array,
      required: true,
    },
    userRef: {
      type: String,
      required: true,
    },
  },
  {
    timestamps: true,
  }
);

// 🔹 Indexes for faster search
listingSchema.index({ name: "text", description: "text", address: "text" }); // full text search
listingSchema.index({ regularPrice: 1 });  // price filter
listingSchema.index({ bedrooms: 1 });      // bedrooms filter
listingSchema.index({ furnished: 1 });     // furnished filter
listingSchema.index({ parking: 1 });       // parking filter
listingSchema.index({ offer: 1 });         // offer filter

const Listing = mongoose.model("Listing", listingSchema);

export default Listing;