import * as Updates from 'expo-updates';
import { useEffect, useState } from 'react';
import Toast from 'react-native-toast-message';

export function useAppUpdate() {
  const [showUpdateBtn, setShowUpdateBtn] = useState(false);

  useEffect(() => {
    if (!__DEV__) {
      (async () => {
        try {
          // проверяем обновление
          const { isAvailable } = await Updates.checkForUpdateAsync();
          if (isAvailable) {
            await Updates.fetchUpdateAsync();
            setShowUpdateBtn(true);
          }
        } catch (e) {
          Toast.show({
            type: "error",
            text1: 'Update check error:',
            text2: String(e)
          });
        }
      })();
    }
  }, []);

  /* действие по кнопке */
  const applyUpdate = async () => {
    await Updates.reloadAsync();
  };

  return {
    showUpdateBtn,
    applyUpdate,
  };
}