import React, { useState, useContext } from "react";
import {
  IonMenu,
  IonHeader,
  IonToolbar,
  IonTitle,
  IonContent,
  IonMenuToggle,
  IonList,
  IonItem,
  IonIcon,
  IonLabel,
  IonToggle,
} from "@ionic/react";
import { logOutOutline } from "ionicons/icons";
import ApplicationContext from "../data/application-context";
import { useHistory } from "react-router-dom";

const MainSidePanel: React.FC = () => {
  const history = useHistory();
  const applicationCtx = useContext(ApplicationContext);

  const LogoutHandler = () => {
    applicationCtx.logOutUser();
    history.push("/Login");
  };

  const GetLogginNameString = () => {
    return "Logged In: " + applicationCtx.token.userName;
  };

  const UpdateCheckedHandler = (event: CustomEvent) => {
    if (event.detail.checked)
    {
        if (event.detail.value == "zebra") {
          applicationCtx.updateZebra();
        }

        if (event.detail.value == "camera") {
          applicationCtx.updateBuiltInCamera();
        }

        if (event.detail.value == "other") {
          applicationCtx.updateOtherDevice();
        }
      }     
  };

  return (
    <IonMenu contentId="main">
      <IonHeader>
        <IonToolbar>
          <IonTitle>Settings</IonTitle>
        </IonToolbar>
      </IonHeader>
      <IonContent>
        <IonList>
          <IonMenuToggle>
            <IonItem>
              <IonLabel>{GetLogginNameString()} </IonLabel>
            </IonItem>
          </IonMenuToggle>
          <IonMenuToggle>
            <IonItem>
              <IonLabel>Use Zebra Scanner</IonLabel>
              <IonToggle
                value="zebra"
                checked={applicationCtx.appSettings.useZebraCamera}
                onIonChange={UpdateCheckedHandler}
              />
            </IonItem>
          </IonMenuToggle>
          <IonMenuToggle>
            <IonItem>
              <IonLabel>Use Device Camera</IonLabel>
              <IonToggle
                value="camera"
                checked={applicationCtx.appSettings.useBuiltInCamera}
                onIonChange={UpdateCheckedHandler}
              />
            </IonItem>
          </IonMenuToggle>
          <IonMenuToggle>
            <IonItem>
              <IonLabel>Use Built-In Scanner</IonLabel>
              <IonToggle
                value="other"
                checked={applicationCtx.appSettings.useOtherDevice}
                onIonChange={UpdateCheckedHandler}
              />
            </IonItem>
          </IonMenuToggle>
          <IonMenuToggle>
            <IonItem
              button
              routerDirection="none"
              color="danger"
              onClick={LogoutHandler}
            >
              <IonIcon icon={logOutOutline}></IonIcon>
              <IonLabel>Logout</IonLabel>
            </IonItem>
          </IonMenuToggle>
        </IonList>
      </IonContent>
    </IonMenu>
  );
};

export default MainSidePanel;
