const stellarSdk = require("stellar-sdk")

// Get command line arguments without first two
// (they represent node command and path to this script)
const args = process.argv.slice(2)

const server = new stellarSdk.Server("https://horizon-testnet.stellar.org")
const recipientPublicKey = args[0]

// Create an API call to query payments involving the account
const payments = server.payments().forAccount(recipientPublicKey)

// Stream will send each recorded payment, one by one, then keep the connection
// open and continue to send the new payments as they occur.
payments.stream({
    onmessage: function(payment) {
        // The payments stream includes both sent and received payments.
        // We only want to process received payments.
        if (payment.to !== recipientPublicKey) {
            return
        }

        let asset
        if (payment.asset_type === "native") {
            asset = "lumens"
        } else {
            asset = payment.asset_code + ":" + payment.asset_issuer
        }

        console.log(payment.amount + " " + asset + " from " + payment.from)
    },

    onerror: function(error) {
        console.log("Error in payment stream")
    },
})