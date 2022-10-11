import createMetaMaskProvider from 'metamask-extension-provider';

let metaMaskProvider: ReturnType<typeof createMetaMaskProvider>;

export async function connect(force = false) {
    let metamask: any;

    if (!window.ethereum) {
        if (!metaMaskProvider) {
            metaMaskProvider = createMetaMaskProvider();
        }
        metamask = metaMaskProvider;
    } else {
        // window.ethereum is metaMaskProvider
        metamask = window.ethereum;
    }

    if (force) {
        await metamask.request({
            method: 'eth_requestAccounts',
        });
        await metamask.request({
            method: 'wallet_requestPermissions',
            params: [
                {
                    eth_accounts: {},
                },
            ],
        });
    }

    return metamask;
}

export async function disconnect() {}
