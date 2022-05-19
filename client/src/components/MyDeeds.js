import React, { useContext, useEffect, useState, useRef } from "react";
import { TransactionContext } from '../contexts/context';

function MyDeeds() {
    const { getUserDeeds, approveToken, putOnSale } = useContext(TransactionContext);
    const isMounted = useRef(false);

    const [imgList, setImgList] = useState([]);
    const [idList, setIdList] = useState([]);

    const getDeeds = async () => {
        let deeds = await getUserDeeds();
        if (deeds != undefined) {
            setImgList(deeds[0]);
            setIdList(deeds[1]);
        }
    }

    return(
        <div className="container">
            <button onClick={() => {getDeeds()}}>test</button>
            <div className="row">
            {
                imgList.map((image, index) => {
                    return(
                        <div className="col-md-4" style={{"padding": "30px"}} key={index}>
                            <a href="" class="width-100 float-shadow" data-bs-toggle="modal" data-bs-target={'#deed' + index}>
                                <img src={image} className="" />
                            </a>
                            <div class="modal fade" id={"deed" + index} tabindex="-1" aria-labelledby={"putOnSale" + index} aria-hidden="true">
                                <div class="modal-dialog modal-dialog-centered">
                                    <div class="modal-content">
                                    <div class="modal-header">
                                        <h5 class="modal-title" id={"putOnSale" + index}>Put On Sale</h5>
                                        <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
                                    </div>
                                    <div class="modal-body">
                                        <input className="form-control mt-3 mb-3" type="number" step="0.01" min="0" />
                                    </div>
                                    <div class="modal-footer">
                                        <button onClick={() => approveToken(idList[index])} type="button" class="btn btn-secondary" data-bs-dismiss="modal">Approve</button>
                                        <button onClick={() => putOnSale(idList[index])} type="button" class="btn btn-primary">Put On Sale</button>
                                    </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    )
                })
            }
            </div>
        </div>
    )
}

export default MyDeeds;