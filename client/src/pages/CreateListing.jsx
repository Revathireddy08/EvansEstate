// import { useState } from "react";
// import {
//   getDownloadURL,
//   getStorage,
//   ref,
//   uploadBytesResumable,
// } from "firebase/storage";
// import { app } from "../firebase.js";
// import { useSelector } from "react-redux";
// import { useNavigate } from "react-router-dom";
// import axios from "axios";

// export default function CreateListing() {
//   const { currentUser } = useSelector((state) => state.user);
//   const navigate = useNavigate()
//   const [files, setFiles] = useState([]);
//   const [formData, setFormData] = useState({
//     imageUrls: [],
//     name: "",
//     description: "",
//     address: "",
//     type: "rent",
//     bedrooms: 1,
//     bathrooms: 1,
//     regularPrice: 50,
//     discountPrice: 0,
//     offer: false,
//     sale: false,
//     parking: false,
//     furnished: false,
//   });
//   const [imageUploadError, setImageUploadError] = useState(false);
//   const [uploading, setUploading] = useState(false);
//   const [error, setError] = useState(false);
//   const [loading, setLoading] = useState(false);

//   // console.log('f-data',formData);

//   const handleImageSubmit = (e) => {
//     e.preventDefault();
//     if (files.length > 0 && files.length + formData.imageUrls.length < 7) {
//       setUploading(true);
//       setImageUploadError(false);
//       const promises = [];

//       for (let i = 0; i < files.length; i++) {
//         promises.push(storeImage(files[i]));
//       }
//       Promise.all(promises)
//         .then((urls) => {
//           setFormData({
//             ...formData,
//             imageUrls: formData.imageUrls.concat(urls),
//           });
//           setImageUploadError(false);
//           setUploading(false);
//         })
//         .catch(() => {
//           setImageUploadError("Image upload failed (2 mb max per image)");
//           setUploading(false);
//         });
//     } else {
//       setImageUploadError("You can upload up to 6 images per listing");
//       setUploading(false);
//     }
//   };

//   const storeImage = async (file) => {
//     return new Promise((resolve, reject) => {
//       const storage = getStorage(app);
//       const fileName = new Date().getTime() + file.name;
//       const storageRef = ref(storage, fileName);
//       const uploadTask = uploadBytesResumable(storageRef, file);
//       uploadTask.on(
//         "state_changed",
//         (snapshot) => {
//           const progress =
//             (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
//           console.log(`Upload is ${progress}% done!`);
//         },

//         (error) => {
//           reject(error);
//         },
//         () => {
//           getDownloadURL(uploadTask.snapshot.ref).then((getDownloadURL) => {
//             resolve(getDownloadURL);
//           });
//         }
//       );
//     });
//   };

//   const handleRemoveImage = (index) => {
//     setFormData({
//       ...formData,
//       imageUrls: formData.imageUrls.filter((_, i) => i !== index),
//     });
//   };

//   const handleChange = (e) => {
//     if (e.target.id === "sale" || e.target.id === "rent") {
//       setFormData({
//         ...formData,
//         type: e.target.id,
//       });
//     }

//     if (
//       e.target.id === "parking" ||
//       e.target.id === "furnished" ||
//       e.target.id === "offer"
//     ) {
//       setFormData({
//         ...formData,
//         [e.target.id]: e.target.checked,
//       });
//     }

//     if (
//       e.target.type === "number" ||
//       e.target.type === "text" ||
//       e.target.type === "textarea"
//     ) {
//       setFormData({
//         ...formData,
//         [e.target.id]: e.target.value,
//       });
//     }
//   };

//   console.log("fdata", formData);

//   const handleFormSumbit = async (e) => {
//     e.preventDefault();
//   const api = axios.create({
//   baseURL: "https://evansestate.onrender.com/api",
//   withCredentials: true   
// });
//     try {
//       if (formData.imageUrls.length < 1) {
//         return setError("You must at least upload one image");
//       }

//       if (+formData.regularPrice < +formData.discountPrice) {
//         return setError("Discount price must be lower thand regular price!");
//       }

//       setLoading(true);
//       setError(false);
//       const res = await api.post("/listing/create", {
//   ...formData,
//   userRef: currentUser._id,
// });


