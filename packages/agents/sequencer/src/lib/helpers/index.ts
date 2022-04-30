import { gelatoSend, isChainSupportedByGelato, getGelatoRelayerAddress } from "./relayer";
import {
  encodeExecuteFromBids,
  getDestinationLocalAsset,
  recoverRouterPathPayload,
  deriveTransferId,
} from "./auctions";

export const getHelpers = () => {
  return {
    relayer: {
      gelatoSend,
      isChainSupportedByGelato,
      getGelatoRelayerAddress,
    },
    auctions: {
      encodeExecuteFromBids,
      getDestinationLocalAsset,
      recoverRouterPathPayload,
      deriveTransferId,
    },
  };
};
