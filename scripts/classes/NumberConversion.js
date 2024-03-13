class Number {
    debugMode = false
    numberBase;
    integerPartValues = [];           // list of decimal values of the symbol characters making the INTEGER part of the input number
    fractionalPartValues = [];        // list of decimal values of the symbol characters making the FRACTIONAL part of the input number
    valueArrays = [this.integerPartValues, this.fractionalPartValues]
    hasWholePart = false;
    hasFractionalPart = false;
    repeatLength;

    /**
     * Construct a new number object with optional debug logging
     * @param {*} numString A string representing a number of any positive integer base greater than 2
     * @param {integer} base The base of the input number
     * @param {*} debugMode Sets debug logging when true
     */
    constructor(numString, base, debugMode) {
        this.debugMode = debugMode
        this.numberBase = base;
        let separatedNumber = numString.toUpperCase().split('.'); // split at decimal point
        this.debugLog(`${numString} => ${separatedNumber}`)

        this.populateNumberLists(separatedNumber);
        this.debugLog(`Integer part: ${this.integerPartValues}\nFractional part: ${this.fractionalPartValues}`)
    }

    /**
     * Convert integer and fractional number lists to a symbol string
     * @returns symbolic representation of number lists as a string
     */
    getHTMLString() {
        // Open the span
        let HTMLString = "<span class=\"number\">"
        for (let i = 0; i < this.integerPartValues.length; i++) {
            HTMLString += SymbolTable.getModifiedChar(this.integerPartValues[i])
        }
        if (this.fractionalPartValues.length > 0) {
            HTMLString += '.';
            for (let i = 0; i < this.fractionalPartValues.length; i++) {
                HTMLString += SymbolTable.getModifiedChar(this.fractionalPartValues[i])
            }
        }
        // If there's a repeating part use overline class
        if (this.repeatLength){
            let repeatString = `<span class="overline">${HTMLString.slice(-this.repeatLength)}</span>`
            HTMLString = HTMLString.slice(0, HTMLString.length - this.repeatLength) + repeatString;
        }
        // Return with closed span
        return HTMLString + "</span>";
    }

    /**
     * Translate input string into lists of decimal integers representing the decimal value of each symbol
     * @param {string[]} separatedNumber A list containing either the integer string or both the integer and fractional strings of the input number
     */
    populateNumberLists(separatedNumber) {
        if (separatedNumber.length > 2) {
            throw new Error('Input number can have at most one decimal point')
        }

        for (let i = 0; i < separatedNumber.length; i++) {
            for (let j = 0; j < separatedNumber[i].length; j++) {
                let incomingOrdinal = SymbolTable.getModifiedOrdinal(separatedNumber[i][j])

                // Handle base errors
                if (incomingOrdinal >= this.numberBase) {
                    throw new Error('You gave a number that doesn\'t fit into the specified base!')
                }
                this.valueArrays[i].push(incomingOrdinal);
            }
        }

        // Add leading zero if interger part is empty
        if (this.integerPartValues.length == 0) {
            this.integerPartValues.push(0)
        } else {
            this.hasWholePart = true;
        }

        if (this.fractionalPartValues.length != 0) {
            this.hasFractionalPart = true;
        }
    }

    convertToBase10() {
        processString = ""

    }

    /**
     * Log input string to console if this.debugMode is true
     * @param {*} string The string to log
     */
    debugLog(string) {
        if (this.debugMode) {
            console.log(string);
        }
    }
}

class SymbolTable {
    /**
     * Translate input character to a decimal integer based on the character value
     * @param {string} character Input character
     * @returns Decimal number representation of the input symbol mapped to hexadecimal standards and beyond
     */
    static getModifiedOrdinal(character) {
        let charValue = character.charCodeAt(0);
        if (charValue >= 48 && charValue <= 57) {  // '0' == 48, map '0' - '9' to 0 - 9
            charValue -= 48;
        } else if (charValue >= 65 && charValue <= 90) { // 'A' == 65, map 'A' - 'Z' to 10 - 35
            charValue -= 55;
        } else {
            charValue -= 160;  // 'Ä' == 196, map 
        }
        if (charValue < 0) {
            throw new Error(`You entered an illegal character: '${character}'. Please consult the symbol table when making a high base number`)
        }
        return charValue;

    }

    /**
     * Translate a decimal integer to a symbol based on hexadecimal notation and beyond
     * @param {*} modifiedOrdinal The input integer
     * @returns String character representation of the integer
    */
    static getModifiedChar(modifiedOrdinal) {
        let charValue = modifiedOrdinal
        if (modifiedOrdinal <= 9) {
            charValue += 48;
        } else if (modifiedOrdinal <= 35) {
            charValue += 55;
        } else {
            charValue += 160;
        }
        return String.fromCharCode(charValue);
    }

    static getTableRows(start, end){
        let HTMLString = "<table><tr><th>Symbol</th><th>Decimal Value</th></tr>"
        for (let i = start; i <= end; i++){
            HTMLString += `<tr><td>${this.getModifiedChar(i)}</td><td>${i}</td></tr>\n`
        }
        return HTMLString + "</table>"
    }
}

// try {
//     my_num = new Number('110.54321', 10, true)
//     my_num.repeatLength = 2
//     console.log(my_num)
//     console.log(my_num.getHTMLString())
// } catch (Error) {
//     console.log(Error.message)
// }

console.log(SymbolTable.getTableRows(0,100))

// export { Number }
