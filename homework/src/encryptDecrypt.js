const web3 = require("web3");

const encryptDecrypt = (data, key) => {
  let result = [];

  const length = data.length;
  for (let i = 0; i < length; i += 32) {
    const hash = web3.utils.soliditySha3(
      { t: "bytes", v: data },
      { t: "bytes", v: key }
    );

    let chunk = [];
    chunk ^= hash;

    result = chunk;
  }

  return result;
};

module.exports = encryptDecrypt;
