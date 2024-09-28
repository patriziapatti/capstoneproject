import React, { useEffect, useState } from "react";
import { Card } from "react-bootstrap";
import { getTodaysInHouse, getAllRooms } from "../data/fetch";

const InHouseSummary = () => {
  const [totalRooms, setTotalRooms] = useState(0); 
  const [inHouseRooms, setInHouseRooms] = useState(0); 
  const [totalGuests, setTotalGuests] = useState(0); // Totale ospiti in arrivo

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [roomsData, inHouseData] = await Promise.all([getAllRooms(), getTodaysInHouse()]);

        setTotalRooms(roomsData); // Imposta il numero totale di camere

        const inHouse = inHouseData.inHouseToday;
        setInHouseRooms(inHouse.length); // Numero camere in arrivo

        // Calcola il totale degli ospiti
        const guests = inHouse.reduce((total, inh) => total + (inh.pax.adults + inh.pax.children), 0);
        setTotalGuests(guests);
      } catch (error) {
        console.error("Errore nel recupero dei dati:", error);
      }
    };

    fetchData();
  }, []);

  return (
    <div className="d-flex justify-content-between">
    <Card className="text-center my-4">
      <Card.Body>
        <Card.Title>In House</Card.Title>
        <Card.Text>
          <strong>Camere in House:</strong> {inHouseRooms} su {totalRooms}
        </Card.Text>
        <Card.Text>
          <strong>Totale ospiti:</strong> {totalGuests}
        </Card.Text>
      </Card.Body>
    </Card>
    </div>
  );
};

export default InHouseSummary;