import { AsyncStorage } from "react-native";

const mainPersistConfig = {
  key: "IPCortex",
  storage: AsyncStorage,
  blacklist: ["someEphemeralKey"]
};

const sensitivePersistConfig = {
    key: "IPCortex",
    storage: AsyncStorage,
    blacklist: ["someEphemeralKey2"]
};

export { mainPersistConfig, sensitivePersistConfig };
