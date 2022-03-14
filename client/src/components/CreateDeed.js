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
                    <h2 class="heading">Booking & contact</h2>
                    <div class="controls">
                        <input placeholder="Province" type="text" class="floatLabel" name="province" onChange={e => setProvince(e.target.value)} />
                    </div>
                    <div class="controls">
                        <input placeholder="County" type="text" class="floatLabel" name="county" onChange={e => setCounty(e.target.value)} />
                    </div>       
                    <div class="controls">
                        <input placeholder="District" type="text" class="floatLabel" name="district" onChange={e => setDistrict(e.target.value)} />
                    </div>
                    <div class="controls">
                        <input placeholder="Area" type="text" class="floatLabel" name="area" onChange={e => setArea(e.target.value)} />
                    </div>
                    <div class="controls">
                        <input placeholder="Coordinates" type="text" class="floatLabel" name="coordinates" onChange={e => setCoordinates(e.target.value)} />
                    </div>
                    <div className="controls">
                        <input type="submit" title="Submit" className="btn btn-primary btn-lg float-end" />
                    </div>
                </div>
            </form>
        </div>
    )
}

export default CreateDeed;