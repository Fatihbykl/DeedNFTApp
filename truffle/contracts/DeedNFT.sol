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

  function balanceOfAdress(address _address) public view returns(uint256){
    return balanceOf(_address);
  }

  function tokenOfOwner(address _address, uint256 _index) public view returns(uint256){
    return tokenOfOwnerByIndex(_address, _index);
  }

  function approveToken(address _to, uint256 _tokenId) public {
    approve(_to, _tokenId);
  }

  function buyTitleDeed(uint256 _tokenId, address _sender, uint256 _value) public returns(address) {
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
              '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 281 361"><defs><style>.cls-1,.cls-3{fill:#fff;}.cls-1,.cls-2{stroke:#000;}.cls-2{fill:#66f;stroke-width:0.5px;}.cls-3,.cls-4,.cls-5{isolation:isolate;}.cls-3{font-size:20px;letter-spacing:0.1em;}.cls-3,.cls-4{font-family:CourierNewPS-BoldMT, Courier New;font-weight:700;}.cls-4{font-size:12px;}.cls-5{font-size:10px;font-family:CourierNewPSMT, Courier New;}</style></defs>',
              '<g id="Layer_2" data-name="Layer 2"><g id="Layer_1-2" data-name="Layer 1"><g id="VXpKABHdU6NmqH3AM5dyw"><path class="cls-1" d="M.5.5h280v360H.5Z"/></g><g id="HzKt7qGHsrj7QkSaeZZ9B"><path class="cls-2" d="M4.45,5.9h271.6V79.7H4.45Z"/></g>',
              '<text class="cls-3" transform="translate(70.27 48.67)">TITLE DEED</text>',
              '<g><text class="cls-4" transform="translate(20.38 112.81)">DEED ID</text></g>',
              '<g><text class="cls-4" transform="translate(20.38 153.04)">PROVINCE</text></g>',
              '<g><text class="cls-4" transform="translate(20.38 193.27)">COUNTY</text></g>',
              '<g><text class="cls-4" transform="translate(20.38 233.49)">DISTRICT</text></g>',
              '<g><text class="cls-4" transform="translate(20.63 273.72)">AREA</text></g>',
              '<g><text class="cls-4" transform="translate(20.38 313.95)">COORDINATES</text></g>',
              '<g><text class="cls-5" transform="translate(120.75 153.04)">', currentDeed.province ,'</text></g>',
              '<g><text class="cls-5" transform="translate(120.75 193.27)">', currentDeed.county ,'</text></g>',
              '<g><text class="cls-5" transform="translate(120.75 233.49)">', currentDeed.district ,'</text></g>',
              '<g><text class="cls-5" transform="translate(120.75 273.72)">', currentDeed.area ,'</text></g>',
              '<g><text class="cls-5" transform="translate(120.75 313.95)">', currentDeed.coordinates ,'</text></g>',
              '<g><text class="cls-5" transform="translate(120.75 112.81)">', Strings.toString(currentDeed.ID) ,'</text></g></g></g></svg>'
          )
      ));
  }

  function withdraw(address to) public payable onlyOwner {
    (bool os, ) = payable(to).call{value: address(this).balance}("");
    require(os);
  }

}