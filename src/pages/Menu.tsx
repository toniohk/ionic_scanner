import {
  IonContent,
  IonPage,
  IonGrid,
  IonRow,
  IonCol,
  IonButtons,
  IonButton,
} from "@ionic/react";
import React from "react";
import MainHeader from "../components/MainHeader";
import "./Menu.css";

const Menu: React.FC = () => {
  return (
    <IonPage>
      <MainHeader />
      <IonContent>
        <IonGrid fixed={true}>
          <h1>Menu</h1>
          <IonRow className="ion-justify-content-center">
            <IonCol size="4"></IonCol>
            <IonCol size="6" className="ion-justify-center">
              <IonButtons>
                <IonButton fill="solid" color="primary" routerLink="./Lookup">
                  Lookup
                </IonButton>
              </IonButtons>
            </IonCol>
          </IonRow>
          <IonRow className="ion-justify-content-center">
            <IonCol size="4"></IonCol>
            <IonCol size="6">
              <IonButtons>
                <IonButton fill="solid" color="primary" routerLink="./Move">
                  Move
                </IonButton>
              </IonButtons>
            </IonCol>
          </IonRow>
          <IonRow className="ion-justify-content-center">
            <IonCol size="4"></IonCol>
            <IonCol size="6">
              <IonButtons>
                <IonButton fill="solid" color="primary" routerLink="./Receive">
                  Receive
                </IonButton>
              </IonButtons>
            </IonCol>
          </IonRow>
          <IonRow className="ion-justify-content-center">
            <IonCol size="4"></IonCol>
            <IonCol size="6">
              <IonButtons>
                <IonButton fill="solid" color="primary" routerLink="./Ship">
                  Ship
                </IonButton>
              </IonButtons>
            </IonCol>
          </IonRow>
          <IonRow className="ion-justify-content-center">
            <IonCol size="4"></IonCol>
            <IonCol size="6">
              <IonButtons>
                <IonButton fill="solid" color="primary" routerLink="./Deliver">
                  Deliver
                </IonButton>
              </IonButtons>
            </IonCol>
          </IonRow>

          <IonRow className="ion-justify-content-center">
            <IonCol size="4"></IonCol>
            <IonCol size="6">
              <IonButtons>
                <IonButton fill="solid" color="primary" routerLink="./Quality">
                  Quality
                </IonButton>
              </IonButtons>
            </IonCol>
          </IonRow>
        </IonGrid>
      </IonContent>
    </IonPage>
  );
};

export default Menu;
