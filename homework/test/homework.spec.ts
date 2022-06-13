import assert from "assert";
import { ethers } from "ethers";
import { beforeEach, describe, it } from "mocha";
import Web3 from "web3";
import { Contract } from "web3-eth-contract";
import jsEncryptDecrypt from "../src/encryptDecrypt";
import encryptDecryptSwagg from "../src/encryptDecryptSwagg";

// eslint-disable-next-line @typescript-eslint/no-var-requires
const ganache = require("ganache-cli");
const web3 = new Web3(ganache.provider());
// eslint-disable-next-line @typescript-eslint/no-var-requires
const { abi, evm } = require("../compile");

let accounts: string[];
let homework: Contract;

beforeEach(async () => {
  // Get a list of all accounts
  accounts = await web3.eth.getAccounts();
  // deploy the homework smart contract
  homework = await new web3.eth.Contract(abi)
    .deploy({
      data: evm.bytecode.object,
    })
    .send({ from: accounts[0], gas: 1000000 });
});

describe(
  "encryptDecrypt returns the same results, in javascript as in solidity",
  () => {
    it("deploys a contract", () => {
      assert.ok(homework.options.address);
    });

    it(
      "encryptDecrypt returns the same results, in javascript as in solidity",
      async () => {
        const data = ethers.utils.toUtf8Bytes("this.is.myBaseUri/"); // https://ethereum.stackexchange.com/questions/23058/how-to-convert-string-to-bytes32-in-web3js
        const key = ethers.utils.solidityKeccak256(
          ["string", "uint256", "uint256", "address"],
          ["myPassword", 1, 1, "0xe64399e90b3564215391Fe43645c5f2c8676115C"] // [password, chainId, batchTokenIndex, contractAddress]
        );

        const solidityResult = await homework.methods
          .encryptDecrypt(data, key)
          .call();
        const javascriptResult = jsEncryptDecrypt(data, key);

        assert.equal(solidityResult, ethers.utils.hexlify(javascriptResult));
      }
    );

    it(
      "encryptDecryptSwagg returns the same results, in javascript as in solidity",
      async () => {
        const data = ethers.utils.toUtf8Bytes("this.is.myBaseUri/"); // https://ethereum.stackexchange.com/questions/23058/how-to-convert-string-to-bytes32-in-web3js
        const key = ethers.utils.solidityKeccak256(
          ["string", "uint256", "uint256", "address"],
          ["myPassword", 1, 1, "0xe64399e90b3564215391Fe43645c5f2c8676115C"] // [password, chainId, batchTokenIndex, contractAddress]
        );

        const solidityResult = await homework.methods
          .encryptDecrypt(data, key)
          .call();
        const javascriptResult = encryptDecryptSwagg(data, key);

        assert.equal(solidityResult, ethers.utils.hexlify(javascriptResult));
      }
    );
  }
);
