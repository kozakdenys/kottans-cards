(function () {
    'use strict';
    var inputEment = document.getElementById("main-input"),
        resultElement = document.getElementById("result");
    
    var $ = {
        empty: function (element) {
            while (element.hasChildNodes()) {
                element.removeChild(element.firstChild);
            }
        },
        setError: function (element) {
            element.classList.add("error");
        },
        removeError: function (element) {
            element.classList.remove("error");
        }
    };
    
    var VENDORS = [
        {
            name: 'American Express',
            length: [[15]],
            code: [[34], [37]]
        },
        {
            name: 'Maestro',
            length: [[12, 19]],
            code: [[50], [56, 69]]
        },
        {
            name: 'MasterCard',
            length: [[16]],
            code: [[51, 59]]
        },
        {
            name: 'VISA',
            length: [[13], [16], [19]],
            code: [[4]]
        },
        {
            name: 'JCB',
            length: [[16]],
            code: [[3528, 3589]]
        }
    ],
    IS_VALID = "Is valid",
    IS_INVALID = "Is invalid card number",
    NO_MORE_CARDS = "No more card numbers available for this vendor",
    UNKNOWN_VENDOR = "Unknown";
    
    inputEment.addEventListener("input", function () {
        var valueWithoutLatters = this.value.replace(/[^0-9]/g, ''),
            valueWithoutSpaces = this.value.replace(/ /g, '');
        
        if (valueWithoutLatters != valueWithoutSpaces) {
            $.setError(this);
        } else {
            $.removeError(this);
        }
        
        this.value = valueWithoutLatters.replace(/(.{4})/g, '$1 ').trim()
    });
    
    function isValidCard(value) {
        var sum = 0;
        
        for (var i = 1; i <= value.length; i++) {
            var number = parseInt(value[value.length - i]);

            if (i % 2 == 0) {
                number = number * 2;
                
                if (number > 9) {
                    number = number - 9;
                }
            }

            sum = sum + number;
        }
                
        sum = 10 - (sum % 10);
        
        if (sum == 10) {
            sum = 0;
        }

        return !sum;
    }
    
    function getVendor(value) {
        var resultVendor = {
            name: UNKNOWN_VENDOR
        };
        
        if (isValidCard(value)) {
            for (var i = 0; i < VENDORS.length; i++) {
                var currentVendor = VENDORS[i];
                var resultOfCicle = {
                    length: false,
                    code: false
                }

                for (var j = 0; j < currentVendor.length.length; j++) {
                    var valueLength = value.length;

                    if (valueLength >= currentVendor.length[j][0] && valueLength <= (currentVendor.length[j][1] || currentVendor.length[j][0])) {
                        resultOfCicle.length = true;
                    }
                }

                for (var j = 0; j < currentVendor.code.length; j++) {
                    var valueCode = parseInt(value.substring(0, currentVendor.code[j][0].toString().length));

                    if (valueCode >= currentVendor.code[j][0] && valueCode <= (currentVendor.code[j][1] || currentVendor.code[j][0])) {
                        resultOfCicle.code = true;
                    }
                }

                if (resultOfCicle.code && resultOfCicle.length) {
                    resultVendor = currentVendor;
                    break;
                }
            }
        }
        
        return resultVendor;
    }
    
    function GetCreditCardVendor() {
        var value = inputEment.value.replace(/[^0-9.]/g, '');
        
        resultElement.innerHTML = getVendor(value).name;
    }

    function IsCreditCardNumberValid() {
        var value = inputEment.value.replace(/[^0-9.]/g, '');
        
        if (getVendor(value).name != UNKNOWN_VENDOR) {
            resultElement.innerHTML = IS_VALID;
        } else {
            resultElement.innerHTML = IS_INVALID;
        }
    }

    function GenerateNextCreditCardNumber() {
        var value = inputEment.value.replace(/[^0-9.]/g, '');
        var vendorName = getVendor(value).name;
        
        function res(a, b, result, carry, base) {
            if(a.length == 0 && b.length == 0 && !carry)
                return result;

            var left = parseInt(a.pop() || '0', 10);
            var right = parseInt(b.pop() || '0', 10);

            var l = left + right + (carry || 0);

            return res(a, b, l % base + (result || ""), Math.floor(l/base), base);
        }

        function add(a, b) {
            return res(a.toString().split(""), b.toString().split(""), "","",10).toString();
        }
        
        value = add(value, 1);

        while (!isValidCard(value)) {
            value = add(value, 1);
        }
        
        if ((vendorName != UNKNOWN_VENDOR) && (getVendor(value).name != vendorName)) {
            value = NO_MORE_CARDS;
        }
        
        resultElement.innerHTML = value;
    }
    
    window.GetCreditCardVendor = GetCreditCardVendor;
    window.IsCreditCardNumberValid = IsCreditCardNumberValid;
    window.GenerateNextCreditCardNumber = GenerateNextCreditCardNumber;
}());

