//CASH REGISTER

const coffeeShopAvailableMoneyElement = document.getElementById('coffee-shop-available-money');
const coffeeShopUnsortedMoneyElement = document.getElementById('coffee-shop-unsorted-money');
const quantityInputElement = document.getElementsByClassName('quantity-input');
const buyButtonElement = document.getElementsByClassName('buy-button');
const coffeeShopPurchaseSummaryElement = document.getElementById('coffee-shop-purchase-summary');
const coffeeShopDepositMoneyElement = document.getElementById('coffee-shop-deposit-money');
const coffeeShopMoneyBalanceElement = document.getElementById('coffe-shop-money-balance');

availableMoneyUpdate(cid);

function availableMoneyUpdate(obj) {

    let availableMoneyTable = document.createElement('table');
    availableMoneyTable.classList = 'coffee-shop-table';
    coffeeShopAvailableMoneyElement.appendChild(availableMoneyTable);

    let availableMoneyCaption = document.createElement('caption');
    availableMoneyCaption.classList = 'interface-subtitles';
    availableMoneyCaption.innerText = 'available money';
    availableMoneyTable.appendChild(availableMoneyCaption);

    obj.forEach(currency => {
        let tr = document.createElement('tr');
        let money = document.createElement('th');
        money.classList = 'available-money-th';
        let quantity = document.createElement('td');
        quantity.classList = 'available-money-td';

        money.innerHTML = `<samp>${currency[0]}</samp>`;
        quantity.innerHTML = `<samp>$ ${currency[1]}</samp>`;
        tr.appendChild(money);
        tr.appendChild(quantity);
        availableMoneyTable.appendChild(tr);
    });
}

let purchaseSummary = { description: ['unit value ($)', 'quantity (un)', 'subtotal ($)'] };
let unsortedMoneyValue = 0;

