import {
  IonToolbar,
    IonFooter
} from "@ionic/react";
import React, { useContext } from "react";
import ApplicationContext from "../data/application-context";

const MainFooter: React.FC = () => {
  const applicationCtx = useContext(ApplicationContext);
  return (
    <IonFooter color="ion-color-primary">
      <IonToolbar>

        </IonToolbar>
    </IonFooter>
  );
};

export default MainFooter;
