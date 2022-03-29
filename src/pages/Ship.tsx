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
  baseAPIURL,
  Order,
  OrderItem,
} from "../data/application-context";

const Ship: React.FC = () => {
  const [orderBarcode, setOrderBarcode] = useState<string>("");
  const [orderManual, setOrderManual] = useState<boolean>(true);
  const [message, setMessage] = useState<string>("");
  const [showLoading, setShowLoading] = useState(false);
  const [orders, setOrders] = useState<string[]>([]);
  const [lineItems, setLineItems] = useState<OrderItem[]>([]);
  const [canShipOrder, setCanShipOrder] = useState<boolean>(false);
  const applicationCtx = useContext(ApplicationContext);
  const barCodeScanner = new BarcodeScanner();

  useIonViewWillLeave(() => {
    cleanSession();
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

  const cleanSession = () => {
    cleanOrder();
    setMessage("");
    setShowLoading(false);
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

  const cleanOrder = () => {
    setOrderBarcode("");
    setOrderManual(true);
    setLineItems([]);
    setCanShipOrder(false);
  };

  const OrderLookupHandler = () => {
    axios
      .post(baseAPIURL + "/Shipping/GetOrderLineItems", {
        orderId: orderBarcode,
      })
      .then((response) => response.data)
      .then((data: [OrderItem]) => {
        console.log(data);
        setLineItems(data);
        var canShip = true;
        data.map((item: OrderItem) => {
          if (item.picked == false) {
            canShip = false;
          }
        });
        setCanShipOrder(canShip);
      })
      .finally(() => {
        setShowLoading(false);
      });
  };

  const ShipOrderHandler = () => {
    axios
      .post(baseAPIURL + "/Shipping/OrderShipped", {
        orderNumber: orderBarcode,
        userId: applicationCtx.token.userId,
      })
      .then((response) => response.data)
      .then((data) => {
        console.log(data);
        setMessage(data.message);
        if (data.result == true) {
          cleanOrder();
        }
      })
      .finally(() => {
        getOrders();
        setShowLoading(false);
      });
  };

  // const ReadOrderBarcodeHandler = () => {
  //   barCodeScanner.scan().then((barcodeData) => {
  //     console.log("Barcode Data: ", barcodeData);
  //     setOrderBarcode(barcodeData.text);
  //   });
  // };

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
            {orders.length == 0 && (
              <IonCol size="7">
                <IonItem>No Open orders</IonItem>
              </IonCol>
            )}
            {orders.length > 0 && !orderManual && (
              <IonCol size="7">
                <IonItem>
                  <IonInput
                    value={orderBarcode}
                    onIonChange={(e) => setOrderBarcode(e.detail.value!)}
                    placeholder="Order Barcode"
                  ></IonInput>
                </IonItem>
              </IonCol>
            )}
            {orders.length > 0 && orderManual && (
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
                  <IonRow className={!lineItem.picked ? "notpicked" : "picked"}>
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
            {canShipOrder && (
              <IonCol>
                <IonButton
                  fill="solid"
                  color="primary"
                  onClick={ShipOrderHandler}
                >
                  Ship Order
                </IonButton>
              </IonCol>
            )}
            {!canShipOrder && <IonCol>Please pick all items to ship.</IonCol>}
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

export default Ship;
