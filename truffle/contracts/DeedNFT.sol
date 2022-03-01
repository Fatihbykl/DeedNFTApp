// SPDX-License-Identifier: MIT

pragma solidity >=0.8.0 <0.9.0;

import "@openzeppelin/contracts/token/ERC721/extensions/ERC721Enumerable.sol";
import "@openzeppelin/contracts/access/Ownable.sol";
import "./Base64.sol";

contract DeedNFT is ERC721Enumerable, Ownable {
  using Strings for uint256;

  struct NFTInfo {
    uint ID;
    address owner;
    bytes8 name;
    bytes16 province;
    bytes16 area;
    bytes24 county;
    bytes32 district;
    bytes32 coordinates;
  }

  mapping (uint256 => NFTInfo) public nftInfo;
  
  constructor() ERC721("Tapu NFT", "TNFT") {}

  function mint(
    bytes16 _province,
    bytes16 _area,
    bytes24 _county,
    bytes32 _district,
    bytes32 _coordinates
  ) public payable {
    uint256 supply = totalSupply();
    
    NFTInfo memory newDeed = NFTInfo(
      supply + 1,
      msg.sender,
      '# TNFT #',
      _province,
      _area,
      _county,
      _district,
      _coordinates
    );
    
    nftInfo[supply + 1] = newDeed;
    _safeMint(msg.sender, supply + 1);
  }

  function randomNum(uint256 _mod, uint256 _seed, uint _salt) internal view returns(uint256) {
      return uint(keccak256(abi.encodePacked(block.timestamp, msg.sender, _seed, _salt))) % _mod;
  }

  function buildImage(uint256 _tokenId) public view returns(string memory) {
      NFTInfo memory currentDeed = nftInfo[_tokenId];
      return Base64.encode(bytes(
          abi.encodePacked(
              '<svg width="300" height="300" xmlns="http://www.w3.org/2000/svg">',
              '<rect fill="hsl(', randomNum(361, block.timestamp, totalSupply()).toString() ,', 100%, 60%)" x="0" y="0" width="300" height="50"/>',
              '<rect fill="hsl(', randomNum(361, block.difficulty, totalSupply()).toString() ,', 100%, 60%)" y="50" width="300" height="170"/>',
              '<text x="79.52084" y="32.31707" font-size="24" font-family="Courier New, monospace" font-weight="bold">TAPU SENED\xc4\xb0</text>',
              '<text x="7" y="85.38211" font-size="13" font-family="Courier New, monospace" font-weight="bold">Tapu No:</text>',
              '<text x="95.33333" y="85.86992" font-size="13" font-family="Courier New, monospace" font-weight="bold">', currentDeed.ID,'</text>',
              '<text x="7" y="105.82113" font-size="13" font-family="Courier New, monospace" font-weight="bold">\xc4\xb0l:</text>',
              '<text x="95.33333" y="105.82113" font-size="13" font-family="Courier New, monospace" font-weight="bold">', currentDeed.province,'</text>',
              '<text x="7" y="125.82113" font-size="13" font-family="Courier New, monospace" font-weight="bold">\xc4\xb0l\xc3\xa7e:</text>',
              '<text x="95.33333" y="125.82113" font-size="13" font-family="Courier New, monospace" font-weight="bold">', currentDeed.county,'</text>',
              '<text x="7" y="145.8645" font-size="13" font-family="Courier New, monospace" font-weight="bold">Mahalle:</text>',
              '<text x="95.33333" y="145.82113" font-size="13" font-family="Courier New, monospace" font-weight="bold">', currentDeed.district,'</text>',
              '<text x="7" y="166.33333" font-size="13" font-family="Courier New, monospace" font-weight="bold">Y\xc3\xbcz\xc3\xb6l\xc3\xa7\xc3\xbcm\xc3\xbc:</text>',
              '<text x="95.33333" y="166.33333" font-size="13" font-family="Courier New, monospace" font-weight="bold">', currentDeed.area,'p</text>',
              '<text x="7" y="186.33333" font-size="13" font-family="Courier New, monospace" font-weight="bold">Koordinat:</text>',
              '<text x="95.33333" y="186.33333" font-size="13" font-family="Courier New, monospace" font-weight="bold">', currentDeed.coordinates,'</text>',
              '<rect fill="hsl(', randomNum(361, block.difficulty, totalSupply() + 1).toString() ,', 100%, 60%)" y="220" width="300" height="80"/>',
              '<text x="7" y="240.2439" font-size="13" font-family="Courier New, monospace" font-weight="bold">Sahibi:</text>',
              '<text x="7" y="260.4878" font-size="13" font-family="Courier New, monospace" font-weight="bold">0x0000000000000000000000000000</text>',
              '<text x="7" y="280.4878" font-size="13" font-family="Courier New, monospace" font-weight="bold">Fatih Baykal</text>',
              '</svg>'
          )
      ));
  }
  
  function buildMetadata(uint256 _tokenId) public view returns(string memory) {
      NFTInfo memory currentDeed = nftInfo[_tokenId];
      return string(abi.encodePacked(
              'data:application/json;base64,', Base64.encode(bytes(abi.encodePacked(
                          '{"name":"', 
                          currentDeed.name,
                          '", "image": "', 
                          'data:image/svg+xml;base64,', 
                          buildImage(_tokenId),
                          '"}')))));
  }

  function tokenURI(uint256 _tokenId) public view virtual override returns (string memory) {
      require(_exists(_tokenId),"ERC721Metadata: URI query for nonexistent token");
      return buildMetadata(_tokenId);
  }

  function withdraw() public payable onlyOwner {
    (bool os, ) = payable(owner()).call{value: address(this).balance}("");
    require(os);
  }
}