import {TruthTable} from './classes/TruthTable.js';

document.getElementById('inputExpressionButton').addEventListener('click', ()=>{
    var reservedCharacters = ['(', ')', '+', '!', '*', '0', '1']
    let expression = document.getElementById('inputExpression').value
    let varNames = []
    // Add 
    for (let i = 0; i < expression.length; i++){
        if (!reservedCharacters.includes(expression[i]) && !varNames.includes(expression[i])){
            varNames.push(expression[i])
        }
    }
    console.log(expression)
    console.log(varNames)
    let mainTable = new TruthTable(varNames);
    let resultHTML;
    mainTable.displayState.minTerms = false;
    mainTable.displayState.maxTerms = true;
    try {
        mainTable.addFunction(expression);
        resultHTML = mainTable.getTableHTML();
    } catch (err) {
        resultHTML = err.message;
    } finally {
        document.getElementById('table_container').innerHTML = `<div id="main_table" class="table_container">${resultHTML}</div>
        <p>Minterms of ${expression}:</p>${mainTable.getMinTermsOfFunction(expression)}
        <p>Maxterms of ${expression}:</p>${mainTable.getMaxTermsOfFunction(expression)}`;
    }
})