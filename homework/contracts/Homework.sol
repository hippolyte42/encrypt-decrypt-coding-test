// SPDX-License-Identifier: Apache-2.0
pragma solidity ^0.8.11;

contract Homework {
    // encryptDecrypt est une fonction pure (qui ne modifie ni ne lit de la donnée du state)
    // encryptDecrypt prend en parametre un premier argument data de type bytes (soit un tableau d'octets à taille dynamique)
    // // définit en tant que memory et donc seulement utilisable pendant l'exécution de cette fonction (variable local)
    // encryptDecrypt prend en parametre un second argument key de type bytes (soit un tableau d'octets à taille dynamique)
    // // définit en tant que calldata et donc seulement utilisable pendant l'exécution de cette fonction (variable local) et non modifiable
    // encryptDecrypt renvoie une variable result, soit un tableaux d'octets à taille dynamique,
    // // result est définit en tant que memory et donc seulement utilisable pendant l'exécution de cette fonction et non inscite dans le state (variable local)

    // todo revoir les maths de octets https://developer.mozilla.org/en-US/docs/Web/JavaScript/Typed_arrays
    // todo définir le but de la fonction
    function encryptDecrypt(bytes memory data, bytes calldata key)
        public
        pure
        returns (bytes memory result)
    {
        // Store data length on stack for later use
        // ici on récupère la taille du tableau d'octets (inconnu jusqu'a présent due à son type de taille dynamique)
        // et on store la valeure dans une nouvelle variable locale length de type unsigned integer et de taille 256 bits
        // // soit un nombre positif d'une valeure entre 0 et 1.157920892373162e+77 (2**bytes - 1)
        uint256 length = data.length;

        // solhint-disable-next-line no-inline-assembly
        assembly {
            // on ouvre ici un block assembly afin pouvoir utiliser le language de programmation assembly

            // Set result to free memory pointer
            // mload(0x40) renvoie la valeur sauvegarder dans la stack à l'address 0x40, soit un pointer de mémoire vierge en solidity
            result := mload(0x40)
            // Increase free memory pointer by lenght + 32
            // todo
            mstore(0x40, add(add(result, length), 32))
            // Set result length
            // sauvegarde en mémoire sur la stack result et length, result étant alors l'emplacement de départ et length la data inscrite à l'emplacement
            mstore(result, length)
        }

        // Iterate over the data stepping by 32 bytes
        for (uint256 i = 0; i < length; i += 32) {
            // Generate hash of the key and offset
            // todo https://ethereum.stackexchange.com/questions/82595/how-to-keccak-256-hash-in-front-end-javascript-before-passing-it-to-my-smart-con
            bytes32 hash = keccak256(abi.encodePacked(key, i));

            // on crée une nouvelle variable locale chunk, un tableaux d'octets à taille fixe de 32 bits
            bytes32 chunk;
            // solhint-disable-next-line no-inline-assembly
            assembly {
                // Read 32-bytes data chunk
                // todo
                chunk := mload(add(data, add(i, 32)))
            }
            // XOR the chunk with hash
            // todo https://blog.katastros.com/a?ID=01500-a8d6ff99-3efd-4d5c-b155-80e66b6c4ff2
            chunk ^= hash;
            // solhint-disable-next-line no-inline-assembly
            assembly {
                // Write 32-byte encrypted chunk
                // todo
                mstore(add(result, add(i, 32)), chunk)
            }
        }
    }
}
