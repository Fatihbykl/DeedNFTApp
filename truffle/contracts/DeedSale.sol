// SPDX-License-Identifier: MIT
pragma solidity >=0.8.0 <0.9.0;

import "./DeedNFT.sol";

contract DeedSale {

    DeedNFT public contractRef;

    constructor(DeedNFT _address) {
        contractRef = _address;
    }

    function putOnSale(uint256 _tokenId, uint256 _price) public {
    contractRef.updateDeedForSale(_tokenId, _price, true, msg.sender);
    contractRef.approve(address(this), _tokenId);
    // event
  }

  function removeFromSale(uint256 _tokenId) public {
    contractRef.updateDeedForSale(_tokenId, 0, false, msg.sender);
  }

  function buyTitleDeed(uint256 _tokenId) public payable {
    address oldOwner = contractRef.buyTitleDeed(_tokenId, msg.sender, msg.value);
    payable(oldOwner).transfer(msg.value);
  }
}