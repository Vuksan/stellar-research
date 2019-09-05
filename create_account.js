const stellarSdk = require("stellar-sdk")
const fetch = require("node-fetch")

async function main() {
    // Create new pair of keys
    const pair = stellarSdk.Keypair.random()

    const secret = pair.secret()
    const pubKey = pair.publicKey()
    console.log("Public key:", pubKey)
    console.log("Secret:", secret)

    // In order for account to be valid it needs to hold at least 1 lumen.
    // On testnetwork friendbot can help us by supplying us with 10k lumen.
    // The SDK doesn't have tools to fund test accounts,
    // so we have to make our own HTTP request.
    const response = await fetch(
        `https://friendbot.stellar.org?addr=${encodeURIComponent(pubKey)}`
    )
    const responseJson = await response.json()

    // Retrieve account's details to check its balance
    const server = new stellarSdk.Server("https://horizon-testnet.stellar.org")

    const account = await server.loadAccount(pubKey)
    console.log("Balances for account: " + pubKey)
    account.balances.forEach(function(balance) {
        console.log("Type:", balance.asset_type, ", Balance:", balance.balance)
    })
}

main()
    .catch(err => console.log(err))