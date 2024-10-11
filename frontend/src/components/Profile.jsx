import { useContext, useState } from "react";
import { UserContext } from "../context/UserContextProvider";
import { Container, Col, Card, Row, Form, Button, Alert } from "react-bootstrap";
import { changeUserPassword } from "../data/fetch";

function Profile() {
  const { token, userInfo } = useContext(UserContext);

  // Stati per gestire le password e i messaggi di feedback
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [errorMessage, setErrorMessage] = useState('');
  const [successMessage, setSuccessMessage] = useState('');

  // Funzione per gestire la modifica della password
  const handlePasswordChange = async (e) => {
    e.preventDefault();
    setErrorMessage('');
    setSuccessMessage('');

    // Controlla che la nuova password e la conferma coincidano
    if (newPassword !== confirmPassword) {
      setErrorMessage('La nuova password non corrisponde alla conferma.');
      return;
    }

    // Chiamata all'API per modificare la password
    const message = await changeUserPassword(currentPassword, newPassword);
    
    if (message === 'Password aggiornata con successo.') {
      setSuccessMessage(message);
      setCurrentPassword('');
      setNewPassword('');
      setConfirmPassword('');
    } else {
      setErrorMessage(message);
    }
  };

  return (
    <>
      {token && (
        <Container className="mt-5">
          <Row>
            {/* Sezione Informazioni Utente */}
            <Col md={6}>
              <Card>
                <Card.Header>
                  <h2>Profilo di {userInfo.name}</h2>
                </Card.Header>
                <Card.Body>
                  <Form>
                    <Form.Group className="mb-3">
                      <Form.Label>Nome</Form.Label>
                      <Form.Control type="text" value={userInfo.name} readOnly />
                    </Form.Group>
                    <Form.Group className="mb-3">
                      <Form.Label>Cognome</Form.Label>
                      <Form.Control type="text" value={userInfo.surname} readOnly />
                    </Form.Group>
                    <Form.Group className="mb-3">
                      <Form.Label>Username</Form.Label>
                      <Form.Control type="text" value={userInfo.username} readOnly />
                    </Form.Group>
                    <Form.Group className="mb-3">
                      <Form.Label>Email</Form.Label>
                      <Form.Control type="email" value={userInfo.email} readOnly />
                    </Form.Group>
                  </Form>
                </Card.Body>
              </Card>
            </Col>

            {/* Sezione Modifica Password */}
            <Col md={6}>
              <Card>
                <Card.Header>
                  <h2>Modifica Password</h2>
                </Card.Header>
                <Card.Body>
                  {/* Mostra messaggio di successo o errore */}
                  {successMessage && <Alert variant="success">{successMessage}</Alert>}
                  {errorMessage && <Alert variant="danger">{errorMessage}</Alert>}
                  <Form onSubmit={handlePasswordChange}>
                    <Form.Group className="mb-3">
                      <Form.Label>Password Corrente</Form.Label>
                      <Form.Control
                        type="password"
                        value={currentPassword}
                        onChange={(e) => setCurrentPassword(e.target.value)}
                        placeholder="Inserisci la password corrente"
                        required
                      />
                    </Form.Group>
                    <Form.Group className="mb-3">
                      <Form.Label>Nuova Password</Form.Label>
                      <Form.Control
                        type="password"
                        value={newPassword}
                        onChange={(e) => setNewPassword(e.target.value)}
                        placeholder="Inserisci la nuova password"
                        required
                      />
                    </Form.Group>
                    <Form.Group className="mb-3">
                      <Form.Label>Conferma Nuova Password</Form.Label>
                      <Form.Control
                        type="password"
                        value={confirmPassword}
                        onChange={(e) => setConfirmPassword(e.target.value)}
                        placeholder="Conferma la nuova password"
                        required
                      />
                    </Form.Group>
                    <Button className="btn-bg-color" type="submit">
                      Aggiorna Password
                    </Button>
                  </Form>
                </Card.Body>
              </Card>
            </Col>
          </Row>
        </Container>
      )}
    </>
  );
}

export default Profile;
