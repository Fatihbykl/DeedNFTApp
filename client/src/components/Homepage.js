import React, { useContext } from 'react';
import { TransactionContext } from '../contexts/context';

function Homepage() {
    const { mintNFT, buildImage, connectWallet } = useContext(TransactionContext);
    let image;
    return(
        <div>
            <button onClick={() => {mintNFT()}}>Mint NFT</button>
            <button onClick={() => {image = buildImage();}}>Build Image</button>
        </div>
    );
}

export default Homepage;