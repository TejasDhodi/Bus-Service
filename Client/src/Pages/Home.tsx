import { useEffect, useState } from "react";
import UseFetch from "../CustomHooks/UseFetch";
import { useNavigate } from "react-router-dom";

type Bus = {
  departureTime: string;
  destination: string;
  id: number;
  origin: string;
  route: string;
  totalSeats: number;
  seats: { [key: string]: string };
};

type busData = {
  bus: Bus[];
};

const Home = () => {
  const [availableSeats, setAvailableSeats] = useState<{[key: number]: number;}>({});

  const { data, loading } = UseFetch<busData>(`${import.meta.env.VITE_APP_URL}allBus`);

  const navigate = useNavigate();

  useEffect(() => {
    if (data) {
      const newAvailableSeats: { [key: number]: number } = {};
      data.bus.forEach((currElem) => {
        const seatNumbers = Object.values(currElem.seats).filter(
          (value) => value === "AVAILABLE"
        ).length;
        newAvailableSeats[currElem.id] = seatNumbers;
      });

      setAvailableSeats(newAvailableSeats);
    }
  }, [data]);
  return (
    <>
      {loading ? (
        <h1 className="load" >Loading...</h1>
      ) : (
        <div className="busContainer">
          {data?.bus.map((currElem, index) => {
            const {
              departureTime,
              destination,
              id,
              origin,
              totalSeats,
            } = currElem;

            return (
              <div className="busCard" key={index}>
                <div className="leftSide">
                  <img
                    src="https://media.istockphoto.com/id/1334432107/photo/electric-bus-with-charging-station.webp?a=1&b=1&s=612x612&w=0&k=20&c=H1C2apK-tCU8Eob80ArqEFMhQqP8t_sfelrFoZkCAZU="
                    alt=""
                  />
                  <img
                    src="https://images.unsplash.com/photo-1532939163844-547f958e91b4?w=900&auto=format&fit=crop&q=60&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MTF8fGJ1c3xlbnwwfHwwfHx8MA%3D%3D"
                    alt=""
                  />
                </div>
                <div className="rightSide">
                  <p className="origin">
                    <span>From : </span>
                    {origin}
                  </p>
                  <p className="source">
                    <span>To : </span>
                    {destination}
                  </p>
                  <p>
                    <span>Departure Time : </span>
                    {departureTime}
                  </p>
                  <p>
                    <span>Total Seats : </span>
                    {totalSeats}
                  </p>
                  <p>
                    <span>Available Seats : </span>
                    {availableSeats[id]}
                  </p>
                  <button onClick={() => navigate(`/book/${id}?origin=${origin}&destination=${destination}&departureTime=${departureTime}`)}>Book Now</button>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </>
  );
};

export default Home;
