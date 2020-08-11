import React, {Component} from "react";

export default class TableSeparator extends Component {

// Vykreslení ////////////////////////////////////////////////////////////////////

    render() {

        return(
            <tr>
                <td colSpan="2">
                    <br/>
                    <br/>

                    <div>{this.props.label}</div>
                    
                    <hr/>
                </td>
            </tr>
        )
    }
}