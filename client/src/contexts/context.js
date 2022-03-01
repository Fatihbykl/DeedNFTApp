import React, { useEffect, useState } from 'react';
import Web3 from 'web3';
import DeedNFT from '../abis/DeedNFT.json';

export const TransactionContext = React.createContext("");

const { ethereum } = window;
const web3 = require("web3");

const createContract = () => {
    const web3 = new Web3(ethereum);
    const netID = web3.eth.net.getId();
    const contractAddress = DeedNFT.networks[netID];
    const contract = new web3.eth.Contract(DeedNFT.abi, contractAddress);
    console.log(contract);
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

    const mintNFT = async () => {
        try {
            const contract = createContract();
            console.log(contract);
            await contract.methods.mint().call({from: currentAccount});
            console.log("Minted NFT!");
        } catch (error) {
            console.log("Error on minting -> ", error);
        }
    }

    const buildImage = async () => {
        try {
            const contract = createContract();
            const image = await contract.methods.buildImage().call({from: currentAccount});
            return image;
        } catch (error) {
            console.log("Error on build image -> ", error);
        }
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
          }}
        >{ children }</TransactionContext.Provider>
    );
};