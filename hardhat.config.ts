import { HardhatUserConfig } from "hardhat/config";
import "@nomicfoundation/hardhat-toolbox";
import * as envEnc from "@chainlink/env-enc";
envEnc.config();

const config: HardhatUserConfig = {
  solidity: "0.8.20",
};

export default config;
