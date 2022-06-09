const assert = require("assert");
const ganache = require("ganache-cli");
const Web3 = require("web3");
const web3 = new Web3(ganache.provider());
const jsEncryptDecrypt = require("../src/encryptDecrypt.js");

const { abi, evm } = require("../compile");

let accounts;
let homework;

beforeEach(async () => {
  // Get a list of all accounts
  accounts = await web3.eth.getAccounts();
  // deploy the homework smart contract
  homework = await new web3.eth.Contract(abi)
    .deploy({
      data: evm.bytecode.object,
    })
    .send({ from: accounts[0], gas: "1000000" });
});

describe("Homework", () => {
  it("deploys a contract", () => {
    assert.ok(homework.options.address);
  });

  it("returns the same result, in javascript as in solidity", async () => {
    const data = [];
    const key = [];

    const solidityResult = await homework.methods
      .encryptDecrypt(data, key)
      .call();

    const javascriptResult = jsEncryptDecrypt(data, key);

    assert.equal(solidityResult, javascriptResult);
  });
});
