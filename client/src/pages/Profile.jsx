import { useEffect, useRef, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import {
  getDownloadURL,
  getStorage,
  ref,
  uploadBytesResumable,
} from "firebase/storage";
import { app } from "../firebase";
import {
  deleteUserFailure,
  deleteUserStart,
  deleteUserSuccess,
  signOutUserStart,
  signOutUserSuccess,
  updateUserFailure,
  updateUserStart,
  updateuserSuccess,
} from "../redux/user/userSlice";
import { Link } from "react-router-dom";

export default function Profile() {
  const fileRef = useRef(null);
  const dispatch = useDispatch();
  const { currentUser, loading, error } = useSelector((state) => state.user);
const navigate = useNavigate();
if (!currentUser) {
  return (
    <div className="text-center mt-10 text-gray-500">
      Please sign in to view profile
    </div>
  );
}
  const userId = currentUser?._id || currentUser?.id;

  const [file, setFile] = useState(undefined);
  const [filePerc, setFilePerc] = useState(0);
  const [fileUploadError, setFileUploadError] = useState(false);
  const [formData, setFormData] = useState({});
  const [updateSuccess, setUpdateSuccess] = useState(false);
  const [showListingsError, setShowListingsError] = useState(false);
  const [userListings, setUserListings] = useState([]);
  const [successMessage, setSuccessMessage] = useState("");
  const [showListings, setShowListings] = useState(false);

  const API = "https://evansestate.onrender.com";

  const handleFileUpload = (file) => {
    const storage = getStorage(app);
    const fileName = new Date().getTime() + file.name;
    const storageRef = ref(storage, fileName);
    const uploadTask = uploadBytesResumable(storageRef, file);

    uploadTask.on(
      "state_changed",
      (snapshot) => {
        const progress = Math.round(
          (snapshot.bytesTransferred / snapshot.totalBytes) * 100
        );
        setFilePerc(progress);
      },
      () => {
        setFileUploadError(true);
        setTimeout(() => setFileUploadError(false), 5000);
      },
      () => {
        getDownloadURL(uploadTask.snapshot.ref).then((downloadURL) => {
          setFormData({ ...formData, avatar: downloadURL });
          setFileUploadError(false);
          setSuccessMessage("Image successfully uploaded!");
          setTimeout(() => setSuccessMessage(""), 5000);
        });
      }
    );
  };

  useEffect(() => {
    if (file) handleFileUpload(file);
  }, [file]);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.id]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const confirmUpdate = window.confirm("Are you sure you want to update profile?");
    if (!confirmUpdate) return;

    try {
      dispatch(updateUserStart());

      const res = await fetch(`${API}/api/user/update/${userId}`, {
        method: "PUT",
        credentials: "include",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      });

      const data = await res.json();

      if (!res.ok) {
        dispatch(updateUserFailure(data.message));
        return;
      }

      dispatch(updateuserSuccess(data));
      setUpdateSuccess(true);

      setSuccessMessage("Profile updated successfully!");
      setTimeout(() => setSuccessMessage(""), 3000);
    } catch (error) {
      dispatch(updateUserFailure(error.message));
    }
  };

  const handleDeleteUser = async () => {
    const confirmDelete = window.confirm("Are you sure you want to delete your account?");
    if (!confirmDelete) return;

    try {
      dispatch(deleteUserStart());

      const res = await fetch(`${API}/api/user/delete/${userId}`, {
        method: "DELETE",
        credentials: "include",
      });

      const data = await res.json();

      if (data.success === false) {
        dispatch(deleteUserFailure(data.message));
        return;
      }

      dispatch(deleteUserSuccess());

      setSuccessMessage("User has been deleted successfully!");
      setTimeout(() => setSuccessMessage(""), 3000);
    } catch (error) {
      dispatch(deleteUserFailure(error.message));
    }
  };

  const handleSignOut = async () => {
  const confirmLogout = window.confirm("Are you sure you want to sign out?");
  if (!confirmLogout) return;

  try {
    dispatch(signOutUserStart());

    const res = await fetch(`${API}/api/auth/signout`, {
      credentials: "include",
    });

    const data = await res.json();

    if (data.success === false) {
      dispatch(deleteUserFailure(data.message));
      return;
    }

    dispatch(signOutUserSuccess());

    setSuccessMessage("Signed out successfully!");

    setTimeout(() => {
      navigate("/signin");
    }, 500); // small delay so message shows
  } catch (error) {
    dispatch(deleteUserFailure(error.message));
  }
};

  const handleShowListings = async () => {
    setShowListings(true);

    try {
      setShowListingsError(false);

      const res = await fetch(`${API}/api/user/listings/${userId}`, {
        credentials: "include",
      });

      const data = await res.json();

      if (data.success === false) {
        setShowListingsError(true);
        return;
      }

      setUserListings(data);
    } catch (error) {
      setShowListingsError(true);
    }
  };

  const handleListingDelete = async (listingId) => {
    const confirmDelete = window.confirm("Are you sure you want to delete this listing?");
    if (!confirmDelete) return;

    try {
      const res = await fetch(`${API}/api/listing/delete/${listingId}`, {
        method: "DELETE",
        credentials: "include",
      });

      const data = await res.json();

      if (data.success === false) {
        console.log(data.message);
        return;
      }

      setUserListings((prev) =>
        prev.filter((listing) => listing._id !== listingId)
      );

      setSuccessMessage("Listing deleted successfully!");
      setTimeout(() => setSuccessMessage(""), 5000);
    } catch (error) {
      console.log(error.message);
    }
  };

  return (
    <div className="p-3 max-w-lg mx-auto">
      <h1 className="text-3xl font-semibold text-center my-7">Profile</h1>

      <form onSubmit={handleSubmit} className="flex flex-col gap-4">
        <input
          onChange={(e) => setFile(e.target.files[0])}
          type="file"
          ref={fileRef}
          hidden
          accept="image/*"
        />

        <img
          onClick={() => fileRef.current.click()}
          src={formData.avatar || currentUser?.avatar}
          alt="profile"
          className="rounded-full h-24 w-24 object-cover cursor-pointer self-center mt-2"
        />

        <input
          type="text"
          id="username"
          defaultValue={currentUser?.username || currentUser?.name}
          className="border p-3 rounded-lg"
          onChange={handleChange}
        />

        <input
          type="email"
          id="email"
          defaultValue={currentUser?.email}
          className="border p-3 rounded-lg"
          onChange={handleChange}
        />

        <input
          type="password"
          id="password"
          placeholder="Enter new password"
          className="border p-3 rounded-lg"
          onChange={handleChange}
        />

        <button
          disabled={loading}
          className="bg-slate-700 text-white p-3 rounded-lg uppercase"
        >
          {loading ? "Loading..." : "Update"}
        </button>

        <Link
          to="/create-listing"
          className="bg-green-700 text-white p-3 rounded-lg text-center"
        >
          Create Listing
        </Link>
      </form>

      <div className="flex justify-between mt-5">
        <span onClick={handleDeleteUser} className="text-red-700 cursor-pointer">
          Delete Account
        </span>
        <span onClick={handleSignOut} className="text-red-700 cursor-pointer">
          Sign Out
        </span>
      </div>

      <button className="text-green-700 w-full mt-5" onClick={handleShowListings}>
        Show Listings
      </button>

      {showListings && (
        <>
          {showListingsError ? (
            <p className="text-red-500 text-center mt-4">Failed to load listings</p>
          ) : userListings.length === 0 ? (
            <p className="text-gray-500 text-center mt-4">No listings created yet</p>
          ) : (
            userListings.map((listing) => (
              <div
                key={listing._id}
                className="border p-3 flex justify-between mt-4 items-center"
              >
                <img
                  src={listing.imageUrls[0]}
                  className="w-16 h-16 object-cover rounded"
                  alt="listing"
                />

                <p className="flex-1 ml-3">{listing.name}</p>

                <div className="flex gap-3">
                  <Link
                    to={`/update-listing/${listing._id}`}
                    className="text-green-700"
                  >
                    Edit
                  </Link>

                  <button
                    onClick={() => handleListingDelete(listing._id)}
                    className="text-red-700"
                  >
                    Delete
                  </button>
                </div>
              </div>
            ))
          )}
        </>
      )}

      <p className="text-green-700">{successMessage}</p>
      <p className="text-red-700">{error}</p>
    </div>
  );
}