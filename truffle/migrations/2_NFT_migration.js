const Base64 = artifacts.require("Base64");
const DeedNFT = artifacts.require("DeedNFT");

module.exports = function (deployer) {
  deployer.deploy(Base64);
  deployer.deploy(DeedNFT);
};