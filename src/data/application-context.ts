import React from "react";

export const baseAPIURL: string = "https://localhost:44376/api";
export const allowManualSelections: boolean = false;


export interface ApplicationToken {
    isLoggedIn: boolean;
    userName: string;
    userId: string;
}

export interface ApplicationSettings {
  useZebraCamera: boolean;
  useBuiltInCamera: boolean;
  useOtherDevice: boolean;
}

export interface User{
  id: string;
  name: string;
}

export interface Inventory{
  id: string;
  locationId: string;
  quantity:string;
  sku: string;
}

export interface Location{
  id: string;
  locationName: string;
}

export interface Order{
  id: string;
}

export interface OrderItem{
  lineItemNumber: string;
  orderId: string;
  quantity:string;
  inventory: Inventory;
  picked: boolean;
}

export interface CycleCount{
  cycleCountId: string;
  recordId: string;
  inventory: Inventory;
  picked: boolean;
}

interface Context {
    token: ApplicationToken;
    appSettings: ApplicationSettings;
    inventory: Inventory[];
    locations: Location[];
    loginUser: (userName: string, userId: string) => void;
    logOutUser: () => void;
    updateZebra: () => void;
    updateBuiltInCamera: () => void;
    updateOtherDevice: () => void;
    getInventory: () => void;
    getLocations: () => void;
    initContext: () => void;
  }

const ApplicationContext = React.createContext<Context>({
    token: {
        isLoggedIn : false,
        userName : '',
        userId: '',
    },
    appSettings: {
      useZebraCamera: false,
      useBuiltInCamera: false,
      useOtherDevice: false
    },
    inventory: [],
    locations: [],
    loginUser: () => {},
    logOutUser: () => {},
    updateZebra: () => {},
    updateBuiltInCamera: () => {},
    updateOtherDevice: () => {},
    getInventory: () => {},
    getLocations: () => {},
    initContext: () => {}
  });

  export default ApplicationContext;
