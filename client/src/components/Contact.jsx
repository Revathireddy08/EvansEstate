import { useEffect, useState } from 'react';
import PropTypes from 'prop-types';

export default function Contact({ listing }) {
  const [landlord, setLandlord] = useState(null);
  const [message, setMessage] = useState('');

  const onChange = (e) => {
    setMessage(e.target.value);
  };

  useEffect(() => {
    const fetchLandlord = async () => {
      try {
const res = await fetch(`http://localhost:5000/api/user/${listing.userRef}`, {
  credentials: "include",
});        const data = await res.json();
        setLandlord(data);
      } catch (error) {
        console.log(error);
      }
    };
    fetchLandlord();
  }, [listing.userRef]);

  const mailLink = landlord
    ? `mailto:${landlord.email}?subject=${encodeURIComponent(
        `Regarding ${listing.name}`
      )}&body=${encodeURIComponent(message)}`
    : '#';

  return (
    <>
      {landlord && (
        <div className="flex flex-col gap-2">
          <p>
            Contact{' '}
            <span className="font-semibold">
              {landlord.username || landlord.name}
            </span>{' '}
            for{' '}
            <span className="font-semibold">
              {listing.name.toLowerCase()}
            </span>
          </p>

          <textarea
            name="message"
            id="message"
            rows="2"
            value={message}
            onChange={onChange}
            placeholder="Enter your message here..."
            className="w-full border p-3 rounded-lg"
          ></textarea>

          <a
            href={landlord?.email ? mailLink : '#'}
            className="bg-slate-700 text-white text-center p-3 uppercase rounded-lg hover:opacity-95"
            onClick={(e) => {
              if (!landlord?.email) {
                e.preventDefault();
                alert("Email not loaded yet. Please wait.");
              }
            }}
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