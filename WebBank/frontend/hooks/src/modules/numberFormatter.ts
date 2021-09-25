/**
 * Naformátování čísla
 * 
 * @param numberAsString - vstupní hodnota 
 * 
 * @returns vrací číslo ve formátu [000 000,00]
 */
export const numberFormatter = (numberAsString: string): string => {

    // Oddělení tisíců
    return numberAsString.toString().replace(/\B(?<!\.\d*)(?=(\d{3})+(?!\d))/g, " ")
        .replace(".", ",");
}