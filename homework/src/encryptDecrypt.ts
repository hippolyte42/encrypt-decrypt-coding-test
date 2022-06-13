import { ethers } from "ethers";

const encryptDecrypt = (data: Uint8Array, key: string): Uint8Array => {
  // Store data length on stack for later use
  const length = data && data?.length;

  let result = new Uint8Array(0);

  // Iterate over the data stepping by 32 bytes
  for (let i = 0; i < length; i += 32) {
    // Generate hash of the key and offset
    const hash = ethers.utils.arrayify(
      ethers.utils.solidityKeccak256(["bytes", "uint"], [key, i]) // type because need size
    );
    // Read 32-bytes data chunk
    let chunk = data.slice(i, i + 32);
    // XOR the chunk with hash
    chunk = Uint8Array.from(chunk, (value, id) => value ^ hash[id]);

    // Write 32-byte encrypted chunk
    const tmp = new Uint8Array(result.length + chunk.length);
    tmp.set(result);
    tmp.set(chunk, result.length);
    result = tmp;
  }
  return result;
};

export default encryptDecrypt;