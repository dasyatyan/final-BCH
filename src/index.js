import './index.css';
import React from 'react';
import ReactDOM from 'react-dom';
import App from './App';
import { WalletAdapterNetwork } from '@solana/wallet-adapter-base';
import { WalletModalProvider } from '@solana/wallet-adapter-react-ui';
import { ConnectionProvider, WalletProvider } from '@solana/wallet-adapter-react';
import { PhantomWalletAdapter } from '@solana/wallet-adapter-wallets';
import { clusterApiUrl } from '@solana/web3.js';

require('@solana/wallet-adapter-react-ui/styles.css');

const network = WalletAdapterNetwork.Devnet;
const endpoint = clusterApiUrl(network);

const wallets = [
    new PhantomWalletAdapter(),
    // Add more wallets here
];

ReactDOM.render(
    <ConnectionProvider endpoint={endpoint}>
        <WalletProvider wallets={wallets}>
            <WalletModalProvider>
                <App />
            </WalletModalProvider>
        </WalletProvider>
    </ConnectionProvider>,
    document.getElementById('root')
);

