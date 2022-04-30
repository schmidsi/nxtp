import { defaultAbiCoder, keccak256 } from "ethers/lib/utils";

import { ExternalCall, ReconciledTransaction } from "..";
import { CallParams } from "../types";

/**
 * Cleans any strings so they replace the newlines and properly format whitespace. Used to translate human readable encoding to contract-compatible encoding.
 *
 * @param str String to clean
 * @returns Cleaned version of the input
 */
export const tidy = (str: string): string => `${str.replace(/\n/g, "").replace(/ +/g, " ")}`;

export const SignedRouterPathEncoding = tidy(`tuple(
  bytes32 transferId,
  uint256 pathLength
)`);

export const ExternalCallDataEncoding = tidy(`tuple(
  address to,
  bytes callData
)`);

export const ReconciledTransactionDataEncoding = tidy(`tuple(
  bytes32 externalHash,
  address local,
  uint256 amount,
  address recipient
)`);

export const TransferIdEncoding = tidy(`tuple(
  uint256 nonce,
)`);

/**
 * Encodes a handleRelayerFee payload object, as defined in the Connext contract
 *
 * @param transferId - The nonce of the origin domain at the time the transaction was prepared. Used to generate
 * the transaction id for the crosschain transaction
 * @param pathLength - The number of routers in the path
 * @returns Encoded handleRelayerFee payload
 */
export const encodeRouterPathPayload = (transferId: string, pathLength: string): string => {
  return defaultAbiCoder.encode([SignedRouterPathEncoding], [{ transferId, pathLength }]);
};

/**
 * Encodes a reconcile transaction payload object, as defined in the Connext contract
 *
 * @param externalHash - Hash of the `ExternalCall`
 * @param local - The address of the bridged asset
 * @param amount - The amount forwarded through the bridge
 * @param recipient - The address that gets the funds on the destination chain
 * @returns Encoded reconcile transaction payload
 */
export const encodeReconcileData = (reconcileData: ReconciledTransaction): string => {
  return defaultAbiCoder.encode([ReconciledTransactionDataEncoding], [reconcileData]);
};

/**
 * Hashes ReconciledData payload object
 *
 * @param reconciledData Object to encode and hash
 * @returns Hash of encode object
 */
export const getReconciledHash = (reconciledData: ReconciledTransaction): string => {
  const digest = keccak256(defaultAbiCoder.encode([ReconciledTransactionDataEncoding], [reconciledData]));
  return digest;
};

/**
 * Encodes an external call transaction payload object, as defined in the Connext contract
 *
 * @param recipient - The address that should receive the funds on the destination domain if no call is
 * specified, or the fallback if an external call fails
 * @param callTo - The address of the receiving chain to execute the `callData` on
 * @param callData - The data to execute on the receiving chain
 * @returns Encoded exteranl call payload
 */
export const encodeExternalCallData = (exteranalCallData: ExternalCall): string => {
  return defaultAbiCoder.encode([ExternalCallDataEncoding], [exteranalCallData]);
};

/**
 * Hashes ExternalCall payload object
 *
 * @param externalCallData Object to encode and hash
 * @returns Hash of encoded object
 */
export const getExternalCallHash = (externalCallData: ExternalCall): string => {
  const digest = keccak256(defaultAbiCoder.encode([ExternalCallDataEncoding], [externalCallData]));
  return digest;
};

/**
 * Encodes a transferId payload object, as defined in the ConnextLogic contract under the
 * `_getTransferId` method. Can be used to produce a valid transfer ID string if hashed using
 * keccak256.
 *
 * @param args.nonce - The nonce of the origin domain at the time of the xcall.
 * @param args.params - The CallParams of the xcall.
 * @param args.originSender - The address of the sender of the xcall.
 * @param args.tokenId - The canonical token ID of the transported asset.
 * @param args.tokenDomain - The domain of the canonical token of the transported asset.
 * @param args.amount - The amount of the transported asset.
 *
 * @returns Encoded transferId payload.
 */
export const encodeTransferIdPayload = (args: {
  nonce: number;
  params: CallParams;
  originSender: string;
  tokenId: string;
  tokenDomain: string;
  amount: string;
}): string => {
  console.log(args);
  return defaultAbiCoder.encode(
    [
      "tuple(uint256 nonce, tuple(address to, bytes callData, uint32 originDomain, uint32 destinationDomain) params, address originSender, bytes32 tokenId, uint32 tokenDomain, uint256 amount)",
    ],
    [
      {
        nonce: args.nonce,
        params: {
          to: args.params.to,
          callData: args.params.callData,
          originDomain: args.params.originDomain,
          destinationDomain: args.params.destinationDomain,
        },
        originSender: args.originSender,
        tokenId: args.tokenId,
        tokenDomain: args.tokenDomain,
        amount: args.amount,
      },
    ],
  );
};
