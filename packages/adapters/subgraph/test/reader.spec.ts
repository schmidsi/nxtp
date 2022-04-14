import { expect } from "@connext/nxtp-utils";

describe("Subgraph:SubgraphReader", () => {
  describe("#create", () => {
    it("happy: should create new instance", () => {});
    it("happy: should return the instance already created", () => {});
  });

  describe("#getAssetBalance", () => {
    it("Not implemented", () => {});
  });

  describe("#isRouterApproved", () => {
    it("Not implemented", () => {});
  });

  describe("#isAssetApproved", () => {
    it("Not implemented", () => {});
  });

  describe("#getAssetByLocal", () => {
    it("happy: should get asset by local from the subgraph", () => {});
    it("should return undefined if the subgraph returns empty array", () => {});
  });

  describe("#getAssetByCanonicalId", () => {
    it("should get asset by canoncial id from the subgraph", () => {});
    it("should return undefined if the subgraph returns empty array", () => {});
  });

  describe("#getTransfers", () => {
    it("happy: should get transfers from the subgraph", () => {});
  });

  describe("#getXCalls", () => {
    it("happy: should get xcalled transfers from the subgraph", () => {});
  });

  describe("#getTransactionsWithStatuses", () => {
    it("happy: should pick up xcalled transfers across the both chains", () => {});
  });
});
