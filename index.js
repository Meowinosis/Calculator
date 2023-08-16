// regexExpression = /(\S+\s*[-+×÷\u2212]\s*\d+)/;
let result = "";
let board = document.getElementById("board");
const operatorArr = ["*", "+", "-", "/", "(", ")", "!", "π", "A", "e"];
const operatorArrBas = ["*", "+", "-", "/"];
const operatorArrSpe = ["/100", "!", "A", "e", "Math.PI", "Math.E"];
const trigoloArr = [
  "sin",
  "cos",
  "tan",
  "log",
  "lng",
  "/100",
  "sqr",
  "Rnd",
  "asi",
  "aco",
  "ata",
  "exp",
];
const powArr = ["xpow", "epow", "tepo", "sqry", "pow2"];

let countOpenBrace = 0;
let oldResult = "0";
let isNewOperand = false;
let result_storage = "0";
let tempResult = "0";
let isInvertElement = false;
let isRandom = false;
let isExp = false;
let isNegativeNumber = false;
let tempNagativeNumber = "-";
let isMinusAfterBrace = false;
let tempPow = "";
let isPow = false;
function concatString(x) {
  if (oldResult != "0" && !oldResult.includes("e")) {
    checkOperand(oldResult + x.target.value);
  } else {
    checkOperand(x.target.value);
  }
  if (isNewOperand) {
    if (tempResult == "0" || board.innerHTML == "Error") {
      board.innerHTML = "";
      result = convert(result, x);
    } else {
      result = convert(result, x);
    }
  } else {
    result = convert(result, x);
  }
  if (!isNaN(x.target.value)) {
    //chưa dùng
    tempPow += x.target.value;
  }
  oldResult = result;
  tempResult = result;
}

function calculate() {
  try {
    let a = 0;
    if (isNegativeNumber) {
      result += "*" + Math.pow(10, tempNagativeNumber);
    }
    if (
      result != "" &&
      !operatorArrBas.includes(result.charAt(result.length - 1))
    ) {
      while (countOpenBrace > 0) {
        result += ")";
        countOpenBrace = countOpenBrace - 1;
      }
      if (result.includes("e")) {
        a = eval(simplifyExpression(result)).toExponential(0);
      } else {
        a = formatNumber(eval(simplifyExpression(result)), 11);
      }
      oldResult = a.toString();
      result_storage = a;
      board.innerHTML = a;
      tempResult = "0";
      result = "";
      isNewOperand = false;
      isExp = false;
      isNegativeNumber = false;
      tempNagativeNumber = "-";
      isMinusAfterBrace = false;
      tempPow = "";
      isPow = false;
    }
  } catch (e) {
    board.innerHTML = "Error";
    oldResult = "0";
    result_storage = "0";
    tempResult = "0";
    result = "";
    isNewOperand = false;
    isExp = false;
    isNegativeNumber = false;
    tempNagativeNumber = "-";
    isMinusAfterBrace = false;
    tempPow = "";
    isPow = false;
  }
}

