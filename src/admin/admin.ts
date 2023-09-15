import { ValidateError } from "tsoa";

import { createTopic, createIdentityNetwork, getIdentityNetwork } from "../services/hedera";
import { hasEnvVar } from "../services/envVars";

interface InitApplicationParams {
  appnetName: string;
  appnetDidServers: string[];
}

export const enum APPLICATION_STATUS {
  INITIALIZING = "INITIALIZING",
  ERROR = "ERROR",
  OK = "OK"
}

export async function initApplication({ appnetName, appnetDidServers }: InitApplicationParams) {
  let didTopicId, vcTopicId;

  try {
    didTopicId = await createTopic(true);
    vcTopicId = await createTopic(true);
  } catch (err) {
    console.error(err);
    throw new ValidateError({}, "Unable to create did and vc topic ids");
  }

  const addressBook = {
    appnetName,
    didTopicId,
    vcTopicId,
    appnetDidServers
  };

  console.log(`Creating AddressBook ${JSON.stringify(addressBook, undefined, 2)}`);

  return createIdentityNetwork(addressBook);
}

export function getApplicationStatus() {
  if (!hasEnvVar("HEDERA_ADDRESS_BOOK_FILEID")) {
    return {
      status: APPLICATION_STATUS.INITIALIZING,
      message: "Please set HEDERA_ADDRESS_BOOK_FILEID environment variable with a valid address book."
    };
  } else {
    const identityNetwork = getIdentityNetwork();

    if (!identityNetwork) {
      return {
        status: APPLICATION_STATUS.ERROR,
        message: "Unable to load identity network, invalid fileId set in HEDERA_ADDRESS_BOOK_FILEID."
      };
    } else {
      return {
        status: APPLICATION_STATUS.OK,
        message: "API ready."
      };
    }
  }
}