for (let i = 0; i < quantityInputElement.length; i++) {

    let quantityCounterMinusElement = quantityInputElement[i].parentElement.querySelector('.quantity-counter-minus');
    let quantityCounterPlusElement = quantityInputElement[i].parentElement.querySelector('.quantity-counter-plus')

    quantityCounterMinusElement.addEventListener('click', (e) => {
        quantityInputElement[i].value = Number(quantityInputElement[i].value) - 1;
    });

    quantityCounterPlusElement.addEventListener('click', (e) => {
        quantityInputElement[i].value = Number(quantityInputElement[i].value) + 1;
    });

    buyButtonElement[i].addEventListener('click', (e) => {
        if (Number(quantityInputElement[i].value) >= 0) {
            coffeeShopPurchaseSummaryElement.value = '';
            coffeeShopDepositMoneyElement.value = '';
            coffeeShopMoneyBalanceElement.value = '';
            delete purchaseSummary['total'];

            let price = Number(quantityInputElement[i].dataset.price);
            purchaseSummary[quantityInputElement[i].name] = [price, Number(quantityInputElement[i].value), fix2(price * Number(quantityInputElement[i].value))];
            let total = Object.values(purchaseSummary).map(n => isNaN(n[0]) ? 0 : n[2])
                .reduce((sum, n) => fix2(sum + n));
            purchaseSummary['total'] = ['', '', total];

            if (Number(quantityInputElement[i].value) === 0) {
                delete purchaseSummary[quantityInputElement[i].name];
            }

            if (Object.keys(purchaseSummary).length > 2) {
                let purchaseSummaryTable = document.createElement('table');
                purchaseSummaryTable.classList = 'coffee-shop-table';
                let purchaseSummaryCaption = document.createElement('caption');
                purchaseSummaryCaption.classList = 'interface-subtitles';
                purchaseSummaryCaption.innerText = 'purchase summary';
                purchaseSummaryTable.appendChild(purchaseSummaryCaption);
                coffeeShopPurchaseSummaryElement.appendChild(purchaseSummaryTable);

                for (let product in purchaseSummary) {
                    let tr = document.createElement('tr');
                    let description = document.createElement('th');
                    description.classList = 'purchase-summary-th';
                    let unitValue = document.createElement('td');
                    unitValue.classList = 'purchase-summary-td';
                    let quantity = document.createElement('td');
                    quantity.classList = 'purchase-summary-td';
                    let subtotal = document.createElement('td');
                    subtotal.classList = 'purchase-summary-td';

                    description.innerHTML = `<samp>${product}</samp>`;
                    unitValue.innerHTML = `<samp>${purchaseSummary[product][0]}</samp>`;
                    quantity.innerHTML = `<samp>${purchaseSummary[product][1]}</samp>`;
                    subtotal.innerHTML = `<samp>${purchaseSummary[product][2]}</samp>`;
                    tr.appendChild(description);
                    tr.appendChild(unitValue);
                    tr.appendChild(quantity);
                    tr.appendChild(subtotal);
                    purchaseSummaryTable.appendChild(tr);
                }

                let moneyInputLabel = document.createElement('label');
                moneyInputLabel.for = 'coffee-shop-money-input';
                moneyInputLabel.classList = 'interface-subtitles';
                let moneyInput = document.createElement('input');
                moneyInput.type = 'number';
                moneyInput.id = 'coffee-shop-money-input';
                moneyInput.classList = 'money-input';
                let paymentButton = document.createElement('button');
                paymentButton.type = 'button';
                paymentButton.id = 'coffee-shop-payment-button';
                paymentButton.classList = 'payment-button';

                moneyInputLabel.innerText = 'deposit money $';
                paymentButton.innerText = 'pay';

                coffeeShopDepositMoneyElement.appendChild(moneyInputLabel);
                coffeeShopDepositMoneyElement.appendChild(moneyInput);
                coffeeShopDepositMoneyElement.appendChild(paymentButton);

                let moneyInputValue = 0;

                moneyInput.addEventListener('input', (e) => {
                    moneyInputValue = Number(e.target.value);
                });

                paymentButton.addEventListener('click', (e) => {
                    coffeeShopMoneyBalanceElement.value = '';

                    let moneyBalance = checkCashRegister(purchaseSummary['total'][2], moneyInputValue, cid);
                    let moneyBalanceLabel = document.createElement('p');
                    moneyBalanceLabel.classList = 'interface-subtitles';
                    moneyBalanceLabel.innerHTML = `change <samp>(status: ${moneyBalance['status']})</samp>`;
                    coffeeShopMoneyBalanceElement.appendChild(moneyBalanceLabel);

                    if (moneyBalance['status'] === "OPEN" || moneyBalance['status'] === "CLOSED") {
                        coffeeShopMoneyBalanceElement.appendChild(moneyBalanceLabel);

                        for (let i = 0; i < quantityInputElement.length; i++) {
                            quantityInputElement[i].disabled = true;
                            quantityInputElement[i].parentElement.querySelector('.quantity-counter-minus').disabled = true;
                            quantityInputElement[i].parentElement.querySelector('.quantity-counter-plus').disabled = true;
                            buyButtonElement[i].disabled = true;
                        }
    
                        moneyInput.disabled = true;
                        moneyInput.classList = 'money-input disabled';
                        paymentButton.disabled = true;
                        paymentButton.classList = 'payment-button disabled';

                        let moneyBalanceOutput = document.createElement('output');
                        moneyBalanceOutput.classList = 'money-balance-output';
                        coffeeShopMoneyBalanceElement.appendChild(moneyBalanceOutput);

                         moneyBalance['change'].forEach(currency => {
                            let money = document.createElement('samp');
                            money.classList = 'money-output';
                            let infoCurrency = CURRENCYUNIT.filter(n => n[0] === currency[0]).flat();
                            let quantity = fix2(currency[1] / infoCurrency[1]);
                            let alt = '$' + infoCurrency[0];
                            money.innerHTML = `<img src=${infoCurrency[2]} alt=${alt}> x ${quantity}`;
                            moneyBalanceOutput.appendChild(money);
                        });
    
                        coffeeShopAvailableMoneyElement.value = '';
                        availableMoneyUpdate(cid);
                        coffeeShopUnsortedMoneyElement.value = '';
                        unsortedMoneyValue += moneyInputValue;

                        let unsortedMoneyLabel = document.createElement('p');
                        unsortedMoneyLabel.classList = 'interface-subtitles';
                        unsortedMoneyLabel.innerText = 'unsorted money';
                        coffeeShopUnsortedMoneyElement.appendChild(unsortedMoneyLabel);
    
                        let unsortedMoney = document.createElement('samp');
                        unsortedMoney.innerHTML = `$ ${unsortedMoneyValue}`;
                        coffeeShopUnsortedMoneyElement.appendChild(unsortedMoney);
                    }
           
                    let keepBuyingButton = document.createElement('button');
                    keepBuyingButton.type = 'button';
                    keepBuyingButton.id = 'coffee-shop-keep-buying-button';
                    keepBuyingButton.classList = 'reset-button';
                    keepBuyingButton.innerHTML = `make another purchase &#9654;`;
                    coffeeShopMoneyBalanceElement.appendChild(keepBuyingButton);    
        
                    keepBuyingButton.addEventListener('click', (e) => {
                        coffeeShopPurchaseSummaryElement.value = '';
                        coffeeShopDepositMoneyElement.value = '';
                        coffeeShopMoneyBalanceElement.value = '';
    
                        for (product in purchaseSummary) {
                            delete purchaseSummary[product];
                            purchaseSummary['description'] = ['unit value ($)', 'quantity (un)', 'subtotal ($)'];
                        }
    
                        for (let i = 0; i < quantityInputElement.length; i++) {
                            quantityInputElement[i].disabled = false;
                            quantityInputElement[i].value = 1;
                            quantityInputElement[i].parentElement.querySelector('.quantity-counter-minus').disabled = false;
                            quantityInputElement[i].parentElement.querySelector('.quantity-counter-plus').disabled = false;
                            buyButtonElement[i].disabled = false;
                        }
                    });
                });
            }
        }
    });
}


