/**
 * Please note: The Promo Code callback is extremely flexible. This example
 * implementation is only one of many ways to interface with it.
 *
 * In production, your promo codes and payment logic should be securely
 * processed on your server, not client-side as in this example. Use AJAX to
 * pass this information to the payment sheet.
 */

/**
 * Define the version of the Google Pay API referenced when creating your
 * configuration
 *
 * @see {@link https://developers.google.com/pay/api/web/reference/request-objects#PaymentDataRequest|apiVersion in PaymentDataRequest}
        */
const baseRequest = {
    apiVersion: 2,
    apiVersionMinor: 0
};

/**
 * Define valid promo code strings
 *
 * This object paradigm is not necessary to implement Promo Codes, but provides
 * an example of how to implement promo code behavior in a modular way.
 *
 * In production, your promo codes should be securely processed on your server,
 * not client-side as in this example.
 *
 * code: the way the promo code itself is displayed in the payment sheet
 * description: the description provided to the user on the payment sheet
 * function: the function used to calculate the price change
 * value: the value passed into the above function. This value should be
 * negative for a discount.
 */

const validPromoCodes = {
    SOMEPROMOCODE: {
        code: 'SOMEPROMOCODE',
        description: '20% off all products!',
        function: percentageDiscount,
        value: -20 // value should be negative for a discount
    },
    ANOTHERPROMOCODE: {
        code: 'ANOTHERPROMOCODE',
        description: '$5 dollars off!',
        function: staticDiscount,
        value: -5.00 // value should be negative for a discount
    }
}

/**
 * Card networks supported by your site and your gateway
 *
 * @see {@link https://developers.google.com/pay/api/web/reference/request-objects#CardParameters|CardParameters}
        * @todo confirm card networks supported by your site and gateway
        */
const allowedCardNetworks = ['AMEX', 'DISCOVER', 'JCB', 'MASTERCARD', 'MIR', 'VISA'];

/**
 * Card authentication methods supported by your site and your gateway
 *
 * @see {@link https://developers.google.com/pay/api/web/reference/request-objects#CardParameters|CardParameters}
        * @todo confirm your processor supports Android device tokens for your
        * supported card networks
        */
const allowedCardAuthMethods = ['PAN_ONLY', 'CRYPTOGRAM_3DS'];

/**
 * Identify your gateway and your site's gateway merchant identifier
 *
 * The Google Pay API response will return an encrypted payment method capable
 * of being charged by a supported gateway after payer authorization
 *
 * @todo check with your gateway on the parameters to pass
 * @see {@link https://developers.google.com/pay/api/web/reference/request-objects#gateway|PaymentMethodTokenizationSpecification}
        */
const tokenizationSpecification = {
    type: 'PAYMENT_GATEWAY',
    parameters: {
        gateway: 'example',
        gatewayMerchantId: 'exampleGatewayMerchantId'
    }
};

/**
 * Describe your site's support for the CARD payment method and its required
 * fields
 *
 * @see {@link https://developers.google.com/pay/api/web/reference/request-objects#CardParameters|CardParameters}
        */
const baseCardPaymentMethod = {
    type: 'CARD',
    parameters: {
        allowedAuthMethods: allowedCardAuthMethods,
        allowedCardNetworks: allowedCardNetworks
    }
};

/**
 * Describe your site's support for the CARD payment method including optional
 * fields
 *
 * @see {@link https://developers.google.com/pay/api/web/reference/request-objects#CardParameters|CardParameters}
        */
const cardPaymentMethod = Object.assign(
    {},
    baseCardPaymentMethod,
    {
        tokenizationSpecification: tokenizationSpecification
    }
);

/**
 * An initialized google.payments.api.PaymentsClient object or null if not yet set
 *
 * @see {@link getGooglePaymentsClient}
        */
let paymentsClient = null;

/**
 * Configure your site's support for payment methods supported by the Google Pay
 * API.
 *
 * Each member of allowedPaymentMethods should contain only the required fields,
 * allowing reuse of this base request when determining a viewer's ability
 * to pay and later requesting a supported payment method
 *
 * @returns {object} Google Pay API version, payment methods supported by the site
        */
