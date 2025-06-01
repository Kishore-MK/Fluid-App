export const FluidABI= [
    {
        "type": "impl",
        "name": "FluidNameServiceImpl",
        "interface_name": "contracts::NameRegistrar::IFluidNameService"
    },
    {
        "type": "struct",
        "name": "core::byte_array::ByteArray",
        "members": [
            {
                "name": "data",
                "type": "core::array::Array::<core::bytes_31::bytes31>"
            },
            {
                "name": "pending_word",
                "type": "core::felt252"
            },
            {
                "name": "pending_word_len",
                "type": "core::integer::u32"
            }
        ]
    },
    {
        "type": "enum",
        "name": "core::bool",
        "variants": [
            {
                "name": "False",
                "type": "()"
            },
            {
                "name": "True",
                "type": "()"
            }
        ]
    },
    {
        "type": "enum",
        "name": "contracts::NameRegistrar::SupportedChain",
        "variants": [
            {
                "name": "Starknet",
                "type": "()"
            },
            {
                "name": "Ethereum",
                "type": "()"
            }
        ]
    },
    {
        "type": "struct",
        "name": "contracts::NameRegistrar::DomainRecord",
        "members": [
            {
                "name": "name",
                "type": "core::byte_array::ByteArray"
            },
            {
                "name": "owner",
                "type": "core::starknet::contract_address::ContractAddress"
            },
            {
                "name": "registered_at",
                "type": "core::integer::u64"
            },
            {
                "name": "expires_at",
                "type": "core::integer::u64"
            },
            {
                "name": "default_chain",
                "type": "contracts::NameRegistrar::SupportedChain"
            },
            {
                "name": "starknet_address",
                "type": "core::starknet::contract_address::ContractAddress"
            },
            {
                "name": "ethereum_address",
                "type": "core::starknet::contract_address::ContractAddress"
            }
        ]
    },
    {
        "type": "struct",
        "name": "core::integer::u256",
        "members": [
            {
                "name": "low",
                "type": "core::integer::u128"
            },
            {
                "name": "high",
                "type": "core::integer::u128"
            }
        ]
    },
    {
        "type": "interface",
        "name": "contracts::NameRegistrar::IFluidNameService",
        "items": [
            {
                "type": "function",
                "name": "register_domain",
                "inputs": [
                    {
                        "name": "name",
                        "type": "core::byte_array::ByteArray"
                    },
                    {
                        "name": "duration_years",
                        "type": "core::integer::u8"
                    }
                ],
                "outputs": [
                    {
                        "type": "core::bool"
                    }
                ],
                "state_mutability": "external"
            },
            {
                "type": "function",
                "name": "is_available",
                "inputs": [
                    {
                        "name": "name",
                        "type": "core::byte_array::ByteArray"
                    }
                ],
                "outputs": [
                    {
                        "type": "core::bool"
                    }
                ],
                "state_mutability": "view"
            },
            {
                "type": "function",
                "name": "set_address",
                "inputs": [
                    {
                        "name": "name",
                        "type": "core::byte_array::ByteArray"
                    },
                    {
                        "name": "chain",
                        "type": "contracts::NameRegistrar::SupportedChain"
                    },
                    {
                        "name": "address",
                        "type": "core::starknet::contract_address::ContractAddress"
                    }
                ],
                "outputs": [],
                "state_mutability": "external"
            },
            {
                "type": "function",
                "name": "set_default_chain",
                "inputs": [
                    {
                        "name": "name",
                        "type": "core::byte_array::ByteArray"
                    },
                    {
                        "name": "chain",
                        "type": "contracts::NameRegistrar::SupportedChain"
                    }
                ],
                "outputs": [],
                "state_mutability": "external"
            },
            {
                "type": "function",
                "name": "set_addresses",
                "inputs": [
                    {
                        "name": "name",
                        "type": "core::byte_array::ByteArray"
                    },
                    {
                        "name": "starknet_address",
                        "type": "core::starknet::contract_address::ContractAddress"
                    },
                    {
                        "name": "ethereum_address",
                        "type": "core::starknet::contract_address::ContractAddress"
                    }
                ],
                "outputs": [],
                "state_mutability": "external"
            },
            {
                "type": "function",
                "name": "resolve",
                "inputs": [
                    {
                        "name": "name",
                        "type": "core::byte_array::ByteArray"
                    }
                ],
                "outputs": [
                    {
                        "type": "core::starknet::contract_address::ContractAddress"
                    }
                ],
                "state_mutability": "view"
            },
            {
                "type": "function",
                "name": "resolve_chain",
                "inputs": [
                    {
                        "name": "name",
                        "type": "core::byte_array::ByteArray"
                    },
                    {
                        "name": "chain",
                        "type": "contracts::NameRegistrar::SupportedChain"
                    }
                ],
                "outputs": [
                    {
                        "type": "core::starknet::contract_address::ContractAddress"
                    }
                ],
                "state_mutability": "view"
            },
            {
                "type": "function",
                "name": "reverse_lookup",
                "inputs": [
                    {
                        "name": "address",
                        "type": "core::starknet::contract_address::ContractAddress"
                    },
                    {
                        "name": "chain",
                        "type": "contracts::NameRegistrar::SupportedChain"
                    }
                ],
                "outputs": [
                    {
                        "type": "core::byte_array::ByteArray"
                    }
                ],
                "state_mutability": "view"
            },
            {
                "type": "function",
                "name": "get_domain_info",
                "inputs": [
                    {
                        "name": "name",
                        "type": "core::byte_array::ByteArray"
                    }
                ],
                "outputs": [
                    {
                        "type": "contracts::NameRegistrar::DomainRecord"
                    }
                ],
                "state_mutability": "view"
            },
            {
                "type": "function",
                "name": "get_owner",
                "inputs": [
                    {
                        "name": "name",
                        "type": "core::byte_array::ByteArray"
                    }
                ],
                "outputs": [
                    {
                        "type": "core::starknet::contract_address::ContractAddress"
                    }
                ],
                "state_mutability": "view"
            },
            {
                "type": "function",
                "name": "get_expiry",
                "inputs": [
                    {
                        "name": "name",
                        "type": "core::byte_array::ByteArray"
                    }
                ],
                "outputs": [
                    {
                        "type": "core::integer::u64"
                    }
                ],
                "state_mutability": "view"
            },
            {
                "type": "function",
                "name": "is_active",
                "inputs": [
                    {
                        "name": "name",
                        "type": "core::byte_array::ByteArray"
                    }
                ],
                "outputs": [
                    {
                        "type": "core::bool"
                    }
                ],
                "state_mutability": "view"
            },
            {
                "type": "function",
                "name": "transfer_domain",
                "inputs": [
                    {
                        "name": "name",
                        "type": "core::byte_array::ByteArray"
                    },
                    {
                        "name": "new_owner",
                        "type": "core::starknet::contract_address::ContractAddress"
                    }
                ],
                "outputs": [],
                "state_mutability": "external"
            },
            {
                "type": "function",
                "name": "verify_ownership",
                "inputs": [
                    {
                        "name": "name",
                        "type": "core::byte_array::ByteArray"
                    },
                    {
                        "name": "address",
                        "type": "core::starknet::contract_address::ContractAddress"
                    }
                ],
                "outputs": [
                    {
                        "type": "core::bool"
                    }
                ],
                "state_mutability": "view"
            },
            {
                "type": "function",
                "name": "set_registration_fee",
                "inputs": [
                    {
                        "name": "fee",
                        "type": "core::integer::u256"
                    }
                ],
                "outputs": [],
                "state_mutability": "external"
            },
            {
                "type": "function",
                "name": "get_registration_fee",
                "inputs": [],
                "outputs": [
                    {
                        "type": "core::integer::u256"
                    }
                ],
                "state_mutability": "view"
            },
            {
                "type": "function",
                "name": "set_treasury_address",
                "inputs": [
                    {
                        "name": "treasury",
                        "type": "core::starknet::contract_address::ContractAddress"
                    }
                ],
                "outputs": [],
                "state_mutability": "external"
            },
            {
                "type": "function",
                "name": "get_treasury_address",
                "inputs": [],
                "outputs": [
                    {
                        "type": "core::starknet::contract_address::ContractAddress"
                    }
                ],
                "state_mutability": "view"
            },
            {
                "type": "function",
                "name": "transfer_ownership",
                "inputs": [
                    {
                        "name": "new_owner",
                        "type": "core::starknet::contract_address::ContractAddress"
                    }
                ],
                "outputs": [],
                "state_mutability": "external"
            },
            {
                "type": "function",
                "name": "get_contract_owner",
                "inputs": [],
                "outputs": [
                    {
                        "type": "core::starknet::contract_address::ContractAddress"
                    }
                ],
                "state_mutability": "view"
            },
            {
                "type": "function",
                "name": "get_total_domains",
                "inputs": [],
                "outputs": [
                    {
                        "type": "core::integer::u64"
                    }
                ],
                "state_mutability": "view"
            },
            {
                "type": "function",
                "name": "get_total_fees_collected",
                "inputs": [],
                "outputs": [
                    {
                        "type": "core::integer::u256"
                    }
                ],
                "state_mutability": "view"
            },
            {
                "type": "function",
                "name": "get_strk_token_address",
                "inputs": [],
                "outputs": [
                    {
                        "type": "core::starknet::contract_address::ContractAddress"
                    }
                ],
                "state_mutability": "view"
            }
        ]
    },
    {
        "type": "constructor",
        "name": "constructor",
        "inputs": [
            {
                "name": "initial_owner",
                "type": "core::starknet::contract_address::ContractAddress"
            },
            {
                "name": "initial_fee",
                "type": "core::integer::u256"
            },
            {
                "name": "strk_token_address",
                "type": "core::starknet::contract_address::ContractAddress"
            },
            {
                "name": "treasury_address",
                "type": "core::starknet::contract_address::ContractAddress"
            }
        ]
    },
    {
        "type": "event",
        "name": "contracts::NameRegistrar::FluidNameService::DomainRegistered",
        "kind": "struct",
        "members": [
            {
                "name": "name",
                "type": "core::byte_array::ByteArray",
                "kind": "key"
            },
            {
                "name": "owner",
                "type": "core::starknet::contract_address::ContractAddress",
                "kind": "key"
            },
            {
                "name": "expires_at",
                "type": "core::integer::u64",
                "kind": "data"
            }
        ]
    },
    {
        "type": "event",
        "name": "contracts::NameRegistrar::FluidNameService::AddressSet",
        "kind": "struct",
        "members": [
            {
                "name": "name",
                "type": "core::byte_array::ByteArray",
                "kind": "key"
            },
            {
                "name": "chain",
                "type": "contracts::NameRegistrar::SupportedChain",
                "kind": "data"
            },
            {
                "name": "address",
                "type": "core::starknet::contract_address::ContractAddress",
                "kind": "data"
            }
        ]
    },
    {
        "type": "event",
        "name": "contracts::NameRegistrar::FluidNameService::DefaultChainChanged",
        "kind": "struct",
        "members": [
            {
                "name": "name",
                "type": "core::byte_array::ByteArray",
                "kind": "key"
            },
            {
                "name": "new_default_chain",
                "type": "contracts::NameRegistrar::SupportedChain",
                "kind": "data"
            }
        ]
    },
    {
        "type": "event",
        "name": "contracts::NameRegistrar::FluidNameService::DomainTransferred",
        "kind": "struct",
        "members": [
            {
                "name": "name",
                "type": "core::byte_array::ByteArray",
                "kind": "key"
            },
            {
                "name": "from",
                "type": "core::starknet::contract_address::ContractAddress",
                "kind": "key"
            },
            {
                "name": "to",
                "type": "core::starknet::contract_address::ContractAddress",
                "kind": "key"
            }
        ]
    },
    {
        "type": "event",
        "name": "contracts::NameRegistrar::FluidNameService::OwnershipTransferred",
        "kind": "struct",
        "members": [
            {
                "name": "previous_owner",
                "type": "core::starknet::contract_address::ContractAddress",
                "kind": "key"
            },
            {
                "name": "new_owner",
                "type": "core::starknet::contract_address::ContractAddress",
                "kind": "key"
            }
        ]
    },
    {
        "type": "event",
        "name": "contracts::NameRegistrar::FluidNameService::RegistrationFeeChanged",
        "kind": "struct",
        "members": [
            {
                "name": "old_fee",
                "type": "core::integer::u256",
                "kind": "data"
            },
            {
                "name": "new_fee",
                "type": "core::integer::u256",
                "kind": "data"
            }
        ]
    },
    {
        "type": "event",
        "name": "contracts::NameRegistrar::FluidNameService::Event",
        "kind": "enum",
        "variants": [
            {
                "name": "DomainRegistered",
                "type": "contracts::NameRegistrar::FluidNameService::DomainRegistered",
                "kind": "nested"
            },
            {
                "name": "AddressSet",
                "type": "contracts::NameRegistrar::FluidNameService::AddressSet",
                "kind": "nested"
            },
            {
                "name": "DefaultChainChanged",
                "type": "contracts::NameRegistrar::FluidNameService::DefaultChainChanged",
                "kind": "nested"
            },
            {
                "name": "DomainTransferred",
                "type": "contracts::NameRegistrar::FluidNameService::DomainTransferred",
                "kind": "nested"
            },
            {
                "name": "OwnershipTransferred",
                "type": "contracts::NameRegistrar::FluidNameService::OwnershipTransferred",
                "kind": "nested"
            },
            {
                "name": "RegistrationFeeChanged",
                "type": "contracts::NameRegistrar::FluidNameService::RegistrationFeeChanged",
                "kind": "nested"
            }
        ]
    }
]