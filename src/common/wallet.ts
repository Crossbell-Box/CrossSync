import Web3Modal from 'web3modal';
import WalletConnectProvider from '@walletconnect/web3-provider';

const providerOptions = {
    walletconnect: {
        package: WalletConnectProvider,
        options: {
            rpc: {
                1: 'https://cloudflare-eth.com',
                3737: 'https://rpc.crossbell.io',
            },
            bridge: 'https://wcrv2.rss3.dev',
        },
    },
};

const web3Modal = new Web3Modal({
    network: 'mainnet', // optional
    cacheProvider: true, // optional
    providerOptions, // required
});

export async function connect() {
    return await web3Modal.connect();
}
