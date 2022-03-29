import { ApplicationRef } from "@angular/core";
import React, { useEffect, useState, useCallback } from "react";
import { Plugins } from "@capacitor/core";
import { useHistory } from "react-router-dom";
import axios from "axios";
import ApplicationContext, {
  ApplicationToken,
  ApplicationSettings,
  Inventory,
  Location,
  baseAPIURL,
} from "./application-context";



const ApplicationContextProvider: React.FC = (props) => {
  const { Storage } = Plugins;
  const history = useHistory();

  const [token, setToken] = useState<ApplicationToken>({
    isLoggedIn: false,
    userName: "",
    userId: "", 
  });

  const [appSettings, setAppSettings] = useState<ApplicationSettings>({
    useBuiltInCamera: false,
    useZebraCamera: false,
    useOtherDevice: false,
  });

  const [inventory, setInventory] = useState<Inventory[]>([]);
  const [locations, setLocations] = useState<Location[]>([]);

  //called everytime appSettings is changed.
  useEffect(() => {
    Storage.set({ key: "appSettings", value: JSON.stringify(appSettings) });
  }, [appSettings]);

  const loginUser = (userName: string, userId: string) => {
    const newToken: ApplicationToken = {
      userName: userName,
      isLoggedIn: true,
      userId: userId,
    };
    setToken(newToken);
    getInventory();
    getLocations();
  };

  const logOutUser = () => {
    const newToken: ApplicationToken = {
      userName: "",
      isLoggedIn: false,
      userId: "",
    };
    setToken(newToken);
  };

  const updateZebra = () => {
    const newSetting: ApplicationSettings = {
      useZebraCamera: true,
      useBuiltInCamera: false,
      useOtherDevice: false,
    };
    setAppSettings(newSetting);
  };

  const updateBuiltInCamera = () => {
    const newSetting: ApplicationSettings = {
      useZebraCamera: false,
      useBuiltInCamera: true,
      useOtherDevice: false,
    };
    setAppSettings(newSetting);
  };

  const getInventory = () => {
    axios
      .get(
        baseAPIURL + "/Lookup/GetAvailableInventory"
      )
      .then((response) => response.data)
      .then((data: Inventory[]) => {
        console.log(data);
        setInventory((curInventory) => {
          return curInventory.concat(data);
        });
        console.log(inventory);
      });
  };

  const getLocations = () => {
    axios
    .get(
      baseAPIURL + "/Lookup/GetLocations"
    )
    .then((response) => response.data)
    .then((data: Location[]) => {
      console.log(data);
      setLocations(data);
      console.log(inventory);
    });
  };

  const updateOtherDevice = () => {
    const newSetting: ApplicationSettings = {
      useZebraCamera: false,
      useBuiltInCamera: false,
      useOtherDevice: true,
    };
    setAppSettings(newSetting);
  };

  const initContext = useCallback(async () => {
    const localAppSettings = await Storage.get({ key: "appSettings" });
    const parsedSettings = localAppSettings.value
      ? JSON.parse(localAppSettings.value)
      : [];
    setAppSettings(parsedSettings);
  }, []);

  return (
    <ApplicationContext.Provider
      value={{
        token,
        appSettings,
        inventory,
        locations,
        loginUser,
        logOutUser,
        updateZebra,
        updateBuiltInCamera,
        updateOtherDevice,
        getInventory,
        getLocations,
        initContext
      }}
    >
      {props.children}
    </ApplicationContext.Provider>
  );
};

export default ApplicationContextProvider;
