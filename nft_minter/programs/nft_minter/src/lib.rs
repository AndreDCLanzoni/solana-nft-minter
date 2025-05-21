use anchor_lang::prelude::*;

declare_id!("5fGkL4pt8GbmLVzYsZ8PNFY7Xact8H7Wxv5vfRTuSkB1");


#[program]
pub mod nft_minter {
    use super::*;

    pub fn initialize_collection(
        ctx: Context<InitializeCollection>,
        name: String,
        symbol: String,
    ) -> Result<()> {
        let collection = &mut ctx.accounts.collection;
        collection.authority = *ctx.accounts.authority.key;
        collection.name = name;
        collection.symbol = symbol;
        Ok(())
    }
}

#[account]
pub struct Collection {
    pub authority: Pubkey,
    pub name: String,
    pub symbol: String,
}

#[derive(Accounts)]
pub struct InitializeCollection<'info> {
    #[account(init, payer = authority, space = 8 + 32 + (4 + 32) + (4 + 10))]
    pub collection: Account<'info, Collection>,
    #[account(mut)]
    pub authority: Signer<'info>,
    pub system_program: Program<'info, System>,
}
