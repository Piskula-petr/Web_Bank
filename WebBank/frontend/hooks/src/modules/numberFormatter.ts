const numberFormatter = (numberAsString: string): string => {

    // Oddělení tisíců
    return numberAsString.toString().replace(/\B(?<!\.\d*)(?=(\d{3})+(?!\d))/g, " ")
        .replace(".", ",");
}

export default numberFormatter;