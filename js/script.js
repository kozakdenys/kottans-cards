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
    ];
    
    inputEment.addEventListener("input", function () {
        var newValue = this.value.replace(/[^0-9.]/g, '').replace(/(.{4})/g, '$1 ').trim(),
            valueWithoutSpaces = this.value.replace(/ /g, '');
        
        if (newValue != valueWithoutSpaces) {
            this.value = newValue;
            $.setError(this);
        }
    });
    
    function luhnAlgorithm (value) {
        var sum = 0;
        
        for (var i = 1; i < value.length; i++) {
            var number = value[value.length - i];
            
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
        
        return sum;
    }
    
    function GetCreditCardVendor() {
        var value = inputEment.value.replace(/[^0-9.]/g, '');
        var resultVendor = {
            name: "Unknown"
        };
        
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
        
        resultElement.innerHTML = resultVendor.name;
    }

    function IsCreditCardNumberValid() {
        var value = inputEment.value.replace(/[^0-9.]/g, ''),
            IS_VALID = "Is valid",
            IS_INVALID = "Is invalid";
        
        var sum = luhnAlgorithm(value);
        
        if (value[value.length - 1] == sum) {
            resultElement.innerHTML = IS_VALID;
        } else {
            resultElement.innerHTML = IS_INVALID;
        }
    }

    function GenerateNextCreditCardNumber() {
        var value = inputEment.value.replace(/[^0-9.]/g, '');
        var newValue = parseInt(value) + 1;

        while (newValue.toString()[newValue.toString().length - 1] != luhnAlgorithm(newValue.toString())) {
            newValue++;
        }
        
        resultElement.innerHTML = newValue;
    }
    
    window.GetCreditCardVendor = GetCreditCardVendor;
    window.IsCreditCardNumberValid = IsCreditCardNumberValid;
    window.GenerateNextCreditCardNumber = GenerateNextCreditCardNumber;
}());

