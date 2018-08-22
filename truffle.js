
module.exports = {
  // See <http://truffleframework.com/docs/advanced/configuration>
  // for more about customizing your Truffle configuration!
  networks: {
    development: {
      host: "127.0.0.1",
      port: 8545,
      network_id: "*", // Match any network id
    }
  },rinkeby: {
    host: "localhost", // Connect to geth on the specified
    port: 8545,
    from: "0x839c18df17236382f8832d9ab5ef3facafbac891", // default address to use for any transaction Truffle makes during migrations
    network_id: 4
    }
}
