import React, { useState, useContext } from "react";
import { TransactionContext } from "../contexts/context";
import Web3 from "web3";

function SearchDeed() {
    const { buildImage, putOnSale, removeFromSale, buyTitleDeed, getDeed, getPastTransactions } = useContext(TransactionContext);
    const [isSearched, setIsSearched] = useState(false);
    const [imgSource, setImageSource] = useState("");
    const [input, setInput] = useState(0);
    const [events, setEvents] = useState([]);

    const [price, setPrice] = useState(0);
    const [owner, setOwner] = useState(0);
    const [forSale, setForSale] = useState("");

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
        if (result[2]) { setForSale("For Sale") }
        else { setForSale("Not For Sale") }
    }

    const getTransactions = async (id) => {
        const e = await getPastTransactions(id)
        const list = [];
        for (let index = 0; index < e.length; index++) {
            var dateObj = new Date(parseInt(e[index].returnValues._timestamp));
            var date = dateObj.getDate()+
                        "/"+(dateObj.getMonth()+1)+
                        "/"+dateObj.getFullYear();
            e[index].returnValues._timestamp = date;

            var price = e[index].returnValues._price;
            e[index].returnValues._price = Web3.utils.fromWei(price, 'ether');

            list.push(e[index].returnValues);
        }
        setEvents(list);
    }

    return(
        <div className="container">
            <form className="" onSubmit={(e) => {e.preventDefault(); getTransactions(input);setIsSearched(true); getImage(input); getSaleInfo(input)}}>                
                <div className="row mt-5">
                    <div className="col-md-10 pe-0">
                        <input type="number" id="search-bar" placeholder="ID" min="1" className="float-start" onChange={(e) => setInput(e.target.value)} />
                    </div>
                    <div className="col-md-2">
                        <input type="submit" value="Search" className="search-icon btn btn-outline-primary button-border-purp width-100 height-100" />
                    </div>
                </div>
            </form>
            <hr style={{"borderColor": "#3c4250", "opacity": "1"}}/>
            <div className={isSearched ? "d-block" : "d-none"}>
                <img style={{"width": "330px"}} src={imgSource} className="mx-auto d-block" />
                <div className="row mt-4">
                    <div className="col-md-6">
                        <div className="th">
                            Status
                        </div>
                    </div>
                    <div className="col-md-6">
                        <div className="tc">
                            { forSale }
                        </div>
                    </div>
                </div>
                {
                    forSale == "For Sale" ? 
                    <div>
                        <div className="row mt-2">
                            <div className="col-md-6">
                                <div className="th">
                                    Buy
                                </div>
                            </div>
                            <div className="col-md-6">
                                <div className="tc">
                                    <button className="btn btn-outline-primary button-border-purp" onClick={() => {buyTitleDeed(input, price);}}>Buy</button>
                                </div>
                            </div>
                        </div>
                        <div className="row mt-2">
                        <div className="col-md-6">
                            <div className="th">
                                Price
                            </div>
                        </div>
                        <div className="col-md-6">
                            <div className="tc">
                                { Web3.utils.fromWei(price, 'ether') } ETH
                            </div>
                        </div>
                    </div>
                    </div>
                    : <small></small>
                }
                <div className="row mt-2">
                    <div className="col-md-6">
                        <div className="th">
                            Owner
                        </div>
                    </div>
                    <div className="col-md-6">
                        <div className="tc">
                            { owner }
                        </div>
                    </div>
                </div>
                <hr />
                <div className="row mt-2">
                    <div className="col-md-12">
                        <div className="th text-center pe-0">
                            Previous Purchases
                        </div>
                    </div>
                    { events.length ? 
                    <div className="col-md-12">
                        <div className="tc">
                            <table class="rwd-table mx-auto">
                                <tr>
                                    <th>Date</th>
                                    <th>From</th>
                                    <th>To</th>
                                    <th>Price</th>
                                </tr>
                                {
                                    events.map(e => {
                                        return (
                                            <tr>
                                                <td>{e._timestamp}</td>
                                                <td>{e._oldOwner}</td>
                                                <td>{e._newOwner}</td>
                                                <td>{e._price} ETH</td>
                                            </tr>
                                        )
                                    })
                                }
                            </table>
                        </div>
                    </div>
                    :
                    <p style={{"textAlign": "center"}}>Not Found</p>
                    }
                </div>
            </div>
        </div>
    )
}

export default SearchDeed;