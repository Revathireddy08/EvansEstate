import { useEffect, useState } from 'react';
import PropTypes from 'prop-types';
import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";

export default function Contact({ listing }) {
  const [landlord, setLandlord] = useState(null);
  const [message, setMessage] = useState('');
const { currentUser } = useSelector((state) => state.user);
const navigate = useNavigate();
  const onChange = (e) => {
    setMessage(e.target.value);
  };

  useEffect(() => {
    const fetchLandlord = async () => {
      try {
const res = await fetch(`https://evansestate.onrender.com/api/user/${listing.userRef}`, {  credentials: "include",
});        const data = await res.json();
        setLandlord(data);
      } catch (error) {
        console.log(error);
      }
    };
    fetchLandlord();
}, [listing?.userRef]);
  const mailLink = landlord?.email
  ? `mailto:${landlord.email}?subject=${encodeURIComponent(
      `Regarding ${listing?.name}`
    )}&body=${encodeURIComponent(message)}`
  : "#";
 return (
  <>
    {landlord && (
      <div className="flex flex-col gap-2">
        <p>
          Contact{" "}
          <span className="font-semibold">
            {landlord.username || landlord.name}
          </span>{" "}
          for{" "}
          <span className="font-semibold">
            {listing?.name?.toLowerCase()}
          </span>
        </p>

        <textarea
          rows="2"
          value={message}
          onChange={onChange}
          placeholder="Enter your message here..."
          className="w-full border p-3 rounded-lg"
        />

       <a
  href={mailLink || "#"}
  onClick={(e) => {
    if (!currentUser) {
      e.preventDefault();
      alert("Please sign in to contact landlord");
      navigate("/sign-in");
      return;
    }

    if (!message.trim()) {
      e.preventDefault();
      alert("Please enter a message");
    }
  }}
  className="bg-slate-700 text-white text-center p-3 uppercase rounded-lg hover:opacity-95"
>
  Send Message
</a>
      </div>
    )}
  </>
);
}
Contact.propTypes = {
  listing: PropTypes.shape({
    userRef: PropTypes.string.isRequired,
    name: PropTypes.string.isRequired,
  }).isRequired,
};