import { ethers } from "ethers";

const encryptDecryptShort = (data: Uint8Array, key: string): Uint8Array => {
  const result = new Uint8Array(data);

  for (let i = 0; i < data?.length; i += 32) {
    ethers.utils
      .arrayify(ethers.utils.solidityKeccak256(["bytes", "uint"], [key, i]))
      .forEach((current, index) => {
        result[i + index] ^= current;
      });
  }
  
  return result;
};

export default encryptDecryptShort;
