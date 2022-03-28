import {
  IonContent,
  IonPage,
  IonGrid,
} from "@ionic/react";
import React from "react";

const Login: React.FC = () => {
  return (
    <IonPage>
      <IonContent>
        <IonGrid className="ion-text-center">
          <h1>Login</h1>
        </IonGrid>
      </IonContent>
    </IonPage>
  );
};

export default Login;
