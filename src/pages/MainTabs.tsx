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
  arrowDownCircleOutline,
  moveOutline,
  busOutline,
  giftOutline,
} from "ionicons/icons";

import Deliver from "./Deliver";
import Lookup from "./Lookup";
import Move from "./Move";
import Receive from "./Receive";
import Ship from "./Ship";

const MainTabs: React.FC = () => {
  return (
    <IonTabs>
      <IonRouterOutlet id="tabs">
        <Redirect path="/Main" to="/Main/Lookup" exact={true} />
        <Route path="/Main/Lookup" component={Lookup} exact={true} />
        <Route path="/Main/Receive" component={Receive} exact={true} />
        <Route path="/Main/Move" component={Move} exact={true} />
        <Route path="/Main/Ship" component={Ship} exact={true} />
        <Route path="/Main/Deliver" component={Deliver} exact={true} />
      </IonRouterOutlet>

      <IonTabBar slot="bottom">
        <IonTabButton tab="lookup" href="/Main/Lookup">
          <IonIcon icon={glassesOutline} />
          <IonLabel>Lookup</IonLabel>
        </IonTabButton>
        <IonTabButton tab="receive" href="/Main/Receive">
          <IonIcon icon={arrowDownCircleOutline} />
          <IonLabel>Receive</IonLabel>
        </IonTabButton>
        <IonTabButton tab="move" href="/Main/Move">
          <IonIcon icon={moveOutline} />
          <IonLabel>Move</IonLabel>
        </IonTabButton>
        <IonTabButton tab="deliver" href="/Main/Deliver">
          <IonIcon icon={giftOutline} />
          <IonLabel>Deliver</IonLabel>
        </IonTabButton>
        <IonTabButton tab="ship" href="/Main/Ship">
          <IonIcon icon={busOutline} />
          <IonLabel>Ship</IonLabel>
        </IonTabButton>
      </IonTabBar>
    </IonTabs>
  );
};

export default MainTabs;
