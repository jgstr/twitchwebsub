"use strict";
import { createSubscriberManager } from "./subscriber";
import { createWeb } from "./adapters/web";
import {
  hubCallback,
  notificationsDatabaseDockerConfig,
  clientID,
  oAuthBearerToken,
} from "./authentications";
import { createDataStore } from "./adapters/data-store";
import { createTwitchAdapter } from "./adapters/twitch";
import { hubUrl as twitchHub } from "./authentications";

export const start = () => {
  const dataStore = createDataStore(notificationsDatabaseDockerConfig);
  const twitchAdapter = createTwitchAdapter(
    twitchHub,
    hubCallback,
    clientID,
    oAuthBearerToken
  );
  const subscriberManager = createSubscriberManager(dataStore, twitchAdapter);
  const subscriptionsWaitingForTwitchApproval = new Map(); // TODO: Remove after moving to subscriber
  const webServer = createWeb(
    subscriptionsWaitingForTwitchApproval,
    subscriberManager
  );
};
