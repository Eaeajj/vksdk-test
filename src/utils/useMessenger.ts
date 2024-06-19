import { CommonSDKEvents, Config } from "@vk-ecosystem/sdk";
import { MessengerEdu } from "../lib/MessengerEdu";

import { VK_COMMUNITY_ID } from "../../constants";
import { ref } from "vue";
import { CommonError } from "@vk-ecosystem/sdk/dist/types/common/errors";

export const useMessenger = () => {
  const messengerRef = ref<MessengerEdu | null>(null);

  const openMessenger = () => {
    console.log(Config.get());

    if (!messengerRef.value) {
      messengerRef.value = new MessengerEdu({
        styles: {
          right: "0",
          bottom: "0",
        },
      });
      messengerRef.value.on(CommonSDKEvents.ERROR, (er: CommonError) => {
        // messengerRef.value?.close();
        console.warn("CommonSDKEvents.ERROR", er);
      });
      messengerRef.value.on(CommonSDKEvents.CLOSE, () => {
        console.log("CommonSDKEvents.CLOSE");
        messengerRef.value = null;
        openMessenger();
      });
    }

    // Пример настройки можно посмотреть тут: https://id.vk.com/about/business/demo/#/messenger

    messengerRef.value
      .open({
        expanded: true,
        messageSound: true,
        openSound: false,
        mode: "extended",
        expandTimeout: 0,
        scheme: "bright_light",
        peer_id: -Number(VK_COMMUNITY_ID),
        owner_id: -VK_COMMUNITY_ID,
      })
      .catch((error) => {
        messengerRef.value?.close();
        console.warn(`${error.code}: ${error.reason}`);
      });
  };

  const openMessengerWithPeerId = (peerId: number) => {
    messengerRef.value?.openPeerId(peerId);
  };

  return {
    openMessenger,
    openMessengerWithPeerId,
  };
};
