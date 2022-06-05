import React, { useContext, useState } from "react";
import { TransactionContext } from '../contexts/context';

function CreateDeed() {
    const { handleChange } = useContext(TransactionContext);

    const [province, setProvince] = useState("");
    const [county, setCounty] = useState("");
    const [district, setDistrict] = useState("");
    const [area, setArea] = useState("");
    const [coordinates, setCoordinates] = useState("");

    return(
        <div className="container">
            <form action="" onSubmit={(e) => {e.preventDefault(); handleChange(province, county, district, area, coordinates)}}>
                <div class="form-group">
                    <h2 class="heading">Create Title Deed</h2>
                    <div class="controls">
                        <input id="search-bar" placeholder="Province" type="text" className="floatLabel mb-3" name="province" onChange={e => setProvince(e.target.value)} />
                    </div>
                    <div class="controls">
                        <input id="search-bar" placeholder="County" type="text" className="floatLabel mb-3" name="county" onChange={e => setCounty(e.target.value)} />
                    </div>       
                    <div class="controls">
                        <input id="search-bar" placeholder="District" type="text" className="floatLabel mb-3" name="district" onChange={e => setDistrict(e.target.value)} />
                    </div>
                    <div class="controls">
                        <input id="search-bar" placeholder="Area" type="text" className="floatLabel mb-3" name="area" onChange={e => setArea(e.target.value)} />
                    </div>
                    <div class="controls">
                        <input id="search-bar" placeholder="Coordinates" type="text" className="floatLabel mb-3" name="coordinates" onChange={e => setCoordinates(e.target.value)} />
                    </div>
                    <div className="controls">
                        <input type="submit" title="Submit" className="btn btn-outline-primary button-border-purp btn-lg float-end" value="Create" />
                    </div>
                </div>
            </form>
        </div>
    )
}

export default CreateDeed;