import {Parser} from './expressionParser.js';

class TruthTable {

    parser;
    varNames;
    tableInputs = [];
    tableMinTerms = [];
    tableMaxTerms = [];
    tableFunctionsDict = {functionNames: [],};
    displayState = {
        minTerms: false,
        maxTerms: false,
    }

    /**
     * Constructs a Table instance with binary values stored up to 2 ^ the length of the input list
     * @param {Array String} varNameArray An array of Strings representing variable names in the table
     */
    constructor(varNameArray) {
        this.varNames = varNameArray;
        // For each possible combination of variables
        for (let i = 0; i < 2 ** this.varNames.length; i++) {
            // add an empty list
            let binaryList = []
            // get the binary representation with bits equal to the amount of variables
            let binaryString = i.toString(2).padStart(this.varNames.length, '0');
            // Add the individual bits in order
            for (let j = 0; j < binaryString.length; j++) {
                binaryList.push(binaryString[j])
            }
            // add binary list to the main list
            this.tableInputs.push(binaryList);

        }
        this.addMinTerms();
        this.addMaxTerms();
    }

    /**
     * Adds minterms as a column in the table
     */
    addMinTerms() {
        for (let i = 0; i < this.tableInputs.length; i++) {
            let minTermHTMLString = '';
            for (let j = 0; j < this.varNames.length; j++) {
                let symbol = this.varNames[j];
                if (this.tableInputs[i][j] == '0') {
                    minTermHTMLString += `<span class="overline">${symbol}</span>` // overline the symbols to NOT
                } else {
                    minTermHTMLString += symbol // add regular symbol otherwise
                }
                if (j != this.varNames.length - 1) {
                    minTermHTMLString += '*';
                }

            }
            this.tableMinTerms.push(minTermHTMLString)
        }
    }

    /**
     * Adds maxterms as a column in the table
     */
    addMaxTerms() {
        for (let i = 0; i < this.tableInputs.length; i++) {
            let HTMLString = '';
            for (let j = 0; j < this.varNames.length; j++) {
                let symbol = this.varNames[j];
                if (this.tableInputs[i][j] == '1') {
                    HTMLString += `<span class="overline">${symbol}</span>` // overline the symbols to NOT
                } else {
                    HTMLString += symbol // add regular symbol otherwise
                }
                if (j != this.varNames.length - 1) {
                    HTMLString += '+';
                }

            }
            this.tableMaxTerms.push(HTMLString)
        }
    }

    /**
     * Adds a function in the form of a string and evaluates the answers
     * @param {String} booleanFunction 
     */
    addFunction(booleanFunction) {
        // Make a Parser to handle the evaluation
        this.parser = new Parser(booleanFunction)
        this.parser.constructAST()
        // push the function to functionNames array to associate witth an index
        this.tableFunctionsDict['functionNames'].push(booleanFunction)
        // Make a new array to store the values of the function
        this.tableFunctionsDict[booleanFunction] = {
            mainValues: [],                         // Store the main outputs of the function
            fragments: this.parser.nodeArray,       // store pointers to all the binary nodes of the function
            mainVisibility: true,                   // set visibility to true
            fragmentVisibility: false
        }
        let tableValuesDict = {} // make varNames keys in a dictionary
        this.parser.symbolTable = tableValuesDict; // set symbol table in parser for evaluating
        // for each binary input
        for (let i = 0; i < this.tableInputs.length; i++) {
            // associate variable names with their corresponding input values
            for (let j = 0; j < this.varNames.length; j++) {
                tableValuesDict[this.varNames[j]] = this.tableInputs[i][j];
            }


            // Populate the values of the function with the results of the evaluation of the formatted function
            this.tableFunctionsDict[booleanFunction].mainValues.push(this.parser.tree.evaluate())
        }
    }

