import { providers, Wallet, utils } from "ethers";
import { createStubInstance } from "sinon";

import { expect } from "../../src/mocks";
import {
  recoverRouterPathPayload,
  signRouterPathPayload,
  encodeRouterPathPayload,
  getRandomBytes32,
  deriveTransferId,
} from "../../src";

const { arrayify, hexlify, solidityKeccak256 } = utils;

describe("signHandleRelayerPayload / recoverRouterPathPayload", () => {
  it("should work when there is no provider", async () => {
    const transferId = getRandomBytes32();
    const feePercentage = "1";

    const signer = Wallet.createRandom();
    const sig = await signRouterPathPayload(transferId, feePercentage, signer);

    expect(recoverRouterPathPayload(transferId, feePercentage, sig)).to.be.eq(signer.address);
  });

  it("should work when there is a provider", async () => {
    const transferId = getRandomBytes32();
    const feePercentage = "1";
    const signer = Wallet.createRandom();

    const msg = arrayify(solidityKeccak256(["bytes"], [encodeRouterPathPayload(transferId, feePercentage)]));
    const provider = createStubInstance(providers.Web3Provider);
    (provider as any)._isProvider = true;
    const stubSig = await signer.signMessage(msg);
    provider.send.resolves(stubSig);

    const sig = await signRouterPathPayload(transferId, feePercentage, signer.connect(provider));
    expect(sig).to.be.deep.eq(stubSig);
    const [method, args] = provider.send.getCall(0).args;
    expect(provider.send.callCount).to.be.eq(1);
    expect(method).to.be.eq("personal_sign");
    expect(args[0].toString()).to.be.eq(hexlify(msg));
    expect(args[1]).to.be.eq(signer.address);
  });
});

describe("deriveTransferId", () => {
  it("should work", () => {
    const args = {
      nonce: 46,
      params: {
        originDomain: 2221,
        destinationDomain: 1111,
        to: "0x5a9e792143bf2708b4765c144451dca54f559a19",
        callData: "0x",
      },
      originSender: "0x30c9e1d6b14283c645f6bb15abb590345b63ab6e",
      tokenId: "0x000000000000000000000000b5aabb55385bfbe31d627e2a717a7b189dda4f8f",
      tokenDomain: "2221",
      amount: "150000000000000000",
    };
    const expected = "0xea7a7d649bf70ee5e78ab23d7746f7747aaec102727570700aced194136be19b";
    const derived = deriveTransferId(args as any);
    expect(derived).to.be.eq(expected);
  });
});
