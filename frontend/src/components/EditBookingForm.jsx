import React, { useState, useEffect } from "react";
import { Form, Button, Spinner } from "react-bootstrap";
import { editBooking } from "../data/fetch";

const EditBookingForm = ({ booking, onSave, onCancel }) => {
  const [formData, setFormData] = useState({
    checkInDate: "",
    checkOutDate: "",
    adults: 1,
    children: 0,
  });
  const [isSaving, setIsSaving] = useState(false);

  // Pre-popolare il form con i dati della prenotazione
  useEffect(() => {
    if (booking) {
      setFormData({
        checkInDate: booking.checkInDate.split("T")[0],
        checkOutDate: booking.checkOutDate.split("T")[0],
        adults: booking.pax.adults,
        children: booking.pax.children,
      });
    }
  }, [booking]);

  const handleInputChange = (event) => {
    const { name, value } = event.target;
    setFormData({
      ...formData,
      [event.target.name]: event.target.value,
    });
  };

  const handleSave = async (event) => {
    event.preventDefault();
    setIsSaving(true);
    try {
      await editBooking(booking._id, formData);
      onSave();
    } catch (err) {
      console.error("Errore durante la modifica della prenotazione:", err);
      alert("Errore durante la modifica della prenotazione.");
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div className="edit-booking-form" style={{ width: "30%", padding: "20px", border: "1px solid #ddd", background: "#f9f9f9" }}>
      <h4>Modifica Prenotazione</h4>
      <Form onSubmit={handleSave}>
        <Form.Group controlId="checkInDate">
          <Form.Label>Data di Check-In</Form.Label>
          <Form.Control type="date" name="checkInDate" value={formData.checkInDate} onChange={handleInputChange} required />
        </Form.Group>
        <Form.Group controlId="checkOutDate" className="mt-2">
          <Form.Label>Data di Check-Out</Form.Label>
          <Form.Control type="date" name="checkOutDate" value={formData.checkOutDate} onChange={handleInputChange} required />
        </Form.Group>
        <Form.Group controlId="adults" className="mt-2">
          <Form.Label>Numero di Adulti</Form.Label>
          <Form.Control type="number" name="adults" value={formData.adults} onChange={handleInputChange} required min="1" />
        </Form.Group>
        <Form.Group controlId="children" className="mt-2">
          <Form.Label>Numero di Bambini</Form.Label>
          <Form.Control type="number" name="children" value={formData.children} onChange={handleInputChange} required min="0" />
        </Form.Group>
        <div className="mt-4">
          <Button variant="primary" type="submit" disabled={isSaving}>
            {isSaving ? <Spinner animation="border" size="sm" /> : "Salva"}
          </Button>
          <Button variant="secondary" className="ms-2" onClick={onCancel}>
            Annulla
          </Button>
        </div>
      </Form>
    </div>
  );
};

export default EditBookingForm;