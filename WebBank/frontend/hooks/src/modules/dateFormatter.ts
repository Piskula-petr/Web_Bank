const dateFormatter = (dateString: string): string => {

    const date: Date = new Date(dateString);

    let year: number = date.getFullYear();
    let month: number = date.getMonth() + 1;
    let day: number = date.getDate()

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

export default dateFormatter;