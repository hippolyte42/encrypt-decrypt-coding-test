import { ethers } from "ethers";

const encryptDecryptSwagg = (data: Uint8Array, key: string): Uint8Array => {
  // Store data length on stack for later use
  const length = data && data?.length;

  const result = new Uint8Array(data);

  // Iterate over the data stepping by 32 bytes
  for (let i = 0; i < length; i += 32) {
    // Generate hash of the key and offset
    ethers.utils
      .arrayify(ethers.utils.solidityKeccak256(["bytes", "uint"], [key, i]))
      .forEach((current, index) => {
        result[i + index] ^= current;
      });
  }
  return result;
};

export default encryptDecryptSwagg;
