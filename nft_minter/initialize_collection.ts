import * as anchor from "@coral-xyz/anchor";
import { Program } from "@coral-xyz/anchor";
import { NftMinter } from "../target/types/nft_minter";
import * as assert from "assert";

describe("initialize_collection", () => {
  // Configure the client to use the local cluster.
  const provider = anchor.AnchorProvider.env();
  anchor.setProvider(provider);
  const program = anchor.workspace.NftMinter as Program<NftMinter>;

  it("initializes a collection account correctly", async () => {
    // Generate a new keypair for the collection account.
    const collectionKeypair = anchor.web3.Keypair.generate();

    // Send the transaction.
    const tx = await program.rpc.initializeCollection(
      "My Collection",
      "MYC",
      {
        accounts: {
          collection: collectionKeypair.publicKey,
          authority: provider.wallet.publicKey,
          systemProgram: anchor.web3.SystemProgram.programId,
        },
        signers: [collectionKeypair],
      }
    );
    console.log("Transaction signature", tx);

    // Fetch the on-chain account.
    const account = await program.account.collection.fetch(
      collectionKeypair.publicKey
    );

    // Asserts
    assert.ok(
      account.authority.equals(provider.wallet.publicKey),
      "Authority mismatch"
    );
    assert.equal(account.name, "My Collection");
    assert.equal(account.symbol, "MYC");
  });
});

