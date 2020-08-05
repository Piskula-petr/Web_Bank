import React, {Component} from "react";

export default class DetailTable extends Component {

    render() {

        return(
            <div id="detail">
                <table>
                    <tbody>
                        <tr className={(this.props.item.variableSymbol === 0 ? "hide" : "")}>
                            <td id="column1"></td>
                            <td id="column2">
                                <b>Variabilní symbol:</b>
                            </td>

                            <td id="column3">
                                {this.props.item.variableSymbol}
                            </td>
                        </tr>

                        <tr className={(this.props.item.constantSymbol === 0 ? "hide" : "")}>
                            <td id="column1"></td>
                            <td id="column2">
                                <b>Konstantní symbol:</b>
                            </td>

                            <td id="column3">
                                {this.props.item.constantSymbol}
                            </td>
                        </tr>

                        <tr className={(this.props.item.specificSymbol === 0 ? "hide" : "")}>
                            <td id="column1"></td>
                            <td id="column2">
                                <b>Specifický symbol:</b>
                            </td>

                            <td id="column3">
                                {this.props.item.specificSymbol}
                            </td>
                        </tr>

                        <tr>
                            <td id="column1"></td>
                            <td id="column2">
                                <b>ID transakce:</b>
                            </td>

                            <td id="column3">
                                {this.props.item.id}
                            </td>
                        </tr>

                        <tr>
                            <td id="column1"></td>
                            <td id="column2">
                                <b>Datum platby:</b>
                            </td>

                            <td id="column3">
                                {this.props.item.paymentDate}
                            </td>
                        </tr>
                    </tbody>
                </table>
            </div>
        )
    }

}