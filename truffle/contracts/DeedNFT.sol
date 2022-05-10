// SPDX-License-Identifier: MIT

pragma solidity >=0.8.0 <0.9.0;

import "../node_modules/@openzeppelin/contracts/token/ERC721/extensions/ERC721Enumerable.sol";
import "../node_modules/@openzeppelin/contracts/utils/Strings.sol";
import "./Base64.sol";

contract DeedNFT is ERC721Enumerable {

  struct TitleDeed {
    uint256 ID;
    uint256 price;
    address owner;
    string province;
    string area;
    string county;
    string district;
    string coordinates;
    bool forSale;
  }

  address contractOwner;
  address marketContract;
  mapping (uint256 => TitleDeed) public allTitleDeeds;
  
  constructor() ERC721("Title Deed NFT", "DNFT") {
    contractOwner = msg.sender;
  }

  function setMarketContract(address _address) public {
    require(marketContract == address(0), "You can set market contract only once!");
    marketContract = _address;
  }

  function mint(
    string memory _province,
    string memory _area,
    string memory _county,
    string memory _district,
    string memory _coordinates
  ) public {
    uint256 supply = totalSupply();
    
    TitleDeed memory newDeed = TitleDeed(
      supply + 1,
      0,
      msg.sender,
      _province,
      _area,
      _county,
      _district,
      _coordinates,
      false
    );
    
    allTitleDeeds[supply + 1] = newDeed;
    _safeMint(msg.sender, supply + 1);
    setApprovalForAll(marketContract, true);
  }

  modifier onlyOwner() {
    require(msg.sender == contractOwner, "You are not owner!");
    _;
  }

  function updateDeedForSale(uint256 _tokenId, uint256 _price, bool _forSale, address _sender) public {
    require(_exists(_tokenId), "Token id not exists!");
    require(ownerOf(_tokenId) == _sender, "You must be owner of the nft!");
    
    TitleDeed storage deed = allTitleDeeds[_tokenId];
    deed.price = _price;
    deed.forSale = _forSale;
  }

  function buyTitleDeed(uint256 _tokenId, address _sender, uint256 _value) public returns(address) { // msg sender kullanıcı olduğu için hata veriyor
    require(_sender != address(0), "Wrong address!");
    require(_exists(_tokenId), "Token id not exists!");
    address deedOwner = ownerOf(_tokenId);
    require(deedOwner != address(0), "Wrong address!");
    require(deedOwner != _sender, "You can't buy your own deed!");
    TitleDeed storage deed = allTitleDeeds[_tokenId];
    require(_value >= deed.price, "Not enough ETH!");
    require(deed.forSale, "This deed not for sale!");

    transferFrom(deedOwner, _sender, _tokenId);
    deed.owner = _sender;
    deed.forSale = false;
    // event onceki sahip, sonraki sahip, timestamp, price vs.
    return deedOwner;
  }

  function getDeed(uint256 _tokenId) public view returns(uint256, address, bool) {
    TitleDeed memory deed = allTitleDeeds[_tokenId];
    return (deed.price, deed.owner, deed.forSale);
  }

  function buildImage(uint256 _tokenId) public view returns(string memory) {
      TitleDeed memory currentDeed = allTitleDeeds[_tokenId];
      return Base64.encode(bytes(
          abi.encodePacked(
              '<svg width="300" height="300" xmlns="http://www.w3.org/2000/svg">',
              '<rect fill="hsl(120, 100%, 60%)" x="0" y="0" width="300" height="50"/>',
              '<rect fill="hsl(220, 100%, 60%)" y="50" width="300" height="170"/>',
              '<text x="79.52084" y="32.31707" font-size="24" font-family="Courier New, monospace" font-weight="bold">TAPU SENED\xc4\xb0</text>',
              '<text x="7" y="85.38211" font-size="13" font-family="Courier New, monospace" font-weight="bold">Tapu No:</text>',
              '<text x="95.33333" y="85.86992" font-size="13" font-family="Courier New, monospace" font-weight="bold">', Strings.toString(currentDeed.ID),'</text>',
              '<text x="7" y="105.82113" font-size="13" font-family="Courier New, monospace" font-weight="bold">\xc4\xb0l:</text>',
              '<text x="95.33333" y="105.82113" font-size="13" font-family="Courier New, monospace" font-weight="bold">', currentDeed.province,'</text>',
              '<text x="7" y="125.82113" font-size="13" font-family="Courier New, monospace" font-weight="bold">\xc4\xb0l\xc3\xa7e:</text>',
              '<text x="95.33333" y="125.82113" font-size="13" font-family="Courier New, monospace" font-weight="bold">', currentDeed.county,'</text>',
              '<text x="7" y="145.8645" font-size="13" font-family="Courier New, monospace" font-weight="bold">Mahalle:</text>',
              '<text x="95.33333" y="145.82113" font-size="13" font-family="Courier New, monospace" font-weight="bold">', currentDeed.district,'</text>',
              '<text x="7" y="166.33333" font-size="13" font-family="Courier New, monospace" font-weight="bold">Y\xc3\xbcz\xc3\xb6l\xc3\xa7\xc3\xbcm\xc3\xbc:</text>',
              '<text x="95.33333" y="166.33333" font-size="13" font-family="Courier New, monospace" font-weight="bold">', currentDeed.area,'</text>',
              '<text x="7" y="186.33333" font-size="13" font-family="Courier New, monospace" font-weight="bold">Koordinat:</text>',
              '<text x="95.33333" y="186.33333" font-size="13" font-family="Courier New, monospace" font-weight="bold">', currentDeed.coordinates,'</text>',
              '<rect fill="hsl(312, 100%, 60%)" y="220" width="300" height="80"/>',
              '<text x="7" y="240.2439" font-size="13" font-family="Courier New, monospace" font-weight="bold">Sahibi:</text>',
              '<text x="7" y="260.4878" font-size="13" font-family="Courier New, monospace" font-weight="bold">0x0000000000000000000000000000</text>',
              '<text x="7" y="280.4878" font-size="13" font-family="Courier New, monospace" font-weight="bold">Fatih Baykal</text>',
              '</svg>'
          )
      ));
  }

  function withdraw(address to) public payable onlyOwner {
    (bool os, ) = payable(to).call{value: address(this).balance}("");
    require(os);
  }

}