"use strict";

// https://id.vk.com/about/business/go/docs/ru/vkid/latest/vk-id/tokens/superapp-token

/*
 * Важно: Это пример кода, в продакшен версии необходимо учесть специфичные
 * для вашего проекта особенности в том числе cors
 */

https: process.on("unhandledRejection", (error) => {
  console.error("UnhandledPromiseRejection:");
  console.error(error);
});

import "isomorphic-fetch";

import { createServer as createViteServer } from "vite";

import express from "express";

import bodyParser from "body-parser";

import superAppToken from "./superapp_token.js";

import superAppToken2 from "./superapp_token2.js";
import {
  SERVICE_TOKEN,
  VK_APP_ID,
  SERVER_PORT,
  CLIENT_PORT,
} from "../constants/index.js";

const app = express();

const vite = await createViteServer({
  server: { middlewareMode: true },
  appType: "custom",
});

app.use(vite.middlewares);

app.use(bodyParser.json());
app.get("/authorize", (req, res) => {
  res.send("success");
});

app.get("/", doAuthorize);
app.get("/superapptoken", doMakeSuperAppToken);
app.options("/authorize");

app.listen(SERVER_PORT, () => {
  console.log(`Server started on port ${SERVER_PORT}!`);
});

// BE - храним на бэке
let ACCESS_TOKEN_BE = null;
let IS_PARTIAL_BE = null; // не знаю что это
let USER_PROFILE_BE = null; // не знаю что это

function doAuthorize(req, res) {
  const payload = JSON.parse(req.query.payload);
  const { token, uuid, user } = payload;

  const params = `app_id=${VK_APP_ID}&access_token=${encodeURIComponent(
    SERVICE_TOKEN
  )}&v=5.191&token=${encodeURIComponent(token)}&uuid=${encodeURIComponent(
    uuid
  )}`;

  fetch("https://api.vk.com/method/auth.exchangeSilentAuthToken?" + params, {
    method: "POST",
  })
    .then((res) => res.json())
    .then(async (result) => {
      ACCESS_TOKEN_BE = result.response && result.response.access_token;
      IS_PARTIAL_BE = result.response && result.response.is_partial;
      USER_PROFILE_BE = user;

      if (!ACCESS_TOKEN_BE) {
        console.log("Silent token exchanging error.", result.error);
      }
    })
    .catch(console.error);
  res.redirect(`http://localhost:${CLIENT_PORT}/`);
}

function doMakeSuperAppToken(req, res) {
  res.setHeader("Content-Type", "application/json");

  res.send(
    JSON.stringify({
      superapp_token: makeSuperAppToken(ACCESS_TOKEN_BE),
      superapp_token_v2: makeSuperAppToken2(
        ACCESS_TOKEN_BE,
        "superappkit-web",
        {
          scope: ["messenger"],
        }
      ),
      is_partial: IS_PARTIAL_BE,
      user: USER_PROFILE_BE,
    })
  );
}
function makeSuperAppToken(accessToken) {
  const HOUR = 60 * 60;
  const now = Math.floor(Date.now() / 1000);
  const then = now + HOUR;

  const result = superAppToken.encrypt(
    JSON.stringify({
      access_token: accessToken,
      iat: now,
      exp: then,
    }),
    SERVICE_TOKEN
  );

  return result;
}

function makeSuperAppToken2(accessToken, subject, payload = []) {
  const HOUR = 60 * 60;
  const now = Math.floor(Date.now() / 1000);
  const then = now + HOUR;

  const result = superAppToken2.encrypt(
    JSON.stringify({
      access_token: accessToken,
      iat: now,
      exp: then,
      subject,
      payload,
    }),
    SERVICE_TOKEN
  );

  return result;
}
