//CASH REGISTER

const CURRENCYUNIT = [
    ['PENNY', 0.01, 'penny.png'],
    ['NICKEL', 0.05, 'nickel.png'],
    ['DIME', 0.1, 'dime.png'],
    ['QUARTER', 0.25, 'quarter.png'],
    ['ONE', 1, 'one.png'],
    ['FIVE', 5, 'five.png'],
    ['TEN', 10, 'ten.png'],
    ['TWENTY', 20, 'twenty.png'],
    ['ONE HUNDRED', 100, 'one-hundred.png']
];

let cidInitial = [["PENNY", 0.2], ["NICKEL", 1], ["DIME", 2], ["QUARTER", 5],
["ONE", 20], ["FIVE", 100], ["TEN", 200], ["TWENTY", 400], ["ONE HUNDRED", 2000]];
let cid = [["PENNY", 0.2], ["NICKEL", 1], ["DIME", 2], ["QUARTER", 5],
["ONE", 20], ["FIVE", 100], ["TEN", 200], ["TWENTY", 400], ["ONE HUNDRED", 2000]];
let fix2 = (num) => Math.round(num * 100) / 100;

function checkCashRegister(price, cash, obj) {
    let change = [], balance = fix2(cash - price);

    if (fix2(obj.reduce((sum, n) => sum + n[1], 0)) === balance) {
        cid = obj.map(n => [n[0], 0]);
        cidInitial = obj.map(n => [n[0], 0]);
        return { status: "CLOSED", change: obj.reverse() };
    }

    for (var b = balance, value = 0, i = CURRENCYUNIT.length - 1; i >= 0; i--) {
        while (b >= CURRENCYUNIT[i][1] && obj[i][1] > 0) {
            b = fix2(b - CURRENCYUNIT[i][1]);
            obj[i][1] = fix2(obj[i][1] - CURRENCYUNIT[i][1]);
            value = fix2(value + CURRENCYUNIT[i][1]);
        }
        if (value) {
            change.push([CURRENCYUNIT[i][0], value]), value = 0;
        }
    }

    if (balance >= 0) { 
        if (fix2(change.reduce((sum, n) => sum + n[1], 0)) < balance) { 
            cid = cidInitial.map(n => [n[0], n[1]]);
            return { status: "INSUFFICIENT_FUNDS", change: [] };
        } else {
            cidInitial = obj.map(n => [n[0], n[1]]);
            return { status: "OPEN", change };
        }
    }
    else return { status: `$${Math.abs(balance)} missing`, change: [] };
}


//ROMAN NUMERAL CONVERTER

const ROMANSYSTEM = {
    1: 'I',
    5: 'V',
    10: 'X',
    50: 'L',
    100: 'C',
    500: 'D',
    1000: 'M'
};

function convertToRoman(num) {
    let arabicNum = num;
    let romanNum = '';

    if (num < 1 || num > 3999) {
        return false;
    }

    while (arabicNum) {
        let keys = Object.keys(ROMANSYSTEM).map(n => Number(n));
        let arabicIndex = keys.concat(arabicNum).sort((a, b) => a - b).lastIndexOf(arabicNum);
        let [minor, major] = keys.slice(arabicIndex - 1, arabicIndex + 1);
        let div = Math.floor(arabicNum / minor);
        let minimum = /5|50|500/.test(minor) ? keys[arabicIndex - 2] : minor;

        //Subtractive notation
        //Base 5 numbers (V, L, and D) cannot be used to subtract.
        if (arabicNum + minimum >= major) {
            romanNum += ROMANSYSTEM[minimum];
            arabicNum += minimum;
        }
        //Additive notation
        //Unit (I) and base 10 numbers (X, C, and M) can be repeated up to 3 consecutive times.
        else {
            romanNum += ROMANSYSTEM[minor].repeat(div);
            arabicNum -= minor * div;
        }
    }

    return romanNum;
}

