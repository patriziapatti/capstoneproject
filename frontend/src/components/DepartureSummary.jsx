import React, { useEffect, useState } from "react";
import { Card } from "react-bootstrap";
import { getTodaysDeparture, getAllRooms } from "../data/fetch";

const DepartureSummary = () => {
  const [totalRooms, setTotalRooms] = useState(0); 
  const [departingRooms, setDepartingRooms] = useState(0); 
  const [totalGuests, setTotalGuests] = useState(0); // Totale ospiti in arrivo

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [roomsData, departingData] = await Promise.all([getAllRooms(), getTodaysDeparture()]);

        setTotalRooms(roomsData); // Imposta il numero totale di camere

        const departing = departingData.departingToday;
        setDepartingRooms(departing.length); // Numero camere in arrivo

        // Calcola il totale degli ospiti
        const guests = departing.reduce((total, dep) => total + (dep.pax.adults + dep.pax.children), 0);
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
        <Card.Title>Partenze</Card.Title>
        <Card.Text>
          <strong>Camere in partenza:</strong> {departingRooms} su {totalRooms}
        </Card.Text>
        <Card.Text>
          <strong>Totale ospiti:</strong> {totalGuests}
        </Card.Text>
      </Card.Body>
    </Card>
    </div>
  );
};

export default DepartureSummary;