import React, { useEffect, useState } from 'react';
import Web3 from 'web3';
import DeedNFT from '../abis/DeedNFT.json';
import DeedSale from '../abis/DeedSale.json'

export const TransactionContext = React.createContext("");

const { ethereum } = window;

const web3 = require("web3");

const createContract = () => {
    const web3 = new Web3(ethereum);
    web3.eth.handleRevert = true;
    const contract = new web3.eth.Contract(DeedNFT.abi, "0xe45297bC4EC27727B0328B445986E0F4734e6FaA");
    return contract;
}

const createSaleContract = () => {
    const web3 = new Web3(ethereum);
    web3.eth.handleRevert = true;
    const contract = new web3.eth.Contract(DeedSale.abi, "0xd7311f60Fc5d4f861d2525E5f8316657F4789d36");
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

    const putOnSale = async (id) => {
        try {
            const contract = createSaleContract();
            await contract.methods.putOnSale(id, web3.utils.toWei("0.1", "ether")).send({from: currentAccount});
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
          }}
        >{ children }</TransactionContext.Provider>
    );
};