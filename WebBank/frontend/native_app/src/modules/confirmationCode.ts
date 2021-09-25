/**
 * Vygenerování pětimístního kódu
 * 
 * @returns - vrací pětimístné náhodné číslo
 */
export const confirmationCode = (): number => {

    return Math.floor(Math.random() * (99999 - 10000 + 1) + 10000);
}