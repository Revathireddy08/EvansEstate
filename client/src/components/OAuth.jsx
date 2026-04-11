import { GoogleAuthProvider, getAuth, signInWithPopup,signOut } from "firebase/auth";
import { app } from "../firebase";
import { useDispatch } from "react-redux";
import { signInSuccess } from "../redux/user/userSlice";
import { useNavigate } from "react-router";


export default function OAuth() {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const handleGoogleClick = async () => {
  try {
    const auth = getAuth(app);

    // clear previous login
    await signOut(auth);

    const provider = new GoogleAuthProvider();

    provider.setCustomParameters({
      prompt: "select_account",
    });

    const result = await signInWithPopup(auth, provider);
      console.log(result.user.displayName, result.user.email);

      // Send data to backend
      const res = await fetch("https://evansestate.onrender.com/api/auth/google", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          name: result.user.displayName,
          email: result.user.email,
          photo: result.user.photoURL,
        }),
        credentials: "include",
      });

      const data = await res.json();
      console.log("Backend response:", data);

      // Save user in redux
      dispatch(
  signInSuccess({
  _id: data._id || data.user?._id,
  name: data.name || result.user.displayName,
  email: data.email || result.user.email,
  avatar: data.avatar || result.user.photoURL,
})
);

      navigate("/");
    } catch (error) {
      console.log("Could not sign in with Google", error);
    }
  };

  return (
    <button
      onClick={handleGoogleClick}
      type="button"
      className="bg-red-700 text-white p-3 rounded-lg uppercase hover:opacity-50"
    >
      Continue with Google
    </button>
  );
}