//       const data = await res.data
//       console.log("create listing response", data);
//       setLoading(false);
//       if (data.success === false) {
//         setError(data.message);
//       }
//       navigate(`/listing/${data._id}`)
//     } catch (error) {
//       setError(error.message);
//       setLoading(false);
//     }
//   };

//   return (
//     <main className="p-3 max-w-4xl mx-auto">
//       <h1 className="text-3xl font-semibold text-center my-7">Creating List</h1>

//       <form
//         onSubmit={handleFormSumbit}
//         className="flex flex-col sm:flex-row gap-4"
//       >
//         <div className="flex flex-col gap-4 flex-1">
//           <input
//             type="text"
//             placeholder="Name"
//             className="border p-3 rounded-lg"
//             id="name"
//             maxLength={62}
//             minLength={10}
//             required
//             onChange={handleChange}
//             value={formData.name}
//           />
//           <input
//             type="text"
//             placeholder="Address"
//             className="border p-3 rounded-lg"
//             id="address"
//             maxLength={62}
//             minLength={10}
//             required
//             onChange={handleChange}
//             value={formData.address}
//           />
//           <textarea
//             type="text"
//             placeholder="Description"
//             className="border p-3 rounded-lg"
//             id="description"
//             required
//             onChange={handleChange}
//             value={formData.description}
//           />

//           <div className="flex gap-6 flex-wrap">
//             <div className="flex gap-2">
//               <input
//                 type="checkbox"
//                 id="sale"
//                 className="w-5"
//                 onChange={handleChange}
//                 checked={formData.type === "sale"}
//               />
//               <span>Sell</span>
//             </div>

//             <div className="flex gap-2">
//               <input
//                 type="checkbox"
//                 id="rent"
//                 className="w-5"
//                 onChange={handleChange}
//                 checked={formData.type === "rent"}
//               />
//               <span>Rent</span>
//             </div>

//             <div className="flex gap-2">
//               <input
//                 type="checkbox"
//                 id="parking"
//                 className="w-5"
//                 onChange={handleChange}
//                 checked={formData.parking}
//               />
//               <span>Parking Spot</span>
//             </div>

//             <div className="flex gap-2">
//               <input
//                 type="checkbox"
//                 id="furnished"
//                 className="w-5"
//                 onChange={handleChange}
//                 checked={formData.furnished}
//               />
//               <span>Furnished</span>
//             </div>

//             <div className="flex gap-2">
//               <input
//                 type="checkbox"
//                 id="offer"
//                 className="w-5"
//                 onChange={handleChange}
//                 checked={formData.offer}
//               />
//               <span>Offer</span>
//             </div>
//           </div>

//           <div className="flex flex-wrap gap-6">
//             <div className="flex items-center gap-2">
//               <input
//                 type="number"
//                 id="bedrooms"
//                 min="1"
//                 max="10"
//                 required
//                 className="p-3 border border-gray-300 rounded-lg"
//                 onChange={handleChange}
//                 value={formData.bedrooms}
//               />
//               <p>Beds</p>
//             </div>

//             <div className="flex items-center gap-2">
//               <input
//                 type="number"
//                 id="bathrooms"
//                 min="1"
//                 max="10"
//                 required
//                 className="p-3 border border-gray-300 rounded-lg"
//                 onChange={handleChange}
//                 value={formData.bathrooms}
//               />
//               <p>Baths</p>
//             </div>

//             <div className="flex items-center gap-2">
//               <input
//                 type="number"
//                 id="regularPrice"
//                 min={50}
//                 max={10000000}
//                 required
//                 className="p-3 border border-gray-300 rounded-lg"
//                 onChange={handleChange}
//                 value={formData.regularPrice}
//               />
//               <div className="flex flex-col items-center">
//                 <p>Regular Price</p>
//                 <span className="text-sm">($ / month)</span>
//               </div>
//             </div>

//             {/* SHOW DISCOUNTED PRICE ONLY WHEN THERE'S AN OFFER */}
//             {formData.offer && (
//               <div className="flex items-center gap-2">
//                 <input
//                   type="number"
//                   id="discountPrice"
//                   min={0}
//                   max={10000000}
//                   required
//                   className="p-3 border border-gray-300 rounded-lg"
//                   onChange={handleChange}
//                   value={formData.discountPrice}
//                 />
//                 <div className="flex flex-col items-center">
//                   <p>Discount Price</p>
//                   <span className="text-sm">($ / month)</span>
//                 </div>
//               </div>
//             )}
//           </div>
//         </div>

