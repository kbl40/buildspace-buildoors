import { initializeKeypair } from "./initializeKeypair"
import * as web3 from "@solana/web3.js"
import * as token from "@solana/spl-token"
import {
  Metaplex,
  keypairIdentity,
  bundlrStorage,
  toMetaplexFile,
  findMetadataPda
} from '@metaplex-foundation/js'
import {
  DataV2,
  createCreateMetadataAccountV2Instruction,
  createUpdateMetadataAccountV2Instruction
} from '@metaplex-foundation/mpl-token-metadata'
import * as fs from 'fs'

const TOKEN_NAME = "BUILD"
const TOKEN_SYMBOL = "BLDR"
const TOKEN_DESCRIPTION = "A token for buildoors"
const TOKEN_IMAGE_PATH = "tokens/bldr/assets/hammer.png"
const TOKEN_IMAGE_NAME = "hammer.png"

async function createBldrToken(
    connection: web3.Connection,
    payer: web3.Keypair
) {
    const tokenMint = await token.createMint(
        connection,
        payer,
        payer.publicKey,
        payer.publicKey,
        2
    )

    const metaplex = Metaplex.make(connection)
        .use(keypairIdentity(payer))
        .use(bundlrStorage( 
            {
                address: "https://devnet.bundlr.network",
                providerUrl: "https://api.devnet.solana.com",
                timeout: 60000
            }
    ))

    const imageBuffer = fs.readFileSync(TOKEN_IMAGE_PATH)
    const file = toMetaplexFile(imageBuffer, TOKEN_IMAGE_NAME)
    const imageUri = await metaplex.storage().upload(file)

    const { uri } = await metaplex
        .nfts()
        .uploadMetadata({
            name: TOKEN_NAME,
            description: TOKEN_DESCRIPTION,
            image: imageUri
        })
        .run()

    const metadataPda = findMetadataPda(tokenMint)

    const tokenMetadata = {
        name: TOKEN_NAME,
        symbol: TOKEN_SYMBOL,
        uri: uri,
        sellerFeeBasisPoints: 0,
        creators: null,
        collection: null,
        uses: null
    } as DataV2

    const instruction = createCreateMetadataAccountV2Instruction(
        {
            metadata: metadataPda,
            mint: tokenMint,
            mintAuthority: payer.publicKey,
            payer: payer.publicKey,
            updateAuthority: payer.publicKey
        },
        {
            createMetadataAccountArgsV2: {
                data: tokenMetadata,
                isMutable: true
            }
        }
    )

    const transaction = new web3.Transaction()
    transaction.add(instruction)

    const txSig = await web3.sendAndConfirmTransaction(connection, transaction, [payer])

    fs.writeFileSync(
        "tokens/bldr/cache.json",
        JSON.stringify({
            mint: tokenMint.toBase58(),
            imageUri: imageUri,
            metadataUri: uri,
            tokenMetadata: metadataPda.toBase58(),
            metadataTransaction: txSig,
        })
    )
}

async function main() {
  const connection = new web3.Connection(web3.clusterApiUrl("devnet"))
  const user = await initializeKeypair(connection)

  console.log("PublicKey:", user.publicKey.toBase58())

  await createBldrToken(connection, user)

  
}

main()
  .then(() => {
    console.log("Finished successfully")
    process.exit(0)
  })
  .catch((error) => {
    console.log(error)
    process.exit(1)
  })
