import React, { useEffect, useState } from "react";
import { Card } from "react-bootstrap";
import { getTodaysArrivals, getAllRooms } from "../data/fetch";

const ArrivalSummary = () => {
  const [totalRooms, setTotalRooms] = useState(0); 
  const [arrivingRooms, setArrivingRooms] = useState(0); 
  const [totalGuests, setTotalGuests] = useState(0); // Totale ospiti in arrivo

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [roomsData, arrivalsData] = await Promise.all([getAllRooms(), getTodaysArrivals()]);

        setTotalRooms(roomsData); // Imposta il numero totale di camere

        const arrivals = arrivalsData.arrivingToday;
        setArrivingRooms(arrivals.length); // Numero camere in arrivo

        // Calcola il totale degli ospiti
        const guests = arrivals.reduce((total, arrival) => total + (arrival.pax.adults + arrival.pax.children), 0);
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
        <Card.Title>Arrivi</Card.Title>
        <Card.Text>
          <strong>Camere in arrivo:</strong> {arrivingRooms} su {totalRooms}
        </Card.Text>
        <Card.Text>
          <strong>Totale ospiti:</strong> {totalGuests}
        </Card.Text>
      </Card.Body>
    </Card>
    </div>
  );
};

export default ArrivalSummary;