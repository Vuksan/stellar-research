const stellarSdk = require('stellar-sdk')

async function main() {
    // Get command line arguments without first two
    // (they represent node command and path to this script)
    const args = process.argv.slice(2)

    // The source account is the account we will be sending from
    const sourceSecretKey = args[0]
    // Get public key from secret key
    const sourceKeypair = stellarSdk.Keypair.fromSecret(sourceSecretKey)
    const sourcePublicKey = sourceKeypair.publicKey()

    // Get destination public key
    const destinationPublicKey = args[1]

    // Get amount to send
    const amount = args[2]
    // Configure StellarSdk to talk to testnet
    const server = new stellarSdk.Server("https://horizon-testnet.stellar.org")
    // Build transactions for test network

    // Check if the destination account exists
    await server.loadAccount(destinationPublicKey)

    // Load up-to-date information on our (sender) account
    const sourceAccount = await server.loadAccount(sourcePublicKey)

    // Build the transaction
    const transaction = new stellarSdk.TransactionBuilder(sourceAccount, {
        fee: stellarSdk.BASE_FEE,
        networkPassphrase: stellarSdk.Networks.TESTNET,
    })
        .addOperation(stellarSdk.Operation.payment({
            destination: destinationPublicKey,
            asset: stellarSdk.Asset.native(),
            amount: amount,
        }))
        // A memo allows you to add your own metadata to a transaction.
        // It's optional and doesn't affect how Stellar treats the transaction.
        .addMemo(stellarSdk.Memo.text("Test Transaction"))
        // Wait a maximum of three minutes for the transaction
        .setTimeout(180)
        .build()

    // Sign the transaction
    transaction.sign(sourceKeypair)
    // Submit transaction to Horizon server which will then submit it to the Stellar network
    return server.submitTransaction(transaction)
}

main()
    .then(function (result) {
        console.log("Success! Results:", result)
    })
    .catch(function (error) {
        console.error("Something went wrong!", error)
    })