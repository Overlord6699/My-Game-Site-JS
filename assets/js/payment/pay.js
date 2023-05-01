window.onload = () => {
    paymentRequest = createPayment();
}

function setAddressChangeEvent(paymentRequest) {
    paymentRequest.addEventListener('shippingaddresschange', evt => {
        evt.updateWith(
            new Promise(resolve => {
                let newInfo = getNewInfo(paymentRequest.shippingaddress);
                resolve(newInfo);
            })
        )
    })
}

function buildSupportedPaymentMethodData() {

    const googlePaymentDataRequest = {
        environment: 'TEST',
        apiVersion: 2,
        apiVersionMinor: 0,
        merchantInfo: {
            // A merchant ID is available after approval by Google.
            // @see {@link https://developers.google.com/pay/api/web/guides/test-and-deploy/integration-checklist}
            // merchantId: '12345678901234567890',
            merchantName: 'Example Merchant'
        },
        //paymentDataCallbacks: {
        //    onPaymentAuthorized: onPaymentAuthorized
        //},
        allowedPaymentMethods: [{
            type: 'CARD',
            parameters: {
                allowedAuthMethods: ["PAN_ONLY", "CRYPTOGRAM_3DS"],
                allowedCardNetworks: ["AMEX", "DISCOVER", "INTERAC", "JCB", "MASTERCARD", "VISA"],
                "assuranceDetailsRequired": true //вовзрат проверки с обработчика
            },
            tokenizationSpecification: {
                type: 'PAYMENT_GATEWAY',
                // Check with your payment gateway on the parameters to pass.
                // @see {@link https://developers.google.com/pay/api/web/reference/request-objects#gateway}
                parameters: {
                    'gateway': 'example',
                    'gatewayMerchantId': 'exampleGatewayMerchantId'
                }
            }
        }]
    };

    return [{
        supportedMethods: 'https://google.com/pay',
        data: googlePaymentDataRequest
    },
    {
        supportedMethods: 'basic-card',
    }];
}

function buildShoppingCartDetails() {
    /* данные с сервера
    const getTotalAmount = async () => {
        // Fetch the total amount from the server, etc.
      };
*/

    return {
        id: 'count-order',
        displayItems: [
            {
                label: 'Example item',
                amount: { currency: 'USD', value: '1.00' }
            }
        ],
        total: {
            label: 'Total',
            amount: { currency: 'USD', value: '100' }
        }
    };
}

function createPayment() {
    if (window.PaymentRequest) {

        const options = {

        }

        //нужно создавать каждый раз
        const paymentRequest = new PaymentRequest(
            buildSupportedPaymentMethodData(),
            buildShoppingCartDetails()
        );

        paymentRequest.canMakePayment()
            .then(function (result) {
                if (result) {
                    // подписка на событие
                    document.querySelector('.buy_btn')
                        .addEventListener('click', onBuyClicked);
                }
            })
            .catch(function (err) {
                showErrorForDebugging(
                    'canMakePayment() error! ' + err.name + ' error: ' + err.message);
            });

        setAddressChangeEvent(paymentRequest);

        return paymentRequest;
    } else { //невозможно провести транзакцию
        showErrorForDebugging('PaymentRequest API is not available.');
        return null;
    }
}

function onBuyClicked() {
    createPayment()
        .show()
        .then(function (response) {
            response.complete('success');
            handlePaymentResponse(response);
        })
        .catch(function (err) {
            alert('Transaction error')
            showErrorForDebugging(
                'show() error! ' + err.name + ' error: ' + err.message);
        });
}


function showErrorForDebugging(text) {
    console.log("error");
    /*
    const errorDisplay = document.createElement('code');
    errorDisplay.style.color = 'red';
    errorDisplay.appendChild(document.createTextNode(text));
    const p = document.createElement('p');
    p.appendChild(errorDisplay);
    document.getElementById('checkout').insertAdjacentElement('afterend', p);
    */
}

function handlePaymentResponse(response) {
    console.log("handling");
    /*
    const formattedResponse = document.createElement('pre');
    formattedResponse.appendChild(
        document.createTextNode(JSON.stringify(response.toJSON(), null, 2)));
    document.getElementById('checkout')
        .insertAdjacentElement('afterend', formattedResponse);
        */
}