function convertToArabic(str) {
    let [keys, values] = [Object.keys(ROMANSYSTEM), Object.values(ROMANSYSTEM)];
    let num = str.split('').map(c => Number(keys[values.indexOf(c)]));
    let result = { 'Roman Number': 'Arabic Number'};

    for (var counter = 1, i = 0; i < str.length; i++) {
        /**Base 5 numbers (V, L and D) cannot be repeated and cannot be used to subtract 
        (i.e. cannot be to the left of a higher value number). **/
        if (/[VLD]/.test(str[i])) {
            if (num.filter(n => n === num[i]).length === 1 && num.slice(i).filter(n => n > num[i]).length === 0) {
                result[str[i]] = num[i];
            }
            else return false;
        }
        /** Unit (I) and base 10 numbers (X, C and M) can be repeated up to 3 consecutive times
        and although they can be used to subtract, they can only be done on the symbols with base 5 and 10
        of immediately higher value. In the case of subtracting, they cannot be repeated.**/
        else {
            if (num[i] === (num[i + 1] || 0)) {
                counter++;
                continue;
            }
            else if (num[i] < (num[i + 1] || 0)) {
                if (counter === 1 && values.indexOf(str[i + 1]) - values.indexOf(str[i]) <= 2 && (num[i + 2] || 0) < num[i]) {
                    result[str[i] + str[i + 1]] = num[i + 1] - num[i], i++;
                }
                else return false;
            }
            else if (counter <= 3 && (num[i - 1] || Infinity) >= num[i]) {
                result[str[i].repeat(counter)] = num[i] * counter, counter = 1;
            }
            else return false;
        }
    }

    result.Total = Object.values(result).map(n => isNaN(n) ? 0 : n).reduce((sum, n) => sum + n);
    return result;
}


//PALINDROME CHECKER

/**Solution: this solution never needs to read through the whole string, 
even once, to know that it’s not a palindrome.**/
function palindrome(str) {
    let first = 0;
    let last = str.length - 1;

    if (/^[\W_]*$/.test(str)) return 'Enter some alpha-numeric characters';

    while (last > first) {
        if (str[first].match(/[\W_]/)) {
            first++;
            continue;
        }
        if (str[last].match(/[\W_]/)) {
            last--;
            continue;
        }
        else if (str[first].toLowerCase() !== str[last].toLowerCase()) return false;
        first++, last--;
    }

    return true;
}

/**
Basic solution: perform very poorly on long strings.
function palindrome(str) {
    let word = str.toLowerCase().match(/[a-z0-9]/g);
    return word.join('') === word.reverse().join('');
}

Recursive solution: takes up more memory space.
function palindrome(str, first = 0, last = str.length - 1) {
    return last > first
        ? str[first].match(/[\W_]/)
            ? palindrome(str, first + 1, last)
            : str[last].match(/[\W_]/)
                ? palindrome(str, first, last - 1)
                : str[first].toLowerCase() !== str[last].toLowerCase()
                    ? false
                    : palindrome(str, first + 1, last - 1)
        : true;
}
**/


//CAESARS CIPHER (ROT13)

//Solution: using modulo operator to map a range of values to a range 26 numbers [65 - 90].
function rot13(str) {
    return str.replace(/([A-Z])/g, n => String.fromCharCode(n.charCodeAt() % 26 + 65))
        .replace(/([a-z])/g, n => String.fromCharCode(n.toUpperCase().charCodeAt() % 26 + 65).toLowerCase());
}

/**
function rot13(str) {
    let code = (letter) => letter.charCodeAt(), places = 13;
    return str.replace(/([A-Z])/g, n => String.fromCharCode(code(n) < 78
        ? code(n) + places
        : code(n) - places));
}
**/


//TELEPHONE NUMBER VALIDATOR 

function telephoneCheck(str) {
    return /^(?:1\s?)?(?:\d{3}|\(\d{3}\))[\s-]?\d{3}[\s-]?\d{4}$/.test(str);
}





