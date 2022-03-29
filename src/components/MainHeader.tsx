import {
  IonHeader,
  IonTitle,
  IonToolbar,
  IonButtons,
  IonMenuButton,
} from "@ionic/react";
import React, { useContext } from "react";
import ApplicationContext from "../data/application-context";
//import MainSidePanel from "./MainSidePanel";

const MainHeader: React.FC = () => {
  const applicationCtx = useContext(ApplicationContext);
  return (
    <IonHeader color="ion-color-primary">
      <IonToolbar class="toolbarStyle">
        {applicationCtx.token.isLoggedIn && (
          <IonButtons slot="start">
            <IonMenuButton />
          </IonButtons>
        )}
        <IonTitle class="ion-text-center">Scanner</IonTitle>
      </IonToolbar>
    </IonHeader>
  );
};

export default MainHeader;
