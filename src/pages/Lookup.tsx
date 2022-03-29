import {
  IonContent,
  IonPage,
  IonGrid,
  IonRow,
  IonCol,
  IonButton,
  IonSelect,
  IonLabel,
  IonTextarea,
  IonIcon,
  IonInput,
  IonItem,
  IonLoading,
  IonCheckbox,
  IonSelectOption,
  useIonViewWillLeave,
  useIonViewDidEnter,
} from "@ionic/react";
import React, { useState, useEffect, useRef, useContext } from "react";
import { BarcodeScanner } from "@ionic-native/barcode-scanner/ngx";
import MainHeader from "../components/MainHeader";
import { scanCircleSharp } from "ionicons/icons";
// import { Plugins, CameraSource, CameraResultType } from "@capacitor/core";
import axios from "axios";
import ApplicationContext, {
  Inventory,
  baseAPIURL,
  allowManualSelections,
} from "../data/application-context";

const Lookup: React.FC = () => {
  const [barcode, setBarcode] = useState<string>("");
  const [manual, setManual] = useState<boolean>(false);
  const [message, setMessage] = useState<string>("");
  const [showLoading, setShowLoading] = useState(false);
  // const [inventory, setInventory] = useState<Inventory[]>([]);
  const txtInventory = useRef<HTMLIonInputElement>(null);

  const applicationCtx = useContext(ApplicationContext);
  const barCodeScanner = new BarcodeScanner();

  useIonViewWillLeave(() => {
    setBarcode("");
    setManual(false);
    setMessage("");
    setShowLoading(false);
  });

  const focusElement = async (ref: HTMLIonInputElement) => {
    if (ref) {
      const el = await ref.getInputElement();
      el.focus();
    } else {
      console.log("focusElement got no ref");
    }
  }

  useIonViewDidEnter(() => {
    focusElement(txtInventory.current!);
  })

  // useEffect(() => {
  //   setShowLoading(true);
  //   axios
  //     .get(
  //       baseAPIURL + "/Lookup/GetAvailableInventory"
  //     )
  //     .then((response) => response.data)
  //     .then((data: Inventory[]) => {
  //       console.log(data);
  //       setInventory((curInventory) => {
  //         return curInventory.concat(data);
  //       });
  //       console.log(inventory);
  //     })
  //     .finally(() => {
  //       setShowLoading(false);
  //     });
  // }, []);

  const ReadBarcodeHandler = () => {
    barCodeScanner.scan().then((barcodeData) => {
      console.log("Barcode Data: ", barcodeData);
      setBarcode(barcodeData.text);
    });
  };

  const LookupHandler = () => {
    var invNumber = barcode;
    setShowLoading(true);
    axios
      .post(baseAPIURL + "/Lookup/GetInventoryLookup", {
        inventoryId: invNumber,
      })
      .then((response) => response.data)
      .then((data) => {
        console.log(data);
        setMessage("Location: " + data.locationName);
      })
      .finally(() => {
        setShowLoading(false);
      });
  };

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
          <IonRow>
            <IonCol>
              <h1>Lookup</h1>
            </IonCol>
          </IonRow>
          <IonRow>
            {allowManualSelections && (
              <IonCol size="2">
                <IonLabel>Manual</IonLabel>
                <IonCheckbox
                  checked={manual}
                  onClick={() => setManual(!manual)}
                ></IonCheckbox>
              </IonCol>
            )}
            {!allowManualSelections && <IonCol size="2"></IonCol>}
            {!manual && (
              <IonCol size="7">
                <IonItem>
                  <IonInput
                    ref={txtInventory}
                    value={barcode}
                    clearOnEdit
                    autofocus
                    onIonChange={(e) => setBarcode(e.detail.value!)}
                    placeholder="Inventory Barcode"
                  ></IonInput>
                </IonItem>
              </IonCol>
            )}
            {manual && (
              <IonCol size="7">
                <IonItem>
                  <IonSelect
                    placeholder="Select Inventory"
                    value={barcode}
                    onIonChange={(e) => setBarcode(e.detail.value)}
                  >
                    {applicationCtx.inventory.map((inv) => (
                      <IonSelectOption value={inv.id}>
                        {inv.id} - {inv.sku}
                      </IonSelectOption>
                    ))}
                  </IonSelect>
                </IonItem>
              </IonCol>
            )}
            {!manual && (
              <IonCol>
                {applicationCtx.appSettings.useBuiltInCamera && (
                  <IonButton onClick={ReadBarcodeHandler}>
                    <IonIcon slot="icon-only" icon={scanCircleSharp}></IonIcon>
                  </IonButton>
                )}
              </IonCol>
            )}
          </IonRow>
          <IonRow>
            <IonCol>
              <IonButton fill="solid" color="primary" onClick={LookupHandler}>
                GO
              </IonButton>
            </IonCol>
          </IonRow>
          <IonRow>
            <IonCol>
              <IonTextarea readonly value={message}></IonTextarea>
            </IonCol>
          </IonRow>
          <IonRow>
            <IonCol>
              <IonItem>
                <IonTextarea></IonTextarea>
              </IonItem>
            </IonCol>
          </IonRow>
        </IonGrid>
      </IonContent>
    </IonPage>
  );
};

export default Lookup;
