import { readFileSync } from "fs";

import { Type, Static } from "@sinclair/typebox";
import { ajv, Logger, TChainId, getChainData } from "@connext/nxtp-utils";
import { SdkBaseConfigParams, NetworkSchema, LogLevelScehma, SdkBaseChainConfigParams } from "@connext/nxtp-sdk";
import { Wallet } from "ethers";

export const SdkServerChainConfigSchema = Type.Record(
  TChainId,
  Type.Object({
    providers: Type.Array(Type.String()),
    subgraph: Type.Optional(Type.String()),
  }),
);

export type NxtpSdkServerChainConfig = Static<typeof SdkServerChainConfigSchema>;

export const NxtpSdkServerConfigSchema = Type.Object({
  logLevel: LogLevelScehma,
  network: Type.Optional(NetworkSchema),
  natsUrl: Type.Optional(Type.String()),
  authUrl: Type.Optional(Type.String()),
  messagingMnemonic: Type.Optional(Type.String()),
  skipPolling: Type.Optional(Type.Boolean()),
});

export type NxtpSdkServerConfig = Static<typeof NxtpSdkServerConfigSchema>;

export const getConfig = async (): Promise<SdkBaseConfigParams> => {
  let configFile: any = {};

  try {
    let json: string;

    if (process.env.NXTP_SDK_SERVER_CONFIG_FILE) {
      json = readFileSync(process.env.NXTP_SDK_SERVER_CONFIG_FILE, "utf-8");
    } else {
      json = readFileSync("config.json", "utf-8");
    }
    if (json) {
      configFile = JSON.parse(json);
    }
  } catch (e) {
    console.error("config file parse error");
  }

  const serverConfig: NxtpSdkServerConfig = {
    network: process.env.NXTP_NETWORK || configFile.network,
    natsUrl: process.env.NXTP_NATS_URL || configFile.natsUrl,
    authUrl: process.env.NXTP_AUTH_URL || configFile.authUrl,
    logLevel: process.env.NXTP_LOG_LEVEL || configFile.logLevel || "info",
    skipPolling: process.env.NXTP_SKIP_POLLING || configFile.skipPolling,
  };

  const validate = ajv.compile(NxtpSdkServerConfigSchema);
  const valid = validate(serverConfig);
  if (!valid) {
    throw new Error(validate.errors?.map((err: any) => err.message).join(","));
  }

  const chainData = await getChainData();

  let chainConfig: NxtpSdkServerChainConfig = {};
  const _chainData = Object.fromEntries(chainData!);

  Object.keys(_chainData).forEach((key, value) => {
    chainConfig[Number(key)] = {
      providers: _chainData[key].rpc,
      // subgraph: _chainData[key].subgraph,
    };
  });

  const config: SdkBaseConfigParams = {
    chainConfig: chainConfig,
    signerAddress: new Promise((resolve, reject) => {
      resolve("0x0000000000000000000000000000000000000000");
    }),
    logger: new Logger({ name: "sdk-server", level: serverConfig.logLevel }),
    network: serverConfig.network,
    natsUrl: serverConfig.natsUrl,
    authUrl: serverConfig.authUrl,
    skipPolling: serverConfig.skipPolling,
    chainData: chainData,
  };

  return config;
};
