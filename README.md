# stellar-research

- Install dependencies:
```
npm install
````

- Create two new accounts, each using this command:
```
node create_account.js
```

- Choose one account as a sender and another as a receiver

- Send a transaction from one to another:
```
node send_transaction.js <sender_secret> <receiver_public_key> <amount>
```

- In order to listen for previous and upcoming payments run:
```
node receive_transactions.js <account_public_key>
```