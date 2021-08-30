export const numberFormatter = (numberAsString: string): string => {

    // Oddělení tisíců
    return numberAsString.replace(/\B(?=(\d{3})+(?!\d))/g, " ")
        .replace(".", ",");
}