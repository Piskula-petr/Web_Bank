const NumberFormatter = (number) => {

    return number.toString().replace(/\B(?<!\.\d*)(?=(\d{3})+(?!\d))/g, " ")
        .replace(".", ",");
}

export default NumberFormatter;