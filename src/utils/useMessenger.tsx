import { CommonSDKEvents } from "@vk-ecosystem/sdk";
import { MessengerEdu } from "../lib/MessengerEdu";
import { useCallback, useRef } from "react";
import { VK_COMMUNITY_ID } from "../../constants";
import { CommonError } from "@vk-ecosystem/sdk/dist/types/common/errors";

export const useMessenger = () => {
  const messengerRef = useRef<MessengerEdu | null>();

  const openMessenger = useCallback(() => {
    if (!messengerRef.current) {
      messengerRef.current = new MessengerEdu({
        styles: {
          right: "0",
          bottom: "0",
        },
      });
      messengerRef.current.on(CommonSDKEvents.ERROR, (er: CommonError) => {
        // messengerRef.current?.close();
        console.warn("CommonSDKEvents.ERROR", er);
      });
      messengerRef.current.on(CommonSDKEvents.CLOSE, () => {
        console.log("CommonSDKEvents.CLOSE");
        messengerRef.current = null;
        openMessenger();
      });
    }

    // Пример настройки можно посмотреть тут: https://id.vk.com/about/business/demo/#/messenger

    messengerRef.current
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
        messengerRef.current?.close();
        console.warn(`${error.code}: ${error.reason}`);
      });
  }, [messengerRef.current]);

  const openMessengerWithPeerId = useCallback(
    (peerId: number) => {
      messengerRef.current?.openPeerId(peerId);
    },
    [messengerRef.current]
  );

  return {
    openMessenger,
    openMessengerWithPeerId,
  };
};
