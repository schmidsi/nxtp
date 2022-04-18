import { SubgraphReaderConfig } from "../src/lib/entities";

export const mockSubgraphConfig: SubgraphReaderConfig = {
  chains: {
    "1337": {
      runtime: [
        {
          query: "https://example.com",
          health: "https://example.com",
        },
      ],
      analytics: [
        {
          query: "https://example.com",
          health: "https://example.com",
        },
      ],
      maxLag: 10,
    },
    "1338": {
      runtime: [
        {
          query: "https://example.com",
          health: "https://example.com",
        },
      ],
      analytics: [
        {
          query: "https://example.com",
          health: "https://example.com",
        },
      ],
      maxLag: 10,
    },
  },
};

export const mockSubgraphEntity = {};