function getGoogleIsReadyToPayRequest() {
    return Object.assign(
        {},
        baseRequest,
        {
            allowedPaymentMethods: [baseCardPaymentMethod]
        }
    );
}

/**
 * Configure support for the Google Pay API
 *
 * @see {@link https://developers.google.com/pay/api/web/reference/request-objects#PaymentDataRequest|PaymentDataRequest}
        * @returns {object} PaymentDataRequest fields
        */
function getGooglePaymentDataRequest() {
    const paymentDataRequest = Object.assign({}, baseRequest);
    paymentDataRequest.allowedPaymentMethods = [cardPaymentMethod];
    paymentDataRequest.transactionInfo = getGoogleTransactionInfo();
    paymentDataRequest.merchantInfo = {
        // @todo a merchant ID is available for a production environment after approval by Google
        // See {@link https://developers.google.com/pay/api/web/guides/test-and-deploy/integration-checklist|Integration checklist}
        // merchantId: '12345678901234567890',
        merchantName: 'Example Merchant'
    };

    paymentDataRequest.callbackIntents = ['OFFER'];
    paymentDataRequest.shippingAddressRequired = false;
    paymentDataRequest.shippingAddressParameters = getGoogleShippingAddressParameters();

    return paymentDataRequest;
}

/**
 * Return an active PaymentsClient or initialize
 *
 * @see {@link https://developers.google.com/pay/api/web/reference/client#PaymentsClient|PaymentsClient constructor}
        * @returns {google.payments.api.PaymentsClient} Google Pay API client
        */
function getGooglePaymentsClient() {
    if (paymentsClient === null) {
        paymentsClient = new google.payments.api.PaymentsClient({
            environment: 'TEST',
            merchantInfo: {
                merchantName: 'Example Merchant',
                merchantId: '01234567890123456789'
            },
            paymentDataCallbacks: {
                onPaymentDataChanged: onPaymentDataChanged
            }
        });
    }
    return paymentsClient;
}

/**
 * These functions handle adding valid promo codes to the payment sheet
 * as well as adjusting the display items to match.
 *
 * To add a new promo code, create a new function per this template
 * and define it as valid in the onPaymentDataChanged function.
 *
 * @see {@link https://developers.google.com/pay/api/web/reference/response-objects#PaymentDataRequestUpdate|PaymentDataRequestUpdate}
        * @param {string} redemptionCode string representing the promo code to apply
        * @param {string} description string representing the description to show
        * @param {int} discountPercentage int representing the percentage to discount.
        * Please note the discount value should be negative. Ex: -20 = 20% discount.
        * @param {object} PaymentDataRequestUpdate object representing
        * the current state of the payment data request.
        * @returns {object} PaymentDataRequestUpdate object to update the
        * payment sheet with new transaction info and offer data.
        */

function percentageDiscount(promoParameters, paymentDataRequestUpdate) {
    // set variables
    let originalTransactionInfo = getGoogleTransactionInfo();
    /* because this promo code calculates a % of original prices,
     * we need to get the original transaction info */
    let newTransactionInfo = paymentDataRequestUpdate.newTransactionInfo;
    let discount = 0;

    // update promo code and description
    paymentDataRequestUpdate.newOfferInfo.offers.push({
        redemptionCode: promoParameters['code'],
        description: promoParameters['description']
    });

    // calculate discount (from original transaction items only)
    originalTransactionInfo.displayItems.forEach(function (displayItem) {
        discount += parseFloat(displayItem.price) * promoParameters['value'] * 0.01;
    });

    // add displayItem with new discount
    newTransactionInfo.displayItems.push({
        label: promoParameters['code'],
        price: discount.toFixed(2),
        type: 'LINE_ITEM'
    });

    return paymentDataRequestUpdate;
}

function staticDiscount(promoParameters, paymentDataRequestUpdate) {
    // set variables
    let newTransactionInfo = paymentDataRequestUpdate.newTransactionInfo;

    // update promo code and description
    paymentDataRequestUpdate.newOfferInfo.offers.push({
        redemptionCode: promoParameters['code'],
        description: promoParameters['description']
    });

    // add displayItem with new discount
    newTransactionInfo.displayItems.push({
        label: promoParameters['code'],
        price: promoParameters['value'].toFixed(2),
        type: 'LINE_ITEM'
    });

    return paymentDataRequestUpdate;
}