function convert(result, x) {
  switch (x.target.value) {
    case ".":
      if (!board.innerHTML.endsWith("E")) {
        if (board.innerHTML == "") {
          board.innerHTML += "0.";
          result += ".";
        }
      }
      break;
    case "*":
      result = checkAndApplyBasicOperator(" × ", x);
      break;
    case "/":
      result = checkAndApplyBasicOperator(" ÷ ", x);
      break;
    case "+":
      result = checkAndApplyBasicOperator(" + ", x);
      break;
    case "-":
      if (!isExp && !result.endsWith("(")) {
        if (board.innerHTML == "0") {
          result = oldResult + x.target.value;
          board.innerHTML = "-";
        } else {
          result = oldResult + x.target.value;
          board.innerHTML += " - ";
        }
      } else {
        if (isExp) {
          board.innerHTML += "-";
          isNegativeNumber = true;
          isExp = true;
        }
        if (result.endsWith("(")) {
          board.innerHTML += "-";
          result = oldResult + x.target.value;
          isMinusAfterBrace = true;
        }
      }
      break;
    case "/100":
      if (
        !isExp &&
        !isMinusAfterBrace &&
        !isNegativeNumber &&
        !operatorArrBas.includes(result.charAt(result.length - 1))
      ) {
        result = oldResult + x.target.value;
        board.innerHTML += "%";
      }
      break;
    case "e":
      if (!board.innerHTML.endsWith("E") && !isExp) {
        if (oldResult == 0 || board.innerHTML == "") {
          result += "Math.E";
          board.innerHTML = "<b>e</b>";
        } else {
          result = oldResult + "*" + "Math.E";
          board.innerHTML += "<b>e</b>";
        }
      }
      break;
    case "!":
      if (tempResult.endsWith("(")) {
        return result;
      }
      if (!isExp) {
        board.innerHTML += "!";
        result = checkAndFactorial();
      }
      break;
    case "(":
      if (!board.innerHTML.endsWith("E") && !isExp) {
        if (board.innerHTML === "0" || board.innerHTML === "") {
          board.innerHTML = "(";
          result += x.target.value;
        } else {
          if (isPow) {
          }
          if (
            !operatorArrBas.includes(oldResult.charAt(oldResult.length - 1))
          ) {
            result = oldResult + "*";
          }
          result += x.target.value;
          board.innerHTML += "(";
        }
        countOpenBrace++;
      }
      break;
    case ")":
      if (!board.innerHTML.endsWith("E") && !isExp) {
        if (isPow) {
        }
        if (
          countOpenBrace > 0 &&
          !operatorArrBas.includes(oldResult.charAt(oldResult.length - 1))
        ) {
          result = oldResult + ")";
          board.innerHTML += ")";
          countOpenBrace = countOpenBrace - 1;
        }
      }
      isPow = false;
      break;
    case "π":
      if (!board.innerHTML.endsWith("E") && !isExp) {
        if (oldResult == 0 || board.innerHTML == "") {
          result += "Math.PI";
          board.innerHTML = "π";
        } else {
          result = oldResult + "*";
          result += "Math.PI";
          if (
            isNaN(
              board.innerHTML.substring(
                board.innerHTML.length - 1,
                board.innerHTML.length
              )
            )
          ) {
            board.innerHTML += " ×&nbsp;π";
          } else {
            board.innerHTML += "π";
          }
        }
      }
      break;
    case "A":
      if (!board.innerHTML.endsWith("E") && !isExp) {
        if (oldResult == 0 || board.innerHTML == "") {
          result += result_storage;
          board.innerHTML = "ANS";
        } else {
          result = oldResult + "*" + result_storage;
          if (
            isNaN(
              board.innerHTML.substring(
                board.innerHTML.length - 1,
                board.innerHTML.length
              )
            )
          ) {
            board.innerHTML += " ×&nbsp;ANS";
          } else {
            board.innerHTML += "&nbsp;ANS";
          }
        }
      }
      break;
    case "Rnd":
      isRandom = true;
      let rnd = Math.random().toFixed(7);
      if (oldResult == 0 || board.innerHTML == "") {
        result += rnd;
        board.innerHTML = rnd;
      } else {
        result = oldResult + "*" + rnd;
        if (isRandom) {
          board.innerHTML = board.innerHTML + " ×&nbsp;" + rnd;
        }
      }
      break;
    case "sin":
    case "cos":
    case "tan":
    case "lng":
    case "log":
    case "sqr":
    case "asi":
    case "aco":
    case "ata":
      result = useMathTrigono(x.target.value);
      break;
    case "exp":
      if (board.innerHTML != "0" && !board.innerHTML.endsWith("E")) {
        isExp = true;
        board.innerHTML += "E";
      }
      break;
    case "xpow":
    case "pow2":
    case "tepo":
    case "epow":
    case "sqry":
      result = usePow(x.target.value);
      break;
    default:
      if (
        (scriptForSpecialOperator(oldResult) && tempResult != "0") ||
        isRandom ||
        isExp ||
        isNegativeNumber ||
        isPow
      ) {
        console.log("nhay vao day 2");
        tempPow = "";
        if (!isNegativeNumber && !isPow) {
          result = oldResult + "*";
          if (isExp) {
            result = checkExp(x.target.value, result);
          } else {
            result += x.target.value;
            board.innerHTML += " × ";
          }
          board.innerHTML += x.target.value;
        } else {
          if (isNegativeNumber) {
            tempNagativeNumber += x.target.value;
            board.innerHTML += x.target.value;
          }
          if (isPow) {
            tempPow += x.target.value;
            result += tempPow;
            board.innerHTML = board.innerHTML.replace("□", x.target.value);
            countOpenBrace = result.split("(").length - 1;
          }
        }
        // tempPow += x.target.value;
        isRandom = false;
        isExp = false;
      } else {
        result += x.target.value;
        board.innerHTML += x.target.value;
        isMinusAfterBrace = false;
      }
      break;
  }
  return result;
}
function checkOperand(a) {
  if (containsTrigolo(a, operatorArr)) {
    isNewOperand = false;
  } else {
    isNewOperand = true;
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

function containsTrigolo(inputString, operatorArr) {
  if (
    trigoloArr.includes(
      inputString.substring(inputString.length - 3, inputString.length) &&
        oldResult != "0"
    )
  ) {
    return true;
  } else {
    return containsPow(inputString, operatorArr);
  }
}

function containsPow(inputString, operatorArr) {
  if (
    powArr.includes(
      inputString.substring(inputString.length - 4, inputString.length) &&
        oldResult != "0"
    )
  ) {
    return true;
  } else {
    return containsOperator(inputString, operatorArr);
  }
}

function checkAndApplyBasicOperator(str, x) {
  if (result.endsWith("(") || isMinusAfterBrace) {
    return result;
  }
  if (result.endsWith(")") && isPow) {
    result = result.substring(0, result.length);
    isPow = false;
  }
  if (!board.innerHTML.endsWith("E") && !isExp) {
    let a = board.innerHTML;
    tempPow = "";
    if (
      !trigoloArr.includes(
        result.substring(result.length - 4, result.length - 1)
      )
    ) {
      if (
        oldResult != "0" &&
        !operatorArrBas.includes(result.charAt(result.length - 1))
      ) {
        if (isNegativeNumber) {
          result += "*" + Math.pow(10, tempNagativeNumber);
          oldResult = result;
          isNegativeNumber = false;
        }
        result = oldResult + x.target.value;
        board.innerHTML += str;
      } else {
        result = oldResult.substring(0, oldResult.length - 1) + x.target.value;
        if (board.innerHTML != "0") a = a.substring(0, a.length - 3) + str;
        else a = a + str;
        board.innerHTML = a;
      }
    }
  }
  return result;
}

function checkExp(value, result) {
  if (!isNaN(value)) {
    result += Math.pow(10, value);
  }
  return result;
}

function allClear() {
  board.innerHTML = "0";
  result = "";
  oldResult = "0";
  tempResult = "0";
  isExp = false;
  isRandom = false;
  isNegativeNumber = false;
  tempNagativeNumber = "-";
  isMinusAfterBrace = false;
  tempPow = "";
  countOpenBrace = 0;
  isPow = false;
}

function scriptForSpecialOperator(result) {
  for (let i = 0; i < operatorArrSpe.length; i++) {
    if (result.endsWith(operatorArrSpe[i])) {
      console.log("nhay vao day");
      return true;
    }
  }
  return false;
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

function simplifyExpression(expression) {
  expression = expression.replace(/[+\-*/]+/g, (match) => match[0]);
  return expression;
}

function checkAndFactorial() {
  if (oldResult == "0") {
    result += "1";
    return result;
  }
  if (operatorArrBas.includes(result.charAt(result.length - 1))) {
    board.innerHTML =
      board.innerHTML.substring(0, board.innerHTML.length - 4) + "!";
    result = result.substring(0, result.length - 1);
  }
  if (result.endsWith(")")) {
    let position = findBracePosition();
    result = result.substring(0, position);
    result += factorial(eval(oldResult.substring(position, oldResult.length)));
  } else {
    if (!isNaN(result.charAt(result.length))) {
      result = removeSubstring(result, extractLastNumber(result).toString());
      result += factorial(extractLastNumber(oldResult)).toString();
    }
  }

  return result;
}

function useMathTrigono(type) {
  if (!board.innerHTML.endsWith("E") && !isExp) {
    if (
      !operatorArrBas.includes(tempResult.charAt(tempResult.length - 1)) &&
      (!isNaN(tempResult.charAt(tempResult.length - 1)) ||
        tempResult.endsWith(")")) &&
      tempResult != "0"
    ) {
      result = oldResult + "*";
    }
    switch (type) {
      case "sin":
        result += "Math.sin(";
        if (!board.innerHTML.endsWith("(")) board.innerHTML += " ";
        board.innerHTML += "sin(";
        countOpenBrace++;
        break;
      case "cos":
        result += "Math.cos(";
        if (!board.innerHTML.endsWith(" ")) board.innerHTML += " ";
        board.innerHTML += "cos(";
        countOpenBrace++;
        break;
      case "tan":
        result += "Math.tan(";
        if (!board.innerHTML.endsWith(" ")) board.innerHTML += " ";
        board.innerHTML += "tan(";
        countOpenBrace++;
        break;
      case "log":
        result += "Math.log10(";
        if (!board.innerHTML.endsWith(" ")) board.innerHTML += " ";
        board.innerHTML += "log(";
        countOpenBrace++;
        break;
      case "lng":
        result += "Math.log(";
        if (!board.innerHTML.endsWith(" ")) board.innerHTML += " ";
        board.innerHTML += "ln(";
        countOpenBrace++;
        break;
      case "sqr":
        result += "Math.sqrt(";
        if (!board.innerHTML.endsWith(" ")) board.innerHTML += " ";
        board.innerHTML += "√(";
        countOpenBrace++;
        break;
      case "asi":
        result += "Math.asin(";
        if (!board.innerHTML.endsWith(" ")) board.innerHTML += " ";
        board.innerHTML += "arcsin(";
        countOpenBrace++;
        break;
      case "aco":
        result += "Math.acos(";
        if (!board.innerHTML.endsWith(" ")) board.innerHTML += " ";
        board.innerHTML += "arccos(";
        countOpenBrace++;
        break;
      case "ata":
        result += "Math.atan(";
        if (!board.innerHTML.endsWith(" ")) board.innerHTML += " ";
        board.innerHTML += "arctan(";
        countOpenBrace++;
        break;
      default:
        break;
    }
    isNegativeNumber = false;
  }
  return result;
}

function usePow(type) {
  if (!board.innerHTML.endsWith("E") && !isExp) {
    if (
      !operatorArrBas.includes(tempResult.charAt(tempResult.length - 1)) &&
      (!isNaN(tempResult.charAt(tempResult.length - 1)) ||
        tempResult.endsWith(")") ||
        isPow ||
        tempResult == "0")
    ) {
      switch (type) {
        case "pow2":
          if (board.innerHTML == "") {
            result = "0";
          }
          if (isPow) {
            if (board.innerHTML.endsWith("<sup>□</sup>")) {
              result += "2)";
              board.innerHTML = board.innerHTML.replace("□", "2");
              countOpenBrace++;
            } else if (board.innerHTML.endsWith("</sup>")) {
              let index = 0;
              for (let i = result.length; i >= 0; i--) {
                if (result[i] === "(") {
                  index = result.lastIndexOf(result[i]);
                  break;
                }
              }
              result =
                oldResult.substring(0, index + 1) +
                "Math.pow(" +
                oldResult.substring(index + 1, result.length) +
                ",2)";
              // board.innerHTML = formatExpression(result);
            }
          } else {
            if (result.endsWith(")")) {
              let position = findBracePosition();
              result = result.substring(0, position + 1);
              result +=
                Math.pow(
                  oldResult.substring(position + 1, oldResult.length - 1),
                  2
                ).toString() + ")";
              board.innerHTML = "(" + board.innerHTML + ")<sup>2</sup>";
              // isPow = true;
            } else {
              result = removeSubstring(
                result,
                extractLastNumber(result).toString()
              );
              result +=
                "(" +
                Math.pow(extractLastNumber(oldResult), 2).toString() +
                ")";
              if (board.innerHTML.endsWith("<sup>2</sup>")) {
                board.innerHTML = "(" + board.innerHTML + ")<sup>2</sup>";
              } else {
                board.innerHTML = board.innerHTML + "<sup>2</sup>";
              }
            }
          }
          break;
        case "epow":
          if (board.innerHTML == "0") {
            result = "Math.pow(Math.E,";
            board.innerHTML = "<b>e</b><sup>□</sup>";
            isPow = true;
          } else {
            isPow = true;
            if (
              !isNaN(tempResult.charAt(tempResult.length - 1)) ||
              (tempResult.endsWith(")") && tempResult != "0")
            ) {
              result += "*";
            }
            if (isPow) {
              result += "Math.pow(Math.E,";
              board.innerHTML =
                removeSubstring(board.innerHTML, "□</sup>") +
                "<b>e</b><sup>□</sup>";
            }
            break;
          }
        default:
          break;
      }
    }
  }
  return result;
}

function factorial(n) {
  if (n >= 1) return n * factorial(n - 1);
  else return 1;
}

function extractLastNumber(expression) {
  const matches = expression.match(/\d+/g); // Find all sequences of digits
  const lastNumber = matches ? parseInt(matches[matches.length - 1]) : null; // Get the last number if found
  return lastNumber;
}

function removeSubstring(originalString, substringToRemove) {
  return originalString.replace(substringToRemove, "");
}


function findBracePosition() {
  let position = 0;
  let brace = result.split(")").length - 1;
  for (let i = result.length; i >= 0; i--) {
    if (result[i] == "(") {
      brace--;
    }
    if (brace == 0) {
      position = result.indexOf(result[i]);
      break;
    }
  }
  return position;
}

function invert() {
  if (isInvertElement) {
    isInvertElement = false;
  } else {
    isInvertElement = true;
  }
  let defaults = document.querySelectorAll(".default");
  let inverts = document.querySelectorAll(".invert");
  if (isInvertElement) {
    defaults.forEach((defaultElement) => {
      defaultElement.style.display = "none";
    });
    inverts.forEach((invert) => {
      invert.style.display = "table-cell";
    });
  } else {
    defaults.forEach((defaultElement) => {
      defaultElement.style.display = "table-cell";
    });
    inverts.forEach((invert) => {
      invert.style.display = "none";
    });
  }
}
