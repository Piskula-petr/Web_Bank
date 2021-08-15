const numberFormatter = (numberAsString: string): string => {

    // Oddělení tisíců
    return numberAsString.replace(/\B(?<!\.\d*)(?=(\d{3})+(?!\d))/g, " ")
        .replace(".", ",");
}

export default numberFormatter;