//ROMAN NUMERAL CONVERTER

const romanNumeralInputElement = document.getElementById('roman-numeral-input');
const romanNumeralClearButton = document.getElementById('roman-numeral-clear-button');
const romanNumeralOutputElement = document.getElementById('roman-numeral-output');

romanNumeralInputElement.addEventListener('input', (e) => {
    let value = e.target.value;
    let result, summary = false, invalid = 'Enter a valid Roman Numeral or Integer';

    if (/^\d+$/.test(value)) {
        if (convertToRoman(Number(value))) {
            result = convertToRoman(Number(value));
            summary = convertToArabic(result);
        }
        else result = invalid;
    }
    else if (/^[IVXLCDM]+$/i.test(value)) {
        value = value.toUpperCase();
        romanNumeralInputElement.value = value;
        if (convertToArabic(value)) {
            result = convertToArabic(value).Total;
            summary = convertToArabic(value);
        }
        else result = invalid;
    }
    else {
        result = invalid;
    }

    if (result === invalid) romanNumeralOutputElement.innerHTML = `<samp style='color: rgb(140, 0, 56);'>${result}<samp>`;
    else romanNumeralOutputElement.innerHTML = `<samp style='color: rgb(140, 0, 56); font-size: 150%;'>${result}<samp>`;

    if (summary) {
        let romanNumeralOutputTable = document.createElement('table');
        romanNumeralOutputTable.classList = 'roman-numeral-table';
        romanNumeralOutputElement.appendChild(romanNumeralOutputTable);

        Object.keys(summary).forEach(property => {
            let tr = document.createElement('tr');
            let romanNumber = document.createElement('td');
            let arabicNumber = document.createElement('td');

            romanNumber.innerText = property;
            arabicNumber.innerText = summary[property];
            tr.appendChild(romanNumber);
            tr.appendChild(arabicNumber);
            romanNumeralOutputTable.appendChild(tr);
        });        
    }
});

romanNumeralClearButton.addEventListener('click', (e) => {
    romanNumeralInputElement.value = '';
    romanNumeralOutputElement.value = '';
});


//PALINDROME CHECKER

const palindromeInputElement = document.getElementById('palindrome-input');
const palindromeClearButtonElement = document.getElementById('palindrome-clear-button');
const palindromeCharacterCounterElement = document.getElementById('palindrome-character-counter');
const palindromeOutputElement = document.getElementById('palindrome-output');

palindromeInputElement.addEventListener('input', (e) => {
    let value = e.target.value;
    palindromeCharacterCounterElement.innerHTML = `${value.length} / 5000`;
    let result = palindrome(value);
    palindromeOutputElement.innerHTML = `<strong>${result}</strong>`;
    if (result === true) palindromeOutputElement.style = 'color: rgba(0, 110, 140, 0.5)';
    else if (result === false) palindromeOutputElement.style = 'color: rgba(140, 0, 56, 0.5)';
    else palindromeOutputElement.style = 'color: rgb(200, 200, 200); font-size: 200%';
});

palindromeClearButtonElement.addEventListener('click', (e) => {
    palindromeInputElement.value = '';
    palindromeOutputElement.value = '';
    palindromeCharacterCounterElement.innerText = '0 / 5000';
});


//CAESARS CIPHER

const cipherInputElement = document.getElementById('cipher-input');
const cipherClearButtonElement = document.getElementById('cipher-clear-button');
const cipherCharacterCounterElement = document.getElementById('cipher-character-counter');
const cipherOutputElement = document.getElementById('cipher-output');

cipherInputElement.addEventListener('input', (e) => {
    let value = e.target.value;
    cipherCharacterCounterElement.innerHTML = `${value.length} / 5000`;
    let result = rot13(value);
    cipherOutputElement.innerText = result;
});

cipherClearButtonElement.addEventListener('click', (e) => {
    cipherInputElement.value = '';
    cipherOutputElement.value = '';
    cipherCharacterCounterElement.innerText = '0 / 5000';

});


//TELEPHONE NUMBER VALIDATOR 

const telephoneNumberInputElement = document.getElementById('telephone-number-input');
const telephoneNumberValidatorButtonElement = document.getElementById('telephone-number-validator-button');
const telephoneNumberClearButtonElement = document.getElementById('telephone-number-clear-button');
const telephoneNumberOutputElement = document.getElementById('telephone-number-output');

let telephoneNumberInputValue = '';

telephoneNumberInputElement.addEventListener('input', (e) => {
    telephoneNumberInputValue = e.target.value;
    telephoneNumberOutputElement.value = '';
});

telephoneNumberValidatorButtonElement.addEventListener('click', (e) => {
    let result = telephoneCheck(telephoneNumberInputValue);
    telephoneNumberOutputElement.innerHTML = `<samp>${result} number format</samp>`;
});

telephoneNumberClearButtonElement.addEventListener('click', (e) => {
    telephoneNumberInputElement.value = '';
    telephoneNumberOutputElement.value = '';
});







