// SPDX-License-Identifier: MIT
pragma solidity >=0.8.0 <0.9.0;

import "./DeedNFT.sol";

contract DeedSale {

  DeedNFT public contractRef;

  event PutOnSale(address indexed _sender, uint256 _tokenId, uint256 _price);
  event RemoveFromSale(address indexed _sender, uint256 _tokenId);
  event BuyTitleDeed(uint256 indexed _tokenId, address _oldOwner, address _newOwner, uint256 _timestamp, uint256 _price);

  constructor(DeedNFT _address) {
    contractRef = _address;
    contractRef.setMarketContract(address(this));
  }

  function putOnSale(uint256 _tokenId, uint256 _price) public {
    contractRef.updateDeedForSale(_tokenId, _price, true, msg.sender);
    emit PutOnSale(msg.sender, _tokenId, _price);
  }

  function removeFromSale(uint256 _tokenId) public {
    contractRef.updateDeedForSale(_tokenId, 0, false, msg.sender);
    emit RemoveFromSale(msg.sender, _tokenId);
  }

  function buyTitleDeed(uint256 _tokenId) public payable {
    address _oldOwner = contractRef.buyTitleDeed(_tokenId, msg.sender, msg.value);
    payable(_oldOwner).transfer(msg.value);
    emit BuyTitleDeed(_tokenId, _oldOwner, msg.sender, block.timestamp, msg.value);
  }
}