const DeedNFT = artifacts.require("DeedNFT");

const web3 = require("Web3");
contract("DeedNFT contract test", async accounts => {
    it("should mint nft", async () => {
        
        const instance = await DeedNFT.new();

        const province = web3.utils.asciiToHex("province");
        const area = web3.utils.asciiToHex("area");
        const county = web3.utils.asciiToHex("county");
        const district = web3.utils.asciiToHex("district");
        const coordinates = web3.utils.asciiToHex("coordinates");

        instance.mint(province, area, county, district, coordinates);
        const img = instance.buildImage(1);
    })
})