/**
 * Handles offer callback intents.
 *
 * @param {object} itermediatePaymentData response from Google Pay API when a promo code is entered in the google pay payment sheet.
        * @see {@link https://developers.google.com/pay/api/web/reference/response-objects#IntermediatePaymentData|IntermediatePaymentData object reference}
        *
        * @see {@link https://developers.google.com/pay/api/web/reference/response-objects#PaymentDataRequestUpdate|PaymentDataRequestUpdate}
        * @returns Promise<{object}> Promise of PaymentDataRequestUpdate object to update the payment sheet with new transaction info and offer data.
            */
function onPaymentDataChanged(intermediatePaymentData) {
    return new Promise(function (resolve, reject) {

        let redemptionCodes = new Set();
        let shippingOptionData = intermediatePaymentData.shippingOptionData;
        let paymentDataRequestUpdate = {};
        paymentDataRequestUpdate.newTransactionInfo = getGoogleTransactionInfo();

        // ensure that promo codes set is unique
        if (typeof intermediatePaymentData.offerData != 'undefined') {
            redemptionCodes = new Set(intermediatePaymentData.offerData.redemptionCodes);
        }

        // validate promo codes and add descriptions to payment sheet
        if (intermediatePaymentData.callbackTrigger === 'OFFER') {
            paymentDataRequestUpdate.newOfferInfo = {};
            paymentDataRequestUpdate.newOfferInfo.offers = [];
            for (redemptionCode of redemptionCodes) {
                if (validPromoCodes[redemptionCode]) {
                    paymentDataRequestUpdate = validPromoCodes[redemptionCode].function(
                        validPromoCodes[redemptionCode],
                        paymentDataRequestUpdate
                    );
                } else {
                    paymentDataRequestUpdate.error = getGoogleOfferInvalidError(redemptionCode);
                }
            }
        }
        /**
         * Update item costs and total.
         *
         * In production, this final calculation should always be calculated
         * server-side to ensure it matches the price that the merchant sends to the
         * processor.
         */
        paymentDataRequestUpdate.newTransactionInfo = calculateNewTransactionInfo(
            paymentDataRequestUpdate.newTransactionInfo
        )

        resolve(paymentDataRequestUpdate);
    });
}

/**
 * Helper function to update the TransactionInfo object.
 *
 * @see {@link https://developers.google.com/pay/api/web/reference/request-objects#TransactionInfo|TransactionInfo}
            * @param {object} transactionInfo respresenting the selected shipping option in the payment sheet.
            *
            * @see {@link https://developers.google.com/pay/api/web/reference/request-objects#TransactionInfo|TransactionInfo}
            * @returns {object} transaction info, suitable for use as transactionInfo property of PaymentDataRequest
            */
function calculateNewTransactionInfo(newTransactionInfo) {
    // calculate the new totalPrice from display items
    let totalPrice = 0.00;
    newTransactionInfo.displayItems.forEach(
        function (displayItem) {
            totalPrice += parseFloat(displayItem.price);
        }
    );
    // Note: newTransactionInfo.totalPrice must be a string
    newTransactionInfo.totalPrice = totalPrice.toFixed(2);

    return newTransactionInfo;
}

/**
 * Initialize Google PaymentsClient after Google-hosted JavaScript has loaded
 *
 * Display a Google Pay payment button after confirmation of the viewer's
 * ability to pay.
 */
function onGooglePayLoaded() {
    const paymentsClient = getGooglePaymentsClient();
    paymentsClient.isReadyToPay(getGoogleIsReadyToPayRequest())
        .then(function (response) {
            if (response.result) {
                //addGooglePayButton();
                // @todo prefetch payment data to improve performance after confirming site functionality
                // prefetchGooglePaymentData();
            }
        })
        .catch(function (err) {
            // show error in developer console for debugging
            console.error(err);
        });
}

