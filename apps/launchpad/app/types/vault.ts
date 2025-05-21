export type MultivaultConfig = {
  atom_cost: string
  formatted_atom_cost: string
  triple_cost: string
  formatted_triple_cost: string
  atom_wallet_initial_deposit_amount: string
  formatted_atom_wallet_initial_deposit_amount: string
  atom_creation_protocol_fee: string
  formatted_atom_creation_protocol_fee: string
  triple_creation_protocol_fee: string
  formatted_triple_creation_protocol_fee: string
  atom_deposit_fraction_on_triple_creation: string
  formatted_atom_deposit_fraction_on_triple_creation: string
  atom_deposit_fraction_for_triple: string
  formatted_atom_deposit_fraction_for_triple: string
  entry_fee: string
  formatted_entry_fee: string
  exit_fee: string
  formatted_exit_fee: string
  protocol_fee: string
  formatted_protocol_fee: string
  fee_denominator: string
  formatted_fee_denominator: string
  min_deposit: string
  formatted_min_deposit: string
}

export type IdentityVaultDetailsType = {
  vault_id: string
  assets_sum: string
  formatted_assets_sum: string
  conviction_sum: string
  formatted_conviction_sum: string
  conviction_price: string
  formatted_conviction_price: string
  entry_fee: string
  formatted_entry_fee: string
  exit_fee: string
  formatted_exit_fee: string
  protocol_fee: string
  formatted_protocol_fee: string
  admin: string
  protocol_vault: string
  fee_denominator: string
  formatted_fee_denominator: string
  min_deposit: string
  formatted_min_deposit: string
  min_share: string
  formatted_min_share: string
  atom_cost: string
  formatted_atom_cost: string
  atom_creation_fee: string
  formatted_atom_creation_fee: string
  user_conviction?: string
  formatted_user_conviction?: string
  user_assets?: string
  formatted_user_assets?: string
}

export type VaultDetailsType = {
  assets_sum: string
  formatted_assets_sum: string
  conviction_sum: string
  formatted_conviction_sum: string
  conviction_price: string
  formatted_conviction_price: string
  user_conviction?: string
  formatted_user_conviction?: string
  user_assets?: string
  formatted_user_assets?: string
  against_assets_sum?: string
  formatted_against_assets_sum?: string
  against_conviction_sum?: string
  formatted_against_conviction_sum?: string
  against_conviction_price?: string
  formatted_against_conviction_price?: string
  user_conviction_against?: string
  formatted_user_conviction_against?: string
  user_assets_against?: string
  formatted_user_assets_against?: string
  entry_fee: string
  formatted_entry_fee: string
  exit_fee: string
  formatted_exit_fee: string
  protocol_fee: string
  formatted_protocol_fee: string
  admin: string
  protocol_vault: string
  fee_denominator: string
  min_deposit: string
  formatted_min_deposit: string
  min_share: string
  formatted_min_share: string
  atom_cost?: string
  formatted_atom_cost?: string
  triple_cost?: string
  formatted_triple_cost?: string
  atom_creation_fee?: string
  formatted_atom_creation_fee?: string
  isTriple?: boolean
  triple_creation_fee?: string
  formatted_triple_creation_fee?: string
  atom_deposit_fraction_on_triple_creation?: string
  formatted_atom_deposit_fraction_on_triple_creation?: string
  atom_deposit_fraction_for_triple?: string
  formatted_atom_deposit_fraction_for_triple?: string
}

export type VaultType = {
  __typename?: 'vaults'
  total_shares: string | number
  current_share_price: string | number
  min_deposit?: string | number
  position_count?: number
  allPositions?: {
    aggregate?: {
      count: number
      sum?: {
        shares: string | number
      }
    }
  }
}
