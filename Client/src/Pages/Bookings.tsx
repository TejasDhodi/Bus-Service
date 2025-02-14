import React, { useEffect, useState } from "react";
import UseFetch from "../CustomHooks/UseFetch";
import axios from "axios";

type book = {
  id: string,
  userEmail: string;
  status: string;
  seats: string[];
  origin: string, 
  destination: string, 
  departureTime: string
};
type bookingType = {
  bookings: book[];
};
const Bookings = () => {
  const [tableData, setTableData] = useState<book[]>([]);
  const [reload, setReload] = useState<boolean>(false);

  const { data, loading } = UseFetch<bookingType>(
    `${import.meta.env.VITE_APP_URL}bookings`,
    reload  
  );

  // Function to handle search filter
  const handleSearchFilter = (e : React.ChangeEvent<HTMLInputElement>) => {
    if(e.target.value === '') {
        setTableData(data?.bookings || []);
    } else {
        const filteredData = tableData.filter(item => item.userEmail.toLocaleLowerCase().includes(e.target.value));
        setTableData(filteredData);
    }
  }

  // Function to cancel booking
  const handleCancelBooking = async (busId: string) => {
    try {
      const { status } = await axios.post(
        `${import.meta.env.VITE_APP_URL}booking/${busId}/cancel`
      );
  
      if (status === 200) {
        setReload(prev => !prev); 
      }
    } catch (error: unknown) {
      if (axios.isAxiosError(error) && error.response) {
        alert(error.response.data.message); // Ensure data and message exist
        console.log(error.response.data);
      } else {
        console.error("Unexpected error:", error);
      }
    }
  };

  useEffect(() => {
    if (data?.bookings) {
      setTableData(data?.bookings);
    }
  }, [data]);

  return (
    <>
      {loading ? (
        <h1 className="load">Loading...</h1>
      ) : (
        <div style={{textAlign: 'center'}}>
          <input type="search" name="search" className="searchBar" placeholder="Search By Email" onChange={handleSearchFilter}/>
          {
            <table border={1}>
              <thead>
                <tr>
                  <th>Sr No.</th>
                  <th>Email</th>
                  <th>Status</th>
                  <th>Seats</th>
                  <th>Origin</th>
                  <th>Destination</th>
                  <th>Departure Time</th>
                  <th>Action</th>
                </tr>
              </thead>
              <tbody>
                {tableData.map((currElem, index) => {
                  const { id, userEmail, status, seats, origin, destination, departureTime } = currElem;
                  return (
                    <tr key={index}>
                      <td>{index + 1}</td>
                      <td>{userEmail}</td>
                      <td>{status}</td>
                      <td>{seats.toString()}</td>
                      <td>{origin}</td>
                      <td>{destination}</td>
                      <td>{departureTime}</td>
                      <td className="action" onClick={() => handleCancelBooking(id)} style={status === 'CANCELLED' ? {pointerEvents: 'none', opacity: '0.5'}: {}}>Cancel</td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          }
        </div>
      )}
    </>
  );
};

export default Bookings;
