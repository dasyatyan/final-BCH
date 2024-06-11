import { useState } from 'react';
import { useWallet } from '@solana/wallet-adapter-react';
import { Program, web3 } from '@project-serum/anchor';
import { programId, getProvider } from '../config/web3';
import { Redirect, useHistory } from 'react-router-dom';
import idl from '../idl.json';
import Spinner from '../components/spinner';



const { Keypair } = web3;

function CreatePoll() {
  const [pollKey, setPollKey] = useState('');
  const [options, setOptions] = useState(['', '']);
  const [showError, setShowError] = useState(false);
  const [loading, setLoading] = useState(false);
  const [created, setCreated] = useState(false);
  const [copied, setCopied] = useState(false);
  const wallet = useWallet();
  const history = useHistory();

  async function initialize(options) {
    const provider = await getProvider(wallet);
    const program = new Program(idl, programId, provider);

    const newPollKeypair = Keypair.generate();
    setPollKey(newPollKeypair.publicKey.toString());

    try {
      await program.methods
        .initialize(options.filter(option => !!option))
        .accounts({
          owner: provider.wallet.publicKey,
          poll: newPollKeypair.publicKey,
        })
        .signers([newPollKeypair])
        .rpc();

      setLoading(false);
      setCreated(true);
    } catch (error) {
      setLoading(false);
    }
  }

  const handleChange = (e, idx) => {
    setShowError(false);
    setOptions(old => {
      old[idx] = e.target.value;
      return [...old];
    });
  }

  const handleAddOption = () => {
    setOptions([...options, '']);
  }

  const handleRemoveOption = (idx) => {
    setOptions(options.filter((_, index) => index !== idx));
  }

  if (!wallet.connected && !wallet.connecting) {
    return (
      <Redirect to="/" />
    );
  }

  if (created) {
    return (
      <div className="flex flex-col gap-10 justify-center items-center w-full h-full">
        <div className="flex flex-col gap-4">
          <h1 className="text-4xl text-gray-900 font-bold text-center">
            🎉 Your poll was created! 🎉
          </h1>
          <p className="text-lg text-black font-semibold">
            Click in the code below to copy it, then send it to whoever you want!
          </p>
        </div>
        <div className="flex flex-col gap-4 items-center">
          <button
            className="bg-white px-4 py-2 rounded-lg text-blue-500 font-semibold text-lg"
            onClick={() => {
              navigator.clipboard.writeText(`${pollKey}`);
              setCopied(true);
            }}
          >
            {pollKey}
          </button>
          {
            copied && 
            <span className="text-green-700 font-bold">Copied to clipboard!</span>
          }
          <button
            className="bg-blue-500 px-4 py-2 rounded-lg text-white font-semibold text-lg"
            onClick={() => {
              history.push(`/soll/${pollKey}`)
            }}
          >
            Join Poll
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col items-center justify-center gap-4 w-full h-full">
      <div className="mb-10 flex flex-col gap-3">
        <h1 className="text-5xl text-blach text-gray-900 font-bold text-center">Time to create your poll!</h1>
        <p className="text-lg text-center text-slate-100 font-bold">
          Input at least 2 options to start your poll!
        </p>
      </div>
      <div className="flex flex-wrap gap-4 justify-center">
        {options.map((option, idx) => (
          <div key={idx} className="relative">
            <input
              type="text"
              className="bg-white w-[400px] text-lg p-4 rounded-xl outline-none border-2 border-blue-500"
              placeholder={`Option ${idx + 1}`}
              value={option}
              onChange={e => handleChange(e, idx)}
            />
            {idx >= 2 && (
              <button
                className="absolute top-1/2 right-[-1.5rem] transform -translate-y-1/2 bg-red-500 text-white px-2 py-1 rounded-full"
                onClick={() => handleRemoveOption(idx)}
              >
                X
              </button>
            )}
          </div>
        ))}
        <button
          className="bg-white mt-4 px-6 py-3 rounded-xl text-blue-500 font-semibold text-lg border border-blue-500"
          onClick={handleAddOption}
        >
          Add Option
        </button>
        {showError && (
          <span className="text-red-500 text-lg font-semibold">
            The poll must have at least 2 options
          </span>
        )}
      </div>
      <button
        className="bg-white mt-4 px-6 py-3 rounded-xl text-blue-500 font-semibold text-lg border border-blue-500"
        onClick={() => {
          if (options.filter(option => !!option).length < 2) {
            setShowError(true);
            return;
          }
          setLoading(true);
          initialize(options);
        }}
      >
        Create
      </button>
      {loading && <Spinner />}
    </div>
  );
}

export default CreatePoll;
