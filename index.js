let result = '';
let operatorArr = ['*', '+', '-', '/', '/100', '(', ')'];
let operatorArrPer = ['*', '+', '-', '/', '/100'];
let operatorArrSpecial = ['*', '/'];
let oldResult = '';
let isNewOperand = false;
let result_storage = '0';
let isNumberAfterPercentage = false;
function concatString(x) {
    checkOperand(oldResult + x.target.value);
    if (isNewOperand) {
        if (result == '') {
            document.getElementById('board').innerHTML = '';
            result = x.target.value;
        }
        else {
            result += x.target.value;
        }
    } else {
        if (result !== '') result = result + x.target.value;
        else result = oldResult + x.target.value;
    }
    convert(result, x);
    oldResult = result;
}

function calcucate() {
    if (result != '') {
        let a = formatNumber(eval(result), 11);
        document.getElementById('board').innerHTML = a;
        oldResult = a.toString();
        result = '';
        isNewOperand = false;
        result_storage = a;
        isNumberAfterPercentage = false;
    }
}

function convert(result, x) {
    switch (x.target.value) {
        case '*':
            document.getElementById('board').innerHTML += ' x ';
            break;
        case '/':
            document.getElementById('board').innerHTML += ' ÷ ';
            break;
        case '+':
            document.getElementById('board').innerHTML += ' + ';
            break;
        case '-':
            document.getElementById('board').innerHTML += ' - ';
            break;
        case '/100':
            document.getElementById('board').innerHTML += '%';
            break;

        default:
            if (scriptForPercentageOperator(result)) {
                console.log("nhay vao day 2");
                result += "*";
                result += x.target.value;
                document.getElementById('board').innerHTML += ' x ';
                document.getElementById('board').innerHTML += x.target.value;
            }
            else {
                document.getElementById('board').innerHTML += x.target.value;
            }
            break;
    }
}
function checkOperand(result) {
    if (oldResult !== '') {
        if (containsOperator(result, operatorArr)) {
            isNewOperand = false;
        }
        else {
            isNewOperand = true;
        }
    }
}

function containsOperator(inputString, operatorArr) {
    for (let i = 0; i < inputString.length; i++) {
        if (operatorArr.includes(inputString[i])) {
            return true;
        }
    }
    return false;
}

function allClear() {
    document.getElementById('board').innerHTML = '0';
    document.getElementById('board').value = '0';
    result = '';
    oldResult = '0';
}

function scriptForPercentageOperator(result) {
    return result.endsWith('/100', result.length - 1);
}

function formatNumber(number, precision) {
    const roundedNumber = +number.toFixed(precision); // Convert to fixed precision
    const formattedNumber = String(roundedNumber); // Convert to string

    // Remove trailing zeros after the decimal point
    const parts = formattedNumber.split(".");
    if (parts.length === 2) {
        parts[1] = parts[1].replace(/0+$/, "");
        if (parts[1] === "") {
            return parts[0];
        }
        return parts.join(".");
    }
    return formattedNumber;
}