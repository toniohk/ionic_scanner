import React from "react";
import {
  IonTabs,
  IonRouterOutlet,
  IonTabButton,
  IonTabBar,
  IonIcon,
  IonLabel,
} from "@ionic/react";
import { Route, Redirect } from "react-router-dom";
import {
  glassesOutline,
} from "ionicons/icons";

import Lookup from "./Lookup";

const MainTabs: React.FC = () => {
  return (
    <IonTabs>
      <IonRouterOutlet id="tabs">
        <Redirect path="/Main" to="/Main/Lookup" exact={true} />
        <Route path="/Main/Lookup" component={Lookup} exact={true} />
      </IonRouterOutlet>

      <IonTabBar slot="bottom">
        <IonTabButton tab="lookup" href="/Main/Lookup">
          <IonIcon icon={glassesOutline} />
          <IonLabel>Lookup</IonLabel>
        </IonTabButton>
      </IonTabBar>
    </IonTabs>
  );
};

export default MainTabs;
