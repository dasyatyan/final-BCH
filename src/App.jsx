import { useState } from 'react';
import { HashRouter as Router, Switch, Route } from 'react-router-dom';
import { ConnectionProvider, WalletProvider } from '@solana/wallet-adapter-react';
import { WalletModalProvider } from '@solana/wallet-adapter-react-ui';
import { clusterApiUrl } from '@solana/web3.js';
import Modal from 'react-modal';
import { wallets } from './config/web3';
import Home from './pages/home';
import CreatePoll from './pages/createPoll';
import StrawSoll from './pages/strawsoll';

const customStyle = {
  overlay: {
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  content: {
    display: 'flex',
    flexDirection: 'column',
    padding: '20px 70px',
    gap: '20px',
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'white',
    width: 'min(600px, 80%)',
    height: '600px',
    margin: 'auto'
  }
};

function App() {
  const [open, setOpen] = useState(false);

  return (
    <ConnectionProvider endpoint={clusterApiUrl('devnet')}>
      <WalletProvider wallets={wallets} autoConnect>
        <WalletModalProvider>
          <Router>
            <div className="fixed-appbar">
              <div className="w-20" />
              <a href="/" className="text-5xl text-gray-700 p-4 rounded bg-blue-10 font-bold">StrawSoll</a>
              <span
                className="text-grey w-20 font-semibold text-lg underline cursor-pointer"
                onClick={() => setOpen(true)}
              >Tutorial?</span> 
            </div>
            <Modal style={customStyle} isOpen={open} onRequestClose={() => setOpen(false)}>
              <h1 className="text-[2.75rem] text-blue-800 font-bold text-center">How to use Strawsoll?</h1>
              <p className="text-lg text-justify">
                First of all, you'll have to install a solana wallet in your browser, like 
                <a
                  href="https://phantom.app"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-indigo-500"
                >
                  {' '} Phantom. {' '}
                </a>
              </p>
              <p className="text-lg text-justify">
                After that, you need to have funds in your wallet. Since this app is using the Solana Devnet, you need to select Devnet in your wallet settings, then you can use the
                <a
                  href="https://solfaucet.com"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-indigo-500"
                >
                  {' '} Solfaucet {' '}
                </a>
                to provide $SOL tokens to your wallet's Public Key so you can interact with the blockchain. 
              </p>
              <p className="text-lg text-justify">
                Now that you have a fund-loaded wallet, connect it with our app, then you can create your poll or join a created poll by it's code.
              </p>
            </Modal>

            <Switch>
              <Route exact path="/">
                <Home />
              </Route>
              <Route exact path="/create">
                <CreatePoll />
              </Route>
              <Route exact path="/soll/:strawsollId">
                <StrawSoll />
              </Route>
            </Switch>
          </Router>
        </WalletModalProvider>
      </WalletProvider>
    </ConnectionProvider>
  );
}

export default App;
