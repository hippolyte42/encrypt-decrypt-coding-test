/* eslint-disable @typescript-eslint/no-var-requires */
import assert from 'assert';
import { ethers } from 'ethers';
import { beforeEach, describe, it } from 'mocha';
import Web3 from 'web3';
import { Contract } from 'web3-eth-contract';
import encryptDecryptLitteral from '../src/encryptDecryptLitteral';
import encryptDecryptShort from '../src/encryptDecryptShort';

const ganache = require('ganache-cli');
const web3 = new Web3(ganache.provider());
const { abi, evm } = require('../compile');

let accounts: string[];
let homework: Contract;
let testData: Uint8Array;
let testKey: string;

beforeEach(async () => {
  accounts = await web3.eth.getAccounts();
  // deploy the homework smart contract
  homework = await new web3.eth.Contract(abi)
    .deploy({
      data: evm.bytecode.object
    })
    .send({ from: accounts[0], gas: 1000000 });

  // set testing variables
  testData = ethers.utils.toUtf8Bytes('this.is.myBaseUri/');
  testKey = ethers.utils.solidityKeccak256(
    ['string', 'uint256', 'uint256', 'address'],
    ['myPassword', 42, 42, '0xe64399e90b3564215391Fe43645c5f2c8676115C'] // [password, chainId, batchTokenIndex, contractAddress]
  );
});

describe('encryptDecrypt returns the same results, in javascript as in solidity', () => {
  it('deploys the contract', () => {
    assert.ok(homework.options.address);
  });

  it('encryptDecryptLitteral returns the same results', async () => {
    const solidityResult = await homework.methods
      .encryptDecrypt(testData, testKey)
      .call();
    const javascriptResult = encryptDecryptLitteral(testData, testKey);

    assert.equal(solidityResult, ethers.utils.hexlify(javascriptResult));
  });

  it('encryptDecryptShort returns the same results', async () => {
    const solidityResult = await homework.methods
      .encryptDecrypt(testData, testKey)
      .call();
    const javascriptResult = encryptDecryptShort(testData, testKey);

    assert.equal(solidityResult, ethers.utils.hexlify(javascriptResult));
  });

  it('encryptDecrypt is symmetric: encryptDecrypt (encryptDecrypt (x, testKey), testKey) == x', async () => {
    const firstSolidityResult = await homework.methods
      .encryptDecrypt(testData, testKey)
      .call();
    const secondSolidityResult = await homework.methods
      .encryptDecrypt(firstSolidityResult, testKey)
      .call();
    assert.equal(secondSolidityResult, ethers.utils.hexlify(testData));

    const firstJavascriptResult = encryptDecryptShort(testData, testKey);
    const secondJavascriptResult = encryptDecryptShort(
      firstJavascriptResult,
      testKey
    );
    assert.equal(
      ethers.utils.hexlify(secondJavascriptResult),
      ethers.utils.hexlify(testData)
    );
  });
});
