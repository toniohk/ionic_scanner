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
import React, { useState, useEffect, useContext } from "react";
import { BarcodeScanner } from "@ionic-native/barcode-scanner/ngx";
import MainHeader from "../components/MainHeader";
import { scanCircleSharp } from "ionicons/icons";
// import { Plugins, CameraSource, CameraResultType } from "@capacitor/core";
import axios from "axios";
import ApplicationContext, {
  Inventory,
  Location,
  baseAPIURL,
  Order,
  OrderItem,
  allowManualSelections,
} from "../data/application-context";

const Deliver: React.FC = () => {
  const [orderBarcode, setOrderBarcode] = useState<string>("");
  const [orderManual, setOrderManual] = useState<boolean>(true);
  const [inventoryManual, setInventoryManual] = useState<boolean>(false);
  const [inventoryBarcode, setInventoryBarcode] = useState<string>("");
  const [locationManual, setLocationManual] = useState<boolean>(false);
  const [locationBarcode, setLocationBarcode] = useState<string>("");
  // const [inventory, setInventory] = useState<Inventory[]>([]);
  // const [locations, setLocations] = useState<Location[]>([]);
  const [message, setMessage] = useState<string>("");
  const [showLoading, setShowLoading] = useState(false);
  const [orders, setOrders] = useState<string[]>([]);
  const [lineItems, setLineItems] = useState<OrderItem[]>([]);
  const [quantity, setQuantity] = useState<string>("");

  const applicationCtx = useContext(ApplicationContext);
  const barCodeScanner = new BarcodeScanner();

  useIonViewWillLeave(() => {
    setOrderBarcode("");
    setOrderManual(false);
    setInventoryBarcode("");
    setInventoryManual(false);
    setLocationBarcode("");
    setLocationManual(false);
    setMessage("");
    setQuantity("");
    setShowLoading(false);
    setLineItems([]);
  });

  useIonViewDidEnter(() => {
    getOrders();
  });

  const getOrders = () => {
    setShowLoading(true);
    axios
      .get(baseAPIURL + "/Shipping/GetOpenOrders")
      .then((response) => response.data)
      .then((data: string[]) => {
        console.log(data);
        setOrders(data);
      })
      .finally(() => {
        setShowLoading(false);
      });
  };

  const OnOrderSelectChanged = (e:any) => {
    setOrderBarcode(e.detail.value!);
    LookupOrder(e.detail.value!);
  };

  const LookupOrder = (orderNumber: string) => {
    setShowLoading(true);
    axios
      .post(baseAPIURL + "/Shipping/GetOrderLineItems", {
        orderId: orderNumber,
      })
      .then((response) => response.data)
      .then((data: [OrderItem]) => {
        console.log(data);
        setLineItems(data);
      })
      .finally(() => {
        setShowLoading(false);
      });
  };

  const OrderLookupHandler = () => {
    setShowLoading(true);
    axios
      .post(baseAPIURL + "/Shipping/GetOrderLineItems", {
        orderId: orderBarcode,
      })
      .then((response) => response.data)
      .then((data: [OrderItem]) => {
        console.log(data);
        setLineItems(data);
      })
      .finally(() => {
        setShowLoading(false);
      });
  };

  const LineItemPickedHandler = () => {
    var invNumber = inventoryBarcode;
    var locNumber = locationBarcode;

    axios
      .post(baseAPIURL + "/Shipping/LineItemPicked", {
        orderNumber: orderBarcode,
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
        OrderLookupHandler();
      });
  };

  const ReadOrderBarcodeHandler = () => {
    barCodeScanner.scan().then((barcodeData) => {
      console.log("Barcode Data: ", barcodeData);
      setOrderBarcode(barcodeData.text);
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
              <h1>Deliver</h1>
            </IonCol>
          </IonRow>
          <IonRow>
            <IonCol size="2">
              {/* <IonLabel>Manual</IonLabel>
              <IonCheckbox
                checked={orderManual}
                onClick={() => setOrderManual(!orderManual)}
              ></IonCheckbox> */}
            </IonCol>
            {!orderManual && (
              <IonCol size="7">
                <IonItem>
                  <IonInput
                    clearOnEdit
                    value={orderBarcode}
                    onIonChange={(e) => setOrderBarcode(e.detail.value!)}
                    placeholder="Order Barcode"
                  ></IonInput>
                </IonItem>
              </IonCol>
            )}
            {orderManual && (
              <IonCol size="7">
                <IonItem>
                  <IonSelect
                    placeholder="Select Order"
                    value={orderBarcode}
                    onIonChange={OnOrderSelectChanged}
                  >
                    {orders.map((order) => (
                      <IonSelectOption value={order}>{order}</IonSelectOption>
                    ))}
                  </IonSelect>
                </IonItem>
              </IonCol>
            )}
            {/* {!orderManual && (
              <IonCol>
                {applicationCtx.token.useBuiltInCamera && (
                  <IonButton onClick={ReadOrderBarcodeHandler}>
                    <IonIcon slot="icon-only" icon={scanCircleSharp}></IonIcon>
                  </IonButton>
                )}
              </IonCol>
            )} */}
          </IonRow>
          <IonRow>
            <IonCol>
              <IonButton
                fill="solid"
                color="primary"
                onClick={OrderLookupHandler}
              >
                Refresh Order
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
                <IonCol>Status</IonCol>
              </IonRow>
              {lineItems.map((lineItem) => (
                <IonRow className={lineItem.picked ? "picked" : "notpicked"}>
                  <IonCol>{lineItem.inventory.sku}</IonCol>
                  <IonCol>{lineItem.inventory.locationId}</IonCol>
                  <IonCol>{lineItem.quantity}</IonCol>
                  {lineItem.picked && <IonCol>Picked</IonCol>}
                  {!lineItem.picked && <IonCol>Not Picked</IonCol>}
                </IonRow>
              ))}
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
                  value={quantity}
                  type="number"
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
                onClick={LineItemPickedHandler}
              >
                Pick Item
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

export default Deliver;
