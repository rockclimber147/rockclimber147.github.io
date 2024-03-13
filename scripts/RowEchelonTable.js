class RowEchelonTable {
    rows = []

    constructor(fractionNumberList) {
        for (let i = 0; i < fractionNumberList.length; i++) {
            if (fractionNumberList[i].length == fractionNumberList.length - 1) {
                this.rows.push(fractionNumberList[i])
            }
        }
    }

    switch(rowIndex1, rowIndex2) {
        let temp = this.rows[rowIndex1];
        this.rows[rowIndex1] = this.rows[rowIndex2];
        this.rows[rowIndex2] = temp;
    }
}

function getFactorList(integer) {
    let factors = [1]
    for (let i = 2; i < Math.sqrt(integer) + 1; i++) {
        if (integer % i == 0) {
            factors.push(i)
        }
    }
    let offset = 1
    if (integer / factors[factors.length - 1] == factors[factors.length - 1]) {
        offset = 2;
    }
    for (let i = factors.length - offset; i >= 0; i--) {
        factors.push(integer / factors[i])
    }
    return factors
}

console.log(getFactorList(25))