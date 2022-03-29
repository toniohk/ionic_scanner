import {
  IonContent,
  IonPage,
  IonGrid,
  IonRow,
  IonCol,
  IonButtons,
  IonButton,
  IonInput,
  IonSelect,
  IonSelectOption,
  IonLabel,
  IonItem,
  IonLoading,
  useIonViewWillLeave,
} from "@ionic/react";
import React, { useState, useEffect, useContext } from "react";
import ApplicationContext, {
  baseAPIURL,
  User,
} from "../data/application-context";
import MainHeader from "../components/MainHeader";
// import MainFooter from "../components/MainFooter";
import axios from "axios";
import { useHistory } from "react-router-dom";

const Login: React.FC = () => {
  const history = useHistory();
  const [user, setUser] = useState<User>();
  const [showLoading, setShowLoading] = useState(false);
  const [pin, setPin] = useState<string>();
  const [messageAlert, setMessageAlert] = useState<string>("");
  const [logins, setLogins] = useState<User[]>([]);
  const applicationCtx = useContext(ApplicationContext);

  useIonViewWillLeave(() => {
    setUser({
      name: "",
      id: "",
    });
    setMessageAlert("");
    setPin("");
    setShowLoading(false);
  });

  const userOnIonChange = (e: CustomEvent) => {
    var foundLogin:User;
    logins.forEach((login) => {
      if (login.name == e.detail.value) {
        foundLogin = login;
      }
    });
    if (foundLogin! != null) {
      setUser({ name: foundLogin!.name!, id: foundLogin!.id! });
    }
  };

  const LoginHandler = () => {
    setShowLoading(true);
    let res = axios
      .post(baseAPIURL + "/Login/GetUserValid", {
        userName: user!.name!,
        pin: pin,
      })
      .then((response) => response.data)
      .then((data) => {
        console.log(data);
        if (data.result === true) {
          applicationCtx.loginUser(user?.name!, user?.id!);
          history.push("/Main");
        } else {
          setMessageAlert("Login unsuccessful!");
        }
      })
      .finally(() => {
        setShowLoading(false);
      });
  };

  useEffect(() => {
    setShowLoading(true);
    axios
      .get(baseAPIURL + "/Login/GetUserList")
      .then((response) => response.data)
      .then((data: User[]) => {
        console.log(data);
        setLogins(data);
        console.log(logins);
      })
      .finally(() => {
        setShowLoading(false);
      });
  }, []);

  return (
    <IonPage>
      <MainHeader />
      <IonContent>
        <IonLoading
          isOpen={showLoading}
          onDidDismiss={() => setShowLoading(false)}
          message={"Loading..."}
          duration={5000}
        />
        <IonGrid className="ion-text-center">
          <h1>Login</h1>
          <IonRow>
            <IonCol>
              <IonItem>
                <IonLabel position="floating">Select Username:</IonLabel>
                <IonSelect
                  value={user?.name}
                  interface="popover"
                  onIonChange={userOnIonChange}
                >
                  {logins.map((item) => (
                    <IonSelectOption key={item.id} value={item.name}>
                      {item.name}
                    </IonSelectOption>
                  ))}
                </IonSelect>
              </IonItem>
            </IonCol>
          </IonRow>
          <IonRow>
            <IonCol>
              <IonItem>
                <IonLabel position="floating">Enter Pin:</IonLabel>
                <IonInput
                  maxlength={10}
                  value={pin}
                  type="number"
                  clearOnEdit
                  placeholder="PIN"
                  onIonChange={(e) => setPin(e.detail.value!)}
                ></IonInput>
              </IonItem>
            </IonCol>
          </IonRow>
          <IonRow>
            <IonCol>
              <IonButtons>
                <IonButton fill="solid" color="primary" onClick={LoginHandler}>
                  Login
                </IonButton>
              </IonButtons>
            </IonCol>
          </IonRow>
        </IonGrid>
      </IonContent>
    </IonPage>
  );
};

export default Login;