//         <div className="flex flex-col flex-1  gap-4">
//           <p className="font-semibold">
//             Images:
//             <span className="font-normal text-gray-600 ml-2">
//               The first image will be the cover (max 6)
//             </span>
//           </p>

//           <div className="flex gap-4">
//             <input
//               onChange={(e) => setFiles(e.target.files)}
//               className="p-3 border border-gray-300 rounded-lg w-full"
//               type="file"
//               id="images"
//               accept="image/*"
//               multiple
//             />
//             <button
//               type="button"
//               onClick={handleImageSubmit}
//               className="p-3 text-green-700 border border-yellow-300 rounded-lg uppercase hover:bg-green-200 hover:shadow-lg disabled:opacity-80"
//               disabled={uploading}
//             >
//               {uploading ? "Uploading..." : "Upload"}
//             </button>
//           </div>
//           <p className="text-sm text-red-700">
//             {imageUploadError && imageUploadError}
//           </p>
//           {formData.imageUrls.length > 0 &&
//             formData.imageUrls.map((url, index) => (
//               // <img key={url} src={url} alt="listing image" className="w-40 h-40 object-cover rounded-lg" />
//               <div
//                 key={url}
//                 className="flex justify-between p-3 border items-center"
//               >
//                 <img
//                   src={url}
//                   alt="Listing Image"
//                   className="w-20 h-20 object-contain rounded-lg"
//                 />
//                 <button
//                   type="button"
//                   onClick={() => handleRemoveImage(index)}
//                   className="p-3 text-red-700 rounded-lg uppercase hover:opacity-75"
//                 >
//                   Delete
//                 </button>
//               </div>
//             ))}

//           <button
//             disabled={loading || uploading}
//             className="p-3 bg-slate-700 text-white rounded-lg uppercase hover:opacity-95 disabled:opacity-80"
//           >
//             {loading ? "Creating..." : "Create Listing"}
//           </button>
//           {error && <p className="text-red-700 text-sm">{error}</p>}
//         </div>
//       </form>
//     </main>
//   );
// }



import { useState } from "react";
import {
  getDownloadURL,
  getStorage,
  ref,
  uploadBytesResumable,
} from "firebase/storage";
import { app } from "../firebase.js";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import axios from "axios";

// Create axios instance outside component to avoid recreating on each render
const api = axios.create({
baseURL: "https://mern-estate-backend-iz4a.onrender.com/api",
  withCredentials: true,
  headers: {
    "Content-Type": "application/json",
  },
});

