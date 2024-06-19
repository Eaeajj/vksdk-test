import { Config, Connect } from "@vk-ecosystem/sdk";
import { useCallback, useEffect, useRef } from "react";
import { SERVER_PORT, VK_APP_ID } from "../../constants/index";

type AuthorizeResult = {
  superapp_token_v2: string;
  superapp_token: string;
};

type MakeSuperappTokenResult = {
  superapp_token: string;
  superapp_token_v2: string;
  is_partial: boolean;
  user: unknown;
};

export const useAuth = () => {
  debugger;
  Config.init({
    appId: VK_APP_ID,
    connectDomain: "id.vk.com",
    redirectUrl: "http://localhost",
    state: btoa(JSON.stringify({ redirectUri: location.pathname })),
  });

  const superAppToken = useRef<AuthorizeResult>({
    superapp_token: "",
    superapp_token_v2: "",
  });

  const loadSuperAppToken =
    useCallback(async (): Promise<MakeSuperappTokenResult> => {
      const res = await fetch(`http://localhost:${SERVER_PORT}/superapptoken`, {
        method: "GET",
        headers: { "Content-Type": "application/json" },
      });
      return await res.json();
    }, []);

  /**
   * Ф-я проставляет superAppToken для superappkit
   */
  const setSuperAppToken = useCallback(
    async (res: MakeSuperappTokenResult) => {
      Config.setSuperAppToken(res.superapp_token);

      Config.setSuperAppToken(res.superapp_token_v2, { version: 2 });

      superAppToken.current = res;

      console.log("auth success! " + res.superapp_token_v2);

      return res.superapp_token_v2;
    },
    [loadSuperAppToken]
  );

  const handleTokens = useCallback(async () => {
    const tokensResult = await loadSuperAppToken();
    setSuperAppToken(tokensResult);
  }, [setSuperAppToken, loadSuperAppToken]);

  useEffect(() => {
    Config.onLogout(Connect.logout);

    Config.onRequestSuperAppToken(async () => {
      const res = await loadSuperAppToken();
      return res.superapp_token_v2;
    });
  }, []);

  return {
    getAndSetSuperAppToken: handleTokens,
  };
};