    /**
     * Gets the relevant minterms of a function
     * @param {String} functionString 
     * @returns An array of minterms as strings
     */
    getMinTermsOfFunction(functionString){
        console.log('getting minterms of:', functionString)
        let currentFunctionArray = this.tableFunctionsDict[functionString].mainValues;
        console.log(`getting minterms of: ${currentFunctionArray}`)
        let minTermString = '';
        for (let i = 0; i < currentFunctionArray.length; i++){
            if (currentFunctionArray[i] == 1){
                minTermString += '(' + this.tableMinTerms[i] + ')+';
            }
        }
        // Remove remaining '+'
        return minTermString.slice(0, minTermString.length - 1)
    }

    /**
     * Gets the relevant maxterms of a function
     * @param {String} functionString 
     * @returns An array of maxterms as strings
     */
    getMaxTermsOfFunction(functionString) {
        let currentFunctionArray = this.tableFunctionsDict[functionString].mainValues;
        let maxTermString = '';
        for (let i = 0; i < currentFunctionArray.length; i++) {
            if (currentFunctionArray[i] == 0) {
                maxTermString += `(${this.tableMaxTerms[i]})*`;
            }
        }
        // Remove remaining '*'
        return maxTermString.slice(0, maxTermString.length - 1)
    }

    getTableHTML() {
        // Start table header row
        let tableHTML = '<table>\n<tr>\n';

        // Append varNames as inputs
        for (let i = 0; i < this.varNames.length; i++) {
            tableHTML += `<th>${this.varNames[i]}</th>\n`
        }
        // Add Function Headers
        if (this.tableFunctionsDict['functionNames'].length > 0){
            for (let i = 0; i < this.tableFunctionsDict['functionNames'].length; i++){
                tableHTML += `<th>${this.tableFunctionsDict['functionNames'][i]}</th>`
            }
        }

        // Add MinTerm Header
        if (this.displayState.minTerms && this.tableMinTerms.length != 0) {
            tableHTML += '<th>min<br>Terms</th>';
        }

        // Add MaxTerm Header
        if (this.displayState.maxTerms && this.tableMaxTerms.length != 0) {
            tableHTML += '<th>Max<br>Terms</th>';
        }
        // Close Headers
        tableHTML += '</tr>\n'


        // Table Body
        for (let i = 0; i < this.tableInputs.length; i++) {
            // Start Row
            tableHTML += '<tr>\n'

            // Add input values
            for (let j = 0; j < this.tableInputs[i].length; j++) {
                tableHTML += `<td>${this.tableInputs[i][j]}</td>\n`
            }
            // Add Function Outputs
            if (this.tableFunctionsDict['functionNames'].length != 0){
                let functionNameArray = this.tableFunctionsDict['functionNames'];
                for (let j = 0; j < functionNameArray.length; j++){
                    tableHTML += `<td>${this.tableFunctionsDict[functionNameArray[j]].mainValues[i]}</td>\n`
                }
            }

            // Add minTerms
            if (this.displayState.minTerms && this.tableMinTerms.length != 0) {
                tableHTML += `<td>${this.tableMinTerms[i]}</td>`;
            }

            // Add maxTerms
            if (this.displayState.maxTerms && this.tableMaxTerms.length != 0) {
                tableHTML += `<td>${this.tableMaxTerms[i]}</td>`;
            }
            // Finish Row
            tableHTML += '</tr>\n'
        }
        // Finish Table
        tableHTML += '</table>\n'
        return tableHTML;
    }

    logTable() {
        // start with an empty string
        let displayString = ''
        // Write headers to displayString
        for (let i = 0; i < this.varNames.length; i++) {
            displayString += this.varNames[i] + ' ';
        }
        // Add a newline to start the table
        displayString += '\n';
        for (let i = 0; i < this.tableInputs.length; i++) {
            for (let j = 0; j < this.tableInputs[i].length; j++) {
                displayString += this.tableInputs[i][j] + " "
            }
            displayString += '\n'
        }
        return displayString
    }
}

export {TruthTable}