export default function CreateListing() {
  const { currentUser } = useSelector((state) => state.user);
  const navigate = useNavigate();
  const [files, setFiles] = useState([]);
  const [formData, setFormData] = useState({
    imageUrls: [],
    name: "",
    description: "",
    address: "",
    type: "rent",
    bedrooms: 1,
    bathrooms: 1,
    regularPrice: 50,
    discountPrice: 0,
    offer: false,
    parking: false,
    furnished: false,
  });
  const [imageUploadError, setImageUploadError] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState(false);
  const [loading, setLoading] = useState(false);

 const handleImageSubmit = (e) => {
  e.preventDefault();

  if (files.length > 0 && files.length + formData.imageUrls.length < 7) {

    // ✅ check each file size (2MB max)
    for (let i = 0; i < files.length; i++) {
      if (files[i].size > 2 * 1024 * 1024) {
        setImageUploadError("Each image must be less than 2 MB");
        return;
      }
    }

    setUploading(true);
    setImageUploadError(false);

    const promises = [];

    for (let i = 0; i < files.length; i++) {
      promises.push(storeImage(files[i]));
    }

    Promise.all(promises)
      .then((urls) => {
        setFormData({
          ...formData,
          imageUrls: formData.imageUrls.concat(urls),
        });
        setImageUploadError(false);
        setUploading(false);
      })
      .catch(() => {
        setImageUploadError("Image upload failed (2 MB max per image)");
        setUploading(false);
      });

  } else {
    setImageUploadError("You can upload up to 6 images per listing");
    setUploading(false);
  }
};
  const storeImage = async (file) => {
  return new Promise(async (resolve, reject) => {
    try {
      const data = new FormData();
      data.append("file", file);
      data.append("upload_preset", "my_preset");

      const res = await fetch(
        "https://api.cloudinary.com/v1_1/dn2ofrcd0/image/upload",
        {
          method: "POST",
          body: data,
        }
      );

      const uploadedImage = await res.json();

      console.log("Upload successful:", uploadedImage.secure_url);

      resolve(uploadedImage.secure_url);
    } catch (error) {
      console.log("Upload error:", error);
      reject(error);
    }
  });
};
  const handleRemoveImage = (index) => {
    setFormData({
      ...formData,
      imageUrls: formData.imageUrls.filter((_, i) => i !== index),
    });
  };

  const handleChange = (e) => {
    if (e.target.id === "sale" || e.target.id === "rent") {
      setFormData({
        ...formData,
        type: e.target.id,
      });
    }

    if (
      e.target.id === "parking" ||
      e.target.id === "furnished" ||
      e.target.id === "offer"
    ) {
      setFormData({
        ...formData,
        [e.target.id]: e.target.checked,
      });
    }

    if (
      e.target.type === "number" ||
      e.target.type === "text" ||
      e.target.type === "textarea"
    ) {
      setFormData({
        ...formData,
        [e.target.id]: e.target.value,
      });
    }
  };

  console.log("Current formData:", formData);
  console.log("Current user:", currentUser);

  const handleFormSubmit = async (e) => {
    e.preventDefault();
    
    try {
      // Validation
      if (formData.imageUrls.length < 1) {
        return setError("You must upload at least one image");
      }

      if (+formData.regularPrice < +formData.discountPrice) {
        return setError("Discount price must be lower than regular price!");
      }

      // Check if user is logged in
      if (!currentUser) {
        setError("You must be logged in to create a listing");
        return navigate("/sign-in");
      }

      setLoading(true);
      setError(false);

      // Debug: Check cookies
      console.log("Document cookies:", document.cookie);
      console.log("Sending request with data:", {
        ...formData,
        userRef: currentUser._id,
      });

      // Make the API request
      const response = await axios.post("/api/listing/create", {
        ...formData,
        userRef: currentUser._id,
      });

      console.log("Create listing response:", response.data);
      
      // Navigate to the new listing page
      navigate(`/listing/${response.data._id}`);
      
    } catch (err) {
      console.error("Error creating listing:", {
        message: err.message,
        response: err.response,
        status: err.response?.status,
        data: err.response?.data,
      });

      // Handle specific error cases
      if (err.response?.status === 401) {
        setError("Session expired. Please login again.");
        // Optional: Redirect to login
        // navigate("/sign-in");
      } else if (err.response?.status === 403) {
        setError("You don't have permission to create a listing");
      } else if (err.response?.status === 500) {
        setError("Server error. Please try again later.");
      } else {
        setError(err.response?.data?.message || err.message || "Failed to create listing");
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="p-3 max-w-4xl mx-auto">
      <h1 className="text-3xl font-semibold text-center my-7">
        {currentUser ? "Create a Listing" : "Please login to create a listing"}
      </h1>

      {!currentUser && (
        <div className="text-center">
          <button
            onClick={() => navigate("/sign-in")}
            className="bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-600"
          >
            Go to Login
          </button>
        </div>
      )}

      {currentUser && (
        <form
          onSubmit={handleFormSubmit}
          className="flex flex-col sm:flex-row gap-4"
        >
          <div className="flex flex-col gap-4 flex-1">
            <input
              type="text"
              placeholder="Name"
              className="border p-3 rounded-lg"
              id="name"
              maxLength={62}
              minLength={10}
              required
              onChange={handleChange}
              value={formData.name}
            />
            <input
              type="text"
              placeholder="Address"
              className="border p-3 rounded-lg"
              id="address"
              maxLength={62}
              minLength={10}
              required
              onChange={handleChange}
              value={formData.address}
            />
            <textarea
              type="text"
              placeholder="Description"
              className="border p-3 rounded-lg"
              id="description"
              required
              onChange={handleChange}
              value={formData.description}
            />

            <div className="flex gap-6 flex-wrap">
              <div className="flex gap-2">
                <input
                  type="checkbox"
                  id="sale"
                  className="w-5"
                  onChange={handleChange}
                  checked={formData.type === "sale"}
                />
                <span>Sell</span>
              </div>

              <div className="flex gap-2">
                <input
                  type="checkbox"
                  id="rent"
                  className="w-5"
                  onChange={handleChange}
                  checked={formData.type === "rent"}
                />
                <span>Rent</span>
              </div>

              <div className="flex gap-2">
                <input
                  type="checkbox"
                  id="parking"
                  className="w-5"
                  onChange={handleChange}
                  checked={formData.parking}
                />
                <span>Parking Spot</span>
              </div>

              <div className="flex gap-2">
                <input
                  type="checkbox"
                  id="furnished"
                  className="w-5"
                  onChange={handleChange}
                  checked={formData.furnished}
                />
                <span>Furnished</span>
              </div>

              <div className="flex gap-2">
                <input
                  type="checkbox"
                  id="offer"
                  className="w-5"
                  onChange={handleChange}
                  checked={formData.offer}
                />
                <span>Offer</span>
              </div>
            </div>

            <div className="flex flex-wrap gap-6">
              <div className="flex items-center gap-2">
                <input
                  type="number"
                  id="bedrooms"
                  min="1"
                  max="10"
                  required
                  className="p-3 border border-gray-300 rounded-lg"
                  onChange={handleChange}
                  value={formData.bedrooms}
                />
                <p>Beds</p>
              </div>

              <div className="flex items-center gap-2">
                <input
                  type="number"
                  id="bathrooms"
                  min="1"
                  max="10"
                  required
                  className="p-3 border border-gray-300 rounded-lg"
                  onChange={handleChange}
                  value={formData.bathrooms}
                />
                <p>Baths</p>
              </div>

              <div className="flex items-center gap-2">
                <input
                  type="number"
                  id="regularPrice"
                  min={50}
                  max={10000000}
                  required
                  className="p-3 border border-gray-300 rounded-lg"
                  onChange={handleChange}
                  value={formData.regularPrice}
                />
                <div className="flex flex-col items-center">
                  <p>Regular Price</p>
                  <span className="text-sm">($ / month)</span>
                </div>
              </div>

              {formData.offer && (
                <div className="flex items-center gap-2">
                  <input
                    type="number"
                    id="discountPrice"
                    min={0}
                    max={10000000}
                    required
                    className="p-3 border border-gray-300 rounded-lg"
                    onChange={handleChange}
                    value={formData.discountPrice}
                  />
                  <div className="flex flex-col items-center">
                    <p>Discount Price</p>
                    <span className="text-sm">($ / month)</span>
                  </div>
                </div>
              )}
            </div>
          </div>

          <div className="flex flex-col flex-1 gap-4">
            <p className="font-semibold">
              Images:
              <span className="font-normal text-gray-600 ml-2">
                The first image will be the cover (max 6)
              </span>
            </p>

            <div className="flex gap-4">
              <input
                onChange={(e) => setFiles(e.target.files)}
                className="p-3 border border-gray-300 rounded-lg w-full"
                type="file"
                id="images"
                accept="image/*"
                multiple
              />
              <button
                type="button"
                onClick={handleImageSubmit}
                className="p-3 text-green-700 border border-yellow-300 rounded-lg uppercase hover:bg-green-200 hover:shadow-lg disabled:opacity-80"
                disabled={uploading}
              >
                {uploading ? "Uploading..." : "Upload"}
              </button>
            </div>
            
            <p className="text-sm text-red-700">
              {imageUploadError && imageUploadError}
            </p>
            
            {formData.imageUrls.length > 0 &&
              formData.imageUrls.map((url, index) => (
                <div
                  key={url}
                  className="flex justify-between p-3 border items-center"
                >
                  <img
                    src={url}
                    alt="Listing"
                    className="w-20 h-20 object-contain rounded-lg"
                  />
                  <button
                    type="button"
                    onClick={() => handleRemoveImage(index)}
                    className="p-3 text-red-700 rounded-lg uppercase hover:opacity-75"
                  >
                    Delete
                  </button>
                </div>
              ))}

            <button
              disabled={loading || uploading}
              className="p-3 bg-slate-700 text-white rounded-lg uppercase hover:opacity-95 disabled:opacity-80"
            >
              {loading ? "Creating..." : "Create Listing"}
            </button>
            
            {error && (
              <p className="text-red-700 text-sm bg-red-50 p-2 rounded">
                {error}
              </p>
            )}
          </div>
        </form>
      )}
    </main>
  );
}