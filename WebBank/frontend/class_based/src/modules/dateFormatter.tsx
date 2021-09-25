/**
 * Naformátování datumu
 * 
 * @param dateString - vstupní hodnota
 * 
 * @returns - vrací datum ve formátu [dd.MM.yyyy]
 */
export const dateFormatter = (dateString: string): string => {

    const date: Date = new Date(dateString);

    const year: number = date.getFullYear();
    const month: number = date.getMonth() + 1;
    const day: number = date.getDate()

    // Sestavení finálního datumu [dd.MM.yyyy]
    let finalDate: string = "";

    // Přidání nuly před den
    if (day < 10) finalDate = "0";

    finalDate = finalDate + day + ".";

    // Přidání nuly před měsíc
    if (month < 10) finalDate = finalDate + "0";

    finalDate = finalDate + month + "." + year;

    return finalDate;
}
