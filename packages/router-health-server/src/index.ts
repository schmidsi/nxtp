import fastify from "fastify";
import { providers } from "ethers";
import pino from "pino";
import { ajv, Logger, TChainId } from "@connext/nxtp-utils";
import { Type } from "@sinclair/typebox";
import {
  NxtpSdkBase,
  CrossChainParams,
  CrossChainParamsSchema,
  CancelParams,
  CancelSchema,
  ApproveParams,
  ApproveSchema,
} from "@connext/nxtp-sdk";
import {
  AuctionResponse,
  AuctionResponseSchema,
  TransactionPreparedEvent,
  TransactionPreparedEventSchema,
  MetaTxResponse,
} from "@connext/nxtp-utils";

import { getConfig } from "./config";

const LOOP_INTERVAL = 10_000;
export const getLoopInterval = () => LOOP_INTERVAL;

let sdkBaseInstance: NxtpSdkBase;
const serverLogLevel = "info";
const logger = new Logger({ name: "sdk-server", level: serverLogLevel });
const server = fastify({ logger: logger instanceof pino, pluginTimeout: 300_000, disableRequestLogging: false });

/// REQUEST PATHS

const routerHealthSchema = {};

const getRouterHealth = async (requestee: string) => {
  setInterval(async () => {
    const status = await sdkBaseInstance.getRouterStatus(requestee);
    console.log(status);

    status.map((s) =>
      s.supportedChains.map(async (chainId) => {
        console.log(chainId);
        const balance = await sdkBaseInstance.getRouterLiquidity(s.routerAddress, chainId);
        console.log(balance);
      }),
    );
  }, getLoopInterval());
};

const getRouterStatus = "/get-router-status";
// const getHistoricalTransactions = "/get-historical-transactions";
// const getTransferQuote = "/get-transfer-quote";
// const approveForPrepare = "/approve-for-prepare";
// const prepareTransfer = "/prepare-transfer";
// const fulfillTransfer = "/fulfill-transfer";
// const cancel = "/cancel";

/// REPLY PATHS

server.listen(8080, (err, address) => {
  if (err) {
    console.error(err);
    process.exit(1);
  }
  console.log(`Server listening at ${address}`);
});

server.addHook("onReady", async () => {
  const config = await getConfig();

  sdkBaseInstance = new NxtpSdkBase(config);
  getRouterHealth("heatlh-server");
});

server.get("/", async () => {
  console.log(`Server listening`);
  return "welcome to connext!\n";
});

server.get("/ping", async () => {
  return "pong\n";
});

server.get(getRouterStatus, async (request, response) => {
  // console.log(sdkBaseInstance);

  const res = await sdkBaseInstance.getRouterStatus("requestee");
  return response.status(200).send(res);
});
