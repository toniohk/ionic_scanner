import {
  IonContent,
  IonPage,
  IonGrid,
  IonRow,
  IonButton,
  IonSelect,
  IonSelectOption,
  IonCheckbox,
  IonItem,
  IonInput,
  IonIcon,
  IonLabel,
  IonTextarea,
  IonCol,
  IonLoading,
  useIonViewWillLeave,
  useIonViewDidEnter,
} from "@ionic/react";
import React, { useState, useEffect, useContext } from "react";
import { BarcodeScanner } from "@ionic-native/barcode-scanner/ngx";
import MainHeader from "../components/MainHeader";
import { scanCircleSharp } from "ionicons/icons";
import axios from "axios";
import ApplicationContext, {
  Inventory,
  baseAPIURL,
  CycleCount,
  allowManualSelections,
} from "../data/application-context";
const Quality: React.FC = () => {
  const [inventoryManual, setInventoryManual] = useState<boolean>(false);
  const [inventoryBarcode, setInventoryBarcode] = useState<string>("");
  const [locationManual, setLocationManual] = useState<boolean>(false);
  const [locationBarcode, setLocationBarcode] = useState<string>("");
  const [message, setMessage] = useState<string>("");
  const [showLoading, setShowLoading] = useState(false);
  const [cycleCount, setCycleCount] = useState<CycleCount>();
  const [quantity, setQuantity] = useState<string>("");
  const [cycleJobs, setCycleJobs] = useState<string[]>([]);
  const [cycleJob, setCycleJob] = useState<string>("");

  const applicationCtx = useContext(ApplicationContext);
  const barCodeScanner = new BarcodeScanner();

  useIonViewWillLeave(() => {
    setMessage("");
    clearCycle();
  });

  const clearCycle = () => {
    setInventoryBarcode("");
    setInventoryManual(false);
    setLocationBarcode("");
    setLocationManual(false);
    setQuantity("");
    setShowLoading(false);
    setCycleCount({
      cycleCountId: "",
      recordId: "",
      inventory: { id: "", locationId: "", quantity: "", sku: "" },
      picked: false,
    });
    setCycleJobs([]);
    setCycleJob("");
  };

  useIonViewDidEnter(() => {
    getCycleJobs();
  });

  const getCycleJobs = () => {
    setShowLoading(true);
    axios
      .get(baseAPIURL + "/Quality/GetCycleCountJobs")
      .then((response) => response.data)
      .then((data: string[]) => {
        console.log(data);
        setCycleJobs(data);
      })
      .finally(() => {
        setShowLoading(false);
      });
  };

  const CycleJobLookupHandler = () => {
    axios
      .post(baseAPIURL + "/Quality/GetCycleCountJobRecords", {
        cycleCountId: cycleJob,
      })
      .then((response) => response.data)
      .then((data: CycleCount) => {
        console.log(data);
        setCycleCount(data);
      })
      .finally(() => {
        setShowLoading(false);
      });
  };

  const CycleCountUpdateHandler = () => {
    var invNumber = inventoryBarcode;
    var locNumber = locationBarcode;

    axios
      .post(baseAPIURL + "/Quality/UpdateCycleCountJobRecord", {
        cycleCountId: cycleCount?.cycleCountId,
        inventoryId: invNumber,
        locationId: locNumber,
        quantity: quantity,
        userId: applicationCtx.token.userId,
      })
      .then((response) => response.data)
      .then((data) => {
        console.log(data);
        setMessage(data.message);
      })
      .finally(() => {
        setShowLoading(false);
        clearCycle();
        getCycleJobs();
      });
  };

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
              <h1>Quality</h1>
            </IonCol>
          </IonRow>
          <IonRow>
            <IonCol size="2"></IonCol>
            <IonCol size="7">
              <IonItem>
                <IonSelect
                  placeholder="Select Cycle Count"
                  value={cycleJob}
                  onIonChange={(e) => setCycleJob(e.detail.value)}
                >
                  {cycleJobs.map((job) => (
                    <IonSelectOption value={job}>{job}</IonSelectOption>
                  ))}
                </IonSelect>
              </IonItem>
            </IonCol>
          </IonRow>
          <IonRow>
            <IonCol>
              <IonButton
                fill="solid"
                color="primary"
                onClick={CycleJobLookupHandler}
              >
                Get Cycle Job
              </IonButton>
            </IonCol>
          </IonRow>
          <br></br>
          <IonRow>
            <IonGrid id="LineItemGrid">
              <IonRow id="GridHeader">
                <IonCol>SKU</IonCol>
                <IonCol>Location</IonCol>
                <IonCol>Qty</IonCol>
              </IonRow>
              <IonRow>
                <IonCol>{cycleCount?.inventory.sku}</IonCol>
                <IonCol>{cycleCount?.inventory.locationId}</IonCol>
                <IonCol>{cycleCount?.inventory.quantity}</IonCol>
              </IonRow>
            </IonGrid>
          </IonRow>
          <br></br>
          <br></br>
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
                    clearOnEdit
                    value={inventoryBarcode}
                    onIonChange={(e) => setInventoryBarcode(e.detail.value!)}
                    placeholder="Inventory Barcode"
                  ></IonInput>
                </IonItem>
              </IonCol>
            )}
            {inventoryManual && (
              <IonCol size="7">
                <IonItem>
                  <IonSelect
                    placeholder="Select Inventory"
                    value={inventoryBarcode}
                    onIonChange={(e) => setInventoryBarcode(e.detail.value)}
                  >
                    {applicationCtx.inventory.map((inv) => (
                      <IonSelectOption value={inv.id}>
                        {inv.sku}
                      </IonSelectOption>
                    ))}
                  </IonSelect>
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
                    clearOnEdit
                    value={locationBarcode}
                    onIonChange={(e) => setLocationBarcode(e.detail.value!)}
                    placeholder="Location Barcode"
                  ></IonInput>
                </IonItem>
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
                        {loc.locationName}
                      </IonSelectOption>
                    ))}
                  </IonSelect>
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
          </IonRow>
          <IonRow>
            <IonCol size="2"></IonCol>
            <IonCol size="7">
              <IonItem>
                <IonInput
                  clearOnEdit
                  placeholder="Quantity"
                  type="number"
                  value={quantity}
                  onIonChange={(e) => setQuantity(e.detail.value!)}
                ></IonInput>
              </IonItem>
            </IonCol>
            <IonCol></IonCol>
          </IonRow>
          <IonRow>
            <IonCol>
              <IonButton
                fill="solid"
                color="primary"
                onClick={CycleCountUpdateHandler}
              >
                Update Cycle Count Job
              </IonButton>
            </IonCol>
          </IonRow>
          <IonRow>
            <IonCol>
              <IonTextarea readonly value={message}></IonTextarea>
            </IonCol>
          </IonRow>
        </IonGrid>
      </IonContent>
    </IonPage>
  );
};

export default Quality;
