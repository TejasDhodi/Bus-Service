import React, { useState } from "react";
import UseFetch from "../CustomHooks/UseFetch";
import { useNavigate, useParams, useSearchParams } from "react-router-dom";
import axios from "axios";

type seats = {
  availableSeats: { [key: string]: string };
};

const BusBook = () => {
  const [selectedSeat, setSelecteSeat] = useState<string[]>([]);
  const [userEmail, setUserEmail] = useState<null | string>(null);
  const [postLoading, setPostLoading] = useState<boolean>(false);
  const [popup, setPopup] = useState(false);

  const { busId } = useParams();
  const [searchParams] = useSearchParams();

  const origin = searchParams.get("origin");
  const destination = searchParams.get("destination");
  const departureTime = searchParams.get("departureTime");
  
  const { data, loading } = UseFetch<seats>(
    `http://localhost:5000/api/v1/bus/${busId}/seats`
  );

  const availability = data?.availableSeats;

  const navigate = useNavigate();

  // Function to select seats
  const handleSelectSeats = (seat: string, status: string) => {
    if (status === "AVAILABLE") {
      if (selectedSeat.length < 4) {
        if (!selectedSeat.includes(seat)) {
          setSelecteSeat((prev) => [...prev, seat]);
        } else {
          setSelecteSeat((prev) => prev.filter((item) => item !== seat));
        }
      } else {
        alert("can not select more than 4 seats");
      }
    } else {
      alert("this is occupied");
    }
  };

  // Function to validate email
  const validateEmail = (email: string) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  };

  // Function to book seats
  const handleBookSeat = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    try {
      setPostLoading(true);

      if (!userEmail || !validateEmail(userEmail)) {
        alert("Please enter a valid email address");
        setPostLoading(false);
        return;
      }

      if (selectedSeat.length === 0) {
        alert("Please select atleast one seat");
      } else {
        const { status } = await axios.post(
          `http://localhost:5000/api/v1/bus/${busId}/book`,
          { userEmail, seats: selectedSeat, origin, destination, departureTime }
        );

        if (status === 201) {
          navigate("/bookings");
          setPostLoading(false);
        }
      }
    } catch (error: unknown) {
      if (axios.isAxiosError(error) && error.response) {
        alert(error.response.data.message);
        console.log(error.response.data);
      } else {
        console.error("Unexpected error:", error);
      }
    }
  };

  return (
    <>
      {loading ? (
        <h1 className="load">Loading...</h1>
      ) : (
        <div style={{ textAlign: "center" }}>
          <div className="indicators">
            <h3>
              Available <p className="available"></p>
            </h3>
            <h3>
              Reserved <p className="reserved"></p>
            </h3>
          </div>
          <div className="busSeats">
            {availability &&
              Object.entries(availability).map(([seat, status], index) => {
                const isSelected = selectedSeat.includes(seat);
                return (
                  <button
                    value={seat}
                    className={
                      status === "AVAILABLE"
                        ? isSelected
                          ? "selected available seats"
                          : "available seats"
                        : "reserved seats"
                    }
                    onClick={() => handleSelectSeats(seat, status)}
                    key={index}
                  >
                    {seat}
                  </button>
                );
              })}
          </div>
          <button onClick={() => setPopup(true)}>Book Now</button>
          <div
            className={popup ? "overlay show" : "overlay"}
            onClick={() => setPopup(false)}
          ></div>
          <form className={popup ? "askEmail show" : "askEmail"} onSubmit={handleBookSeat}>
            <h1>Enter Email Address</h1>
            <input
              type="email"
              name="email"
              id=""
              onChange={(e) => setUserEmail(e.target.value)}
            />
            <button type="submit">
              {postLoading ? "..." : "Book"}
            </button>
          </form>
        </div>
      )}
    </>
  );
};

export default BusBook;
