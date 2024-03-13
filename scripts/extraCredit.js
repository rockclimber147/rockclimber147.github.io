import {Parser} from './classes/expressionParser.js';

document.getElementById('inputExpressionButton').addEventListener('click', ()=>{
    let expression = document.getElementById('inputExpression').value
    console.log(expression)
    let parser = new Parser(expression);
    try {
        parser.constructAST()
        addSVG(parser.tree, 'treeContainer', 'Main')
    } catch (err) {
        document.getElementById('treeContainer').innerHTML = err.message;
    } finally {
        

        document.getElementById('treePartsContainer').innerHTML = '';
        for (let i = 0; i < parser.nodeArray.length; i++){
            let subnodeTitle = `<p>${parser.nodeArray[i].getExpressionString()}</p>\n`
            let subNodeHTML = `<div id="sub_table${i}" class="table_container"></div>`;
            document.getElementById('treePartsContainer').innerHTML += subnodeTitle + subNodeHTML;
            addSVG(parser.nodeArray[i], `sub_table${i}`, `subRoot${i}`)
        }
    }
})

function addSVG(tree, containerId, tableId){
    // Construct table
    let treeContainer = document.getElementById(containerId)
    treeContainer.innerHTML = tree.getHTML(0, ' ', tableId)
    console.log(treeContainer.innerHTML)

    let tableBounds = treeContainer.firstChild.getBoundingClientRect()
    console.log(tableBounds)
    let lineCoordinatePairs = []
    let tableOffsets = [tableBounds.x, tableBounds.y]
    console.log(tableOffsets)
    addCoordinatePairs(tableId, lineCoordinatePairs, tableOffsets)
    console.log(lineCoordinatePairs)

    var svg = document.createElementNS("http://www.w3.org/2000/svg", "svg")
    svg.setAttribute('width', tableBounds.width)
    svg.setAttribute('height', tableBounds.height)
    svg.innerHTML = getSVGLines(lineCoordinatePairs)
    treeContainer.appendChild(svg)
}

function addCoordinatePairs(nodeId, lineCoordinatePairs, offsets){
    let currentNode = document.getElementById(nodeId)
    let currentNodeCenter = getCenterOfNode(nodeId, offsets)

    switch (currentNode.className){
        case 'unary_operator': {
            let childID = nodeId + 'D'
            let childNodeCenter = getCenterOfNode(childID, offsets)
            lineCoordinatePairs.push([currentNodeCenter, childNodeCenter])
            addCoordinatePairs(childID, lineCoordinatePairs, offsets)
            console.log(childID)
            break;
        } case 'binary_operator': {
            let leftChildID = nodeId + 'L'
            let leftChildNodeCenter = getCenterOfNode(leftChildID, offsets)
            lineCoordinatePairs.push([currentNodeCenter, leftChildNodeCenter])
            addCoordinatePairs(leftChildID, lineCoordinatePairs, offsets)

            let rightChildID = nodeId + 'R'
            let rightChildNodeCenter = getCenterOfNode(rightChildID, offsets)
            lineCoordinatePairs.push([currentNodeCenter, rightChildNodeCenter])
            addCoordinatePairs(rightChildID, lineCoordinatePairs, offsets)
            break;
        }
    }
}

function getCenterOfNode(nodeId, offsets){
    console.log('getting center of id: ' + nodeId)
    let bounds = document.getElementById(nodeId).getBoundingClientRect()
    console.log(bounds)
    return [bounds.x + bounds.width / 2 - offsets[0], bounds.y + bounds.height / 2 - offsets[1]]
}

function getSVGLines(lineCoordinatePairs){
    let svgText = ""
    for (let i = 0; i < lineCoordinatePairs.length; i++){
        svgText += `<line x1="${lineCoordinatePairs[i][0][0]}" y1="${lineCoordinatePairs[i][0][1]}" x2="${lineCoordinatePairs[i][1][0]}" y2="${lineCoordinatePairs[i][1][1]}" stroke="black" />`
    }
    return svgText
}