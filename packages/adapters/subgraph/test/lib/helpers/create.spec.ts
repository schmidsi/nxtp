import { expect } from "@connext/nxtp-utils";
import { create } from "../../../src/lib/helpers/create";
import { mockSubgraphConfig } from "../../mock";

describe("Subgraph:create", () => {
  describe("#create", () => {
    it("happy: should return subgraphMap", async () => {
      const subgraphMap = await create(mockSubgraphConfig);
      expect(subgraphMap.has("1337")).to.be.true;
      expect(subgraphMap.has("1338")).to.be.true;
      expect(subgraphMap.get("1337").runtime).to.be.not.undefined;
      expect(subgraphMap.get("1338").runtime).to.be.not.undefined;
    });
  });
});
