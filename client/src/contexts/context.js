import React, { useEffect, useState } from 'react';
import Web3 from 'web3';
import DeedNFT from '../abis/DeedNFT.json';
import DeedSale from '../abis/DeedSale.json'

export const TransactionContext = React.createContext("");

const { ethereum } = window;

const web3 = require("web3");
const DEED_NFT_ADDRESS = "0x6604bc181bb23BCff6A9f790ACF65A88fff6d394";
const DEED_SALE_ADDRESS = "0x4925221c2ada1d9d0CD6A9EaB63ec4A19C9C75e4"

const createContract = () => {
    const web3 = new Web3(ethereum);
    web3.eth.handleRevert = true;
    const contract = new web3.eth.Contract(DeedNFT.abi, DEED_NFT_ADDRESS);
    return contract;
}

const createSaleContract = () => {
    const web3 = new Web3(ethereum);
    web3.eth.handleRevert = true;
    const contract = new web3.eth.Contract(DeedSale.abi, DEED_SALE_ADDRESS);
    return contract;
}

export const TransactionsProvider = ({ children }) => {
    const [currentAccount, setCurrentAccount] = useState("");
    const [balance, setBalance] = useState("");

    const connectWallet = async () => {
        try {
            if(!ethereum) return alert("Please install MetaMask.");
            const accounts = await ethereum.request({method: "eth_requestAccounts"});
            setCurrentAccount(accounts[0]);
        } catch (error) {
            console.log("error on connect wallet -> ", error);
        }
    };

    const checkIfWalletIsConnect = async () => {
        try {
            if(!ethereum) return alert("Please install MetaMask.");
            const accounts = await ethereum.request({method: "eth_accounts"});
            
            if(accounts.length > 0) setCurrentAccount(accounts[0]);
            else console.log("No accounts found.");

            const balanceHex = await ethereum.request({
                method: "eth_getBalance",
                params: [accounts[0], "latest"],
            });
            const balanceWei = web3.utils.hexToNumberString(balanceHex);
            const balance = web3.utils.fromWei(balanceWei, "ether");
            setBalance(balance);

        } catch (error) {
            console.log("Error on checkIfWalletIsConnect -> ", error);
        }
    }

    const mintNFT = async (province, county, district, area, coordinates) => {
        try {
            const contract = createContract();
            await contract.methods.mint(province, area, county, district, coordinates).send({from: currentAccount});
            console.log("Minted NFT!");
        } catch (error) {
            console.log("Error on minting -> ", error);
        }
    }

    const buildImage = async (id) => {
        try { 
            const contract = createContract();
            const image = await contract.methods.buildImage(id).call({from: currentAccount});
            return image;
        } catch (error) {
            console.log("Error on build image -> ", error);
            return false;
        }
    }

    const putOnSale = async (id, price) => {
        try {
            const contract = createSaleContract();
            await contract.methods.putOnSale(id, web3.utils.toWei(price, "ether")).send({from: currentAccount});
        } catch (error) {
            console.log("Error on putOnSale -> ", error);
        }
    }

    const removeFromSale = async (id) => {
        try {
            const contract = createSaleContract();
            await contract.methods.removeFromSale(id).send({from: currentAccount});
        } catch (error) {
            console.log("Error on removeFromSale -> ", error);
        }
    }

    const buyTitleDeed = async (id, price) => {
        try {
            const contract = createSaleContract();
            await contract.methods.buyTitleDeed(id).send({from: currentAccount, value: price });
        } catch (error) {
            console.log("Error on buyTitleDeed -> ", error);
        }
    }

    const getDeed = async (id) => {
        try {
            const contract = createContract();
            let result = await contract.methods.getDeed(id).call({from: currentAccount});
            return result;
        } catch (error) {
            console.log("Error on getDeed -> ", error);
        }
    }

    const getPastTransactions = async (id) => {
        try {
            const contract = createSaleContract();
            const events = await contract.getPastEvents('BuyTitleDeed', {
                filter: { _tokenId: id },
                fromBlock: 0,
                toBlock: 'latest'
            })
            return events;
        } catch (error) {
            console.log("Error on getPastTransactions -> ", error);
        }
    }

    const getUserDeeds = async () => {
        try {
            const contract = createContract();
            const balance = await contract.methods.balanceOfAdress(currentAccount).call({from: currentAccount});
            console.log(balance);
            let imgs = [];
            let ids = [];
            for (let index = 0; index < balance; index++) {
                var id = await contract.methods.tokenOfOwner(currentAccount, index).call({from: currentAccount})
                var img = await buildImage(id);
                
                img = "data:image/svg+xml;base64," + img;
                
                imgs.push(img);
                ids.push(id);
            }
            return [imgs, ids];
        } catch (error) {
            console.log("Error on getUserDeeds -> ", error);
        }
    }

    const approveToken = async (id) => {
        try {
            const contract = createContract();
            await contract.methods.approveToken(DEED_SALE_ADDRESS, id).send({from: currentAccount});
        } catch (error) {
            console.log("Error on approveToken -> ", error);
        }
    }

    const handleChange = (province, county, district, area, coordinates) => {
        console.log(province, county, district, area, coordinates);
        mintNFT(province, county, district, area, coordinates);
    }

    useEffect(() => {
        connectWallet();
        checkIfWalletIsConnect();
    }, [])

    return (
        <TransactionContext.Provider
          value={{
              currentAccount,
              balance,
              connectWallet,
              mintNFT,
              buildImage,
              putOnSale,
              removeFromSale,
              buyTitleDeed,
              getDeed,
              handleChange,
              getPastTransactions,
              getUserDeeds,
              approveToken,
          }}
        >{ children }</TransactionContext.Provider>
    );
};