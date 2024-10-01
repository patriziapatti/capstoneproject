import { useContext } from "react";
import { UserContext } from "../context/UserContextProvider";
import { Container, Tab, Tabs, Card } from "react-bootstrap";

const Settings = () => {
  const { token, userInfo } = useContext(UserContext);

  return (
    <Container className="mt-5">
      {/* Header della pagina */}
      <h2 className="mb-4 text-center">Configurazioni</h2>
      {/* <p className="text-center text-muted">Gestisci le configurazioni delle camere e degli utenti per il tuo sistema.</p> */}

      {/* Tabs per navigare tra le configurazioni */}
      <Tabs defaultActiveKey="rooms" id="settings-tabs" className="mb-3" justify>
        {/* Tab per Configurazioni delle Camere */}
        <Tab eventKey="rooms" title="Camere">
          <Card className="p-4">
            <Card.Body>
              <h4>Gestione delle Camere</h4>
              <p className="text-muted">
                Qui puoi configurare le impostazioni per le camere. Puoi aggiungere, modificare o rimuovere le informazioni relative a ciascuna camera.
              </p>
              {/* In futuro, inserire qui i componenti specifici per gestire le camere */}
              <p>-- Area di configurazione camere --</p>
            </Card.Body>
          </Card>
        </Tab>

        {/* Tab per Configurazioni degli Utenti */}
        <Tab eventKey="users" title="Utenti">
          <Card className="p-4">
            <Card.Body>
              <h4>Gestione degli Utenti</h4>
              <p className="text-muted">
                Qui puoi gestire gli utenti del sistema. Aggiungi nuovi utenti, modifica oppure rimuovi utenti esistenti.
              </p>
              {/* In futuro, inserire qui i componenti specifici per gestire gli utenti */}
              <p>-- Area di configurazione utenti --</p>
            </Card.Body>
          </Card>
        </Tab>
      </Tabs>
    </Container>
  );
};

export default Settings;