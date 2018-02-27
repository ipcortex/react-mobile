import { AsyncStorage } from "react-native";
import createSensitiveStorage from "redux-persist-sensitive-storage";

const sensitiveStorage = createSensitiveStorage({
  keychainService: "myKeychain",
  sharedPreferencesName: "IPCortex"
});

const mainPersistConfig = {
  key: "IPCortex",
  storage: AsyncStorage,
  blacklist: ["someEphemeralKey"]
};

const sensitivePersistConfig = {
  key: "auth",
  storage: sensitiveStorage
};

export { mainPersistConfig, sensitivePersistConfig };
