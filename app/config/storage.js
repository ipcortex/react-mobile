import { AsyncStorage } from "react-native";
import createSensitiveStorage from "redux-persist-sensitive-storage";

const sensitiveStorage = createSensitiveStorage({
  keychainService: "app",
  sharedPreferencesName: "IPCortex"
});

const mainPersistConfig = {
  key: "IPCortex",
  storage: AsyncStorage,
  timeout: 1000
};

const sensitivePersistConfig = {
  key: "auth",
  storage: sensitiveStorage,
  timeout: 1000
};


export { mainPersistConfig, sensitivePersistConfig };
