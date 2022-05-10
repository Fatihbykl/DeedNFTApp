import React, { useState, useContext } from "react";
import { TransactionContext } from "../contexts/context";

function SearchDeed() {
    const { buildImage, putOnSale, removeFromSale, buyTitleDeed, getDeed } = useContext(TransactionContext);
    const [isSearched, setIsSearched] = useState(false);
    const [imgSource, setImageSource] = useState("");
    const [input, setInput] = useState(0);

    const [price, setPrice] = useState(0);
    const [owner, setOwner] = useState(0);
    const [forSale, setForSale] = useState(false);

    const getImage = async (id) => {
        const result = await buildImage(id);
        if(result) {
            setImageSource("data:image/svg+xml;base64," + result);
        }
    }

    const getSaleInfo = async (id) => {
        const result = await getDeed(id);
        setPrice(result[0]);
        setOwner(result[1]);
        setForSale(result[2]);
        console.log(result);
    }

    return(
        <div>
            <form onSubmit={(e) => {e.preventDefault(); setIsSearched(true); getImage(input); getSaleInfo(input)}}>
                <input type="number" placeholder="ID" onChange={(e) => setInput(e.target.value)} />
                <input type="submit" />
            </form>
            <div className={isSearched ? "d-block" : "d-none"}>
                <img src={imgSource} />
                <button onClick={() => {putOnSale(input);}}>Put On Sale</button>
                <button onClick={() => {removeFromSale(input);}}>Remove From Sale</button>
                <div className={forSale ? "d-block" : "d-none"}>
                    Price: { price } 
                    Owner: { owner }
                    <button onClick={() => {buyTitleDeed(input, price);}}>Buy{ price }</button>
                </div>
            </div>
        </div>
    )
}

export default SearchDeed;