/**
 * Add a Google Pay purchase button alongside an existing checkout button
 *
 * @see {@link https://developers.google.com/pay/api/web/reference/request-objects#ButtonOptions|Button options}
            * @see {@link https://developers.google.com/pay/api/web/guides/brand-guidelines|Google Pay brand guidelines}
            */
function addGooglePayButton() {
    const paymentsClient = getGooglePaymentsClient();
    const button =
        paymentsClient.createButton({
            onClick: onGooglePaymentButtonClicked,
            allowedPaymentMethods: [baseCardPaymentMethod]
        });
    document.querySelector('.buy_btn').appendChild(button);
}

/**
 * Provide Google Pay API with a payment amount, currency, and amount status
 *
 * @see {@link https://developers.google.com/pay/api/web/reference/request-objects#TransactionInfo|TransactionInfo}
            * @returns {object} transaction info, suitable for use as transactionInfo property of PaymentDataRequest
            */
function getGoogleTransactionInfo() {
    return {
        displayItems: [
            {
                label: 'Subtotal',
                type: 'SUBTOTAL',
                price: '11.00',
                status: 'FINAL'
            },
            {
                label: 'Tax',
                type: 'TAX',
                price: '1.00'
            }
        ],
        currencyCode: 'USD',
        totalPriceStatus: 'FINAL',
        totalPrice: '12.00',
        totalPriceLabel: 'Total'
    };
}

/**
 * Provide Google Pay API with shipping address parameters.
 *
 * @see {@link https://developers.google.com/pay/api/web/reference/request-objects#ShippingAddressParameters|ShippingAddressParameters}
            * @returns {object} shipping address details, suitable for use as shippingAddressParameters property of PaymentDataRequest
            */
function getGoogleShippingAddressParameters() {
    return {
        allowedCountryCodes: ['US', 'UK', 'FR', 'CA', 'MX', 'GA'],
        phoneNumberRequired: false
    };
}

/**
 * Provide Google Pay API with an invalid offer error.
 *
 * @see {@link https://developers.google.com/pay/api/web/reference/response-objects#PaymentDataError|PaymentDataError}
            * @returns {object} payment data error, suitable for use as error property of PaymentDataRequestUpdate
            */
function getGoogleOfferInvalidError(redemptionCode) {
    return {
        reason: 'OFFER_INVALID',
        message: redemptionCode + ' is not a valid promo code.',
        intent: 'OFFER'
    };
}

/**
 * Prefetch payment data to improve performance
 *
 * @see {@link https://developers.google.com/pay/api/web/reference/client#prefetchPaymentData|prefetchPaymentData()}
            */
function prefetchGooglePaymentData() {
    const paymentDataRequest = getGooglePaymentDataRequest();
    // transactionInfo must be set but does not affect cache
    paymentDataRequest.transactionInfo = {
        totalPriceStatus: 'NOT_CURRENTLY_KNOWN',
        currencyCode: 'USD'
    };
    const paymentsClient = getGooglePaymentsClient();
    paymentsClient.prefetchPaymentData(paymentDataRequest);
}

/**
 * Show Google Pay payment sheet when Google Pay payment button is clicked
 */
function onGooglePaymentButtonClicked() {
    const paymentDataRequest = getGooglePaymentDataRequest();
    paymentDataRequest.transactionInfo = getGoogleTransactionInfo();

    const paymentsClient = getGooglePaymentsClient();
    paymentsClient.loadPaymentData(paymentDataRequest)
        .then(function (paymentData) {
            // handle the response
            processPayment(paymentData);
        })
        .catch(function (err) {
            // show error in developer console for debugging
            console.error(err);
        });
}

/**
 * Process payment data returned by the Google Pay API
 * In a production environment, this function should always be implemented
 * server-side.
 *
 * @param {object} paymentData response from Google Pay API after user approves payment
            * @see {@link https://developers.google.com/pay/api/web/reference/response-objects#PaymentData|PaymentData object reference}
            */
function processPayment(paymentData) {
    // show returned data in developer console for debugging
    console.log(paymentData);
    // @todo pass payment token to your gateway to process payment
    paymentToken = paymentData.paymentMethodData.tokenizationData.token;
}