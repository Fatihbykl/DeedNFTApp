const Base64 = artifacts.require("Base64");
const DeedNFT = artifacts.require("DeedNFT");
const DeedSale = artifacts.require("DeedSale");

module.exports = function (deployer) {
  deployer.deploy(Base64);
  deployer.deploy(DeedNFT).then(function() {
    return deployer.deploy(DeedSale, DeedNFT.address);
  })
};