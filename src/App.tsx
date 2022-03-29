import React, { useContext, useEffect } from "react";
import { Redirect, Route } from "react-router-dom";
import { IonApp, IonRouterOutlet } from "@ionic/react";
import { IonReactRouter } from "@ionic/react-router";
import ApplicationContextProvider from "./data/ApplicationContextProvider";

import Login from "./pages/Login";
import MainTabs from "./pages/MainTabs";

/* Core CSS required for Ionic components to work properly */
import "@ionic/react/css/core.css";

/* Basic CSS for apps built with Ionic */
import "@ionic/react/css/normalize.css";
import "@ionic/react/css/structure.css";
import "@ionic/react/css/typography.css";

/* Optional CSS utils that can be commented out */
import "@ionic/react/css/padding.css";
import "@ionic/react/css/float-elements.css";
import "@ionic/react/css/text-alignment.css";
import "@ionic/react/css/text-transformation.css";
import "@ionic/react/css/flex-utils.css";
import "@ionic/react/css/display.css";

/* Theme variables */
import "./theme/variables.css";
import "./theme/theme.css";
import MainSidePanel from "./components/MainSidePanel";
import ApplicationContext from "./data/application-context";

const App: React.FC = () => {
  const applicationCtx = useContext(ApplicationContext);

  const { initContext } = applicationCtx;
  useEffect(() => {
    initContext();
  }, [initContext]);

  return (
    <IonApp>
      <IonReactRouter>
        <MainSidePanel />
        <IonRouterOutlet id="main">
          <Route path="/Login" component={Login} exact={true} />
          <Route path="/Main" component={MainTabs} />
          <Redirect path="/" to="/Login" exact={true} />
        </IonRouterOutlet>
      </IonReactRouter>
    </IonApp>
  );
};

export default App;
