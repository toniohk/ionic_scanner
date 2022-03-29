import {
  IonContent,
  IonPage,
  IonGrid,
  IonRow,
  IonInput,
  IonIcon,
  IonButton,
  IonItem,
  IonLabel,
  IonTextarea,
  IonCol,
  IonCheckbox,
  IonSelect,
  IonSelectOption,
  IonLoading,
  useIonViewWillLeave,
  useIonViewDidEnter
} from "@ionic/react";
import React, { useState, useRef, useEffect, useContext } from "react";
import { BarcodeScanner } from "@ionic-native/barcode-scanner/ngx";
import { barcode, scanCircleSharp } from "ionicons/icons";
import axios from "axios";
import ApplicationContext, {
  Inventory,
  Location,
  baseAPIURL,
  allowManualSelections,
} from "../data/application-context";
import MainHeader from "../components/MainHeader";

const Move: React.FC = () => {
  const [inventoryManual, setInventoryManual] = useState<boolean>(false);
  const [locationManual, setLocationManual] = useState<boolean>(false);
  const [inventoryBarcode, setInventoryBarcode] = useState<string>("");
  const [locationBarcode, setLocationBarcode] = useState<string>("");
  // const [inventory, setInventory] = useState<Inventory[]>([]);
  // const [locations, setLocations] = useState<Location[]>([]);
  const [message, setMessage] = useState<string>("");
  const applicationCtx = useContext(ApplicationContext);
  const barCodeScanner = new BarcodeScanner();
  const [showLoading, setShowLoading] = useState(false);
  const txtInventory = useRef<HTMLIonInputElement>(null);
  const txtLocation = useRef<HTMLIonInputElement>(null);


  useIonViewWillLeave(() => {
    setInventoryBarcode("");
    setInventoryManual(false);
    setLocationBarcode("");
    setLocationManual(false);
    setMessage("");
    setShowLoading(false);
  });

  // useEffect(() => {
  //   setShowLoading(true);
  //   axios
  //     .get(
  //       baseAPIURL + "/Lookup/GetAvailableInventory"
  //     )
  //     .then((response) => response.data)
  //     .then((data: Inventory[]) => {
  //       console.log(data);
  //       setInventory(data);
  //       console.log(inventory);
  //     })
  //     .finally(() => {
  //       setShowLoading(false);
  //     });

  //     setShowLoading(true);

  //     axios
  //     .get(
  //       baseAPIURL + "/Lookup/GetLocations"
  //     )
  //     .then((response) => response.data)
  //     .then((data: Location[]) => {
  //       console.log(data);
  //       setLocations(data);
  //       console.log(inventory);
  //     })
  //     .finally(() => {
  //       setShowLoading(false);
  //     });
  // }, []);

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

  const ReadInventoryBarcodeHandler = () => {
    barCodeScanner.scan().then((barcodeData) => {
      console.log("Barcode Data: ", barcodeData);
      setInventoryBarcode(barcodeData.text);
    });
  };

  const ReadLocationBarcodeHandler = () => {
    barCodeScanner.scan().then((barcodeData) => {
      console.log("Barcode Data: ", barcodeData);
      setLocationBarcode(barcodeData.text);
    });
  };

const OnInventoryInputChanged = (e: CustomEvent) => {
  setInventoryBarcode(e.detail.value!); 
  //focusElement(txtLocation.current!);
}

  const MoveHandler = () => {
    var invNumber = inventoryBarcode;
    var locNumber = locationBarcode;

    axios
      .post(baseAPIURL + "/Receiving/InventoryMove", {
        inventoryId: invNumber,
        locationId: locNumber,
        userId: applicationCtx.token.userId,
      })
      .then((response) => response.data)
      .then((data) => {
        console.log(data);
        setMessage("Result:" + data.message);
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
              <h1>Move</h1>
            </IonCol>
          </IonRow>
          <IonRow>
            {allowManualSelections && (
              <IonCol size="2">
                <IonLabel>Manual</IonLabel>
                <IonCheckbox
                  checked={inventoryManual}
                  onClick={() => setInventoryManual(!inventoryManual)}
                ></IonCheckbox>
              </IonCol>
            )}
            {!allowManualSelections && <IonCol size="2"></IonCol>}
            {!inventoryManual && (
              <IonCol size="7">
                <IonItem>
                  <IonInput
                    ref={txtInventory}
                    value={inventoryBarcode}
                    clearOnEdit
                    onIonChange={OnInventoryInputChanged}
                    placeholder="Inventory Barcode"
                  ></IonInput>
                </IonItem>
              </IonCol>
            )}
            {!inventoryManual && (
              <IonCol>
                {applicationCtx.appSettings.useBuiltInCamera && (
                  <IonButton onClick={ReadInventoryBarcodeHandler}>
                    <IonIcon slot="icon-only" icon={scanCircleSharp}></IonIcon>
                  </IonButton>
                )}
              </IonCol>
            )}
            {inventoryManual && (
              <IonCol size="7">
                <IonItem>
                  <IonSelect
                    placeholder="Select Inventory"
                    value={inventoryBarcode}
                    onIonChange={OnInventoryInputChanged}
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
          </IonRow>
          <IonRow>
            {allowManualSelections && (
              <IonCol size="2">
                <IonLabel>Manual</IonLabel>
                <IonCheckbox
                  checked={locationManual}
                  onClick={() => setLocationManual(!locationManual)}
                ></IonCheckbox>
              </IonCol>
            )}
            {!allowManualSelections && <IonCol size="2"></IonCol>}
            {!locationManual && (
              <IonCol size="7">
                <IonItem>
                  <IonInput
                    ref={txtLocation}
                    value={locationBarcode}
                    clearOnEdit
                    onIonChange={(e) => setLocationBarcode(e.detail.value!)}
                    placeholder="Location Barcode"
                  ></IonInput>
                </IonItem>
              </IonCol>
            )}
            {!locationManual && (
              <IonCol>
                {applicationCtx.appSettings.useBuiltInCamera && (
                  <IonButton onClick={ReadLocationBarcodeHandler}>
                    <IonIcon slot="icon-only" icon={scanCircleSharp}></IonIcon>
                  </IonButton>
                )}
              </IonCol>
            )}
            {locationManual && (
              <IonCol size="7">
                <IonItem>
                  <IonSelect
                    placeholder="Select Location"
                    value={locationBarcode}
                    onIonChange={(e) => setLocationBarcode(e.detail.value)}
                  >
                    {applicationCtx.locations.map((loc) => (
                      <IonSelectOption value={loc.id}>
                        {loc.id} - {loc.locationName}
                      </IonSelectOption>
                    ))}
                  </IonSelect>
                </IonItem>
              </IonCol>
            )}
          </IonRow>
          <IonRow>
            <IonCol>
              <IonButton onClick={MoveHandler} fill="solid" color="primary">
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
              <IonTextarea></IonTextarea>
            </IonCol>
          </IonRow>
        </IonGrid>
      </IonContent>
    </IonPage>
  );
};

export default Move;
