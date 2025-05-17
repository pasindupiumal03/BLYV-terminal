import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  RocketLaunchIcon, 
  InformationCircleIcon,
  PaperAirplaneIcon
} from '@heroicons/react/24/solid';
import TokenDashboard from './TokenDashBoard';

function BLVYTerminal() {


  return (
    <span className="flex items-center gap-1">
      <span className="text-green-500">BLYV</span>
      <span>Terminal</span>
    </span>
  );
}

function Terminal() {
  const navigate = useNavigate();
  const [input, setInput] = useState('');
  const [tokenData, setTokenData] = useState({});
  const [chartData, setChartData] = useState([]);
  const [success, setSuccess] = useState(false);
  const [solanaPrice, setSolanaPrice] = useState("");
  const [loading, setLoading] = useState(false);


  useEffect(() => {
    const fetchSolanaPrice = async () => {
      try {
        const response = await fetch(
          "https://api.coingecko.com/api/v3/simple/price?ids=solana&vs_currencies=usd"
        );
        const data = await response.json();
        setSolanaPrice(data.solana.usd);
      } catch (error) {
        console.error("Failed to fetch Solana price:", error);
      }
    };

    fetchSolanaPrice();
  }, []);
  
  const [messages, setMessages] = useState([
    {
      id: 1,
      content: 'Welcome to BLYV Terminal!\nSearch Solana tokens, view live trades, analyze charts, and get AI-powered price predictions. Use commands like search, token, trades, predict, and more. All data is live from BLYV and Solana. Try searching for a token or ask for a price prediction!',
      type: "system",
    }
  ]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!input.trim()) return;
  
    setMessages(prev => [
      ...prev,
      {
        id: Date.now(),
        type: 'user',
        content: input
      }
    ]);
    setLoading(true); // Start loading
  
    try {
      const res = await fetch('http://localhost:4000/api/solana-token-info', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ address: input.trim() })
      });
      const data = await res.json();
      if (data.found) {
        setSuccess(true);
        setTokenData(data.token);
        setChartData(data.chart);
        setMessages(prev => [
          ...prev,
          {
            id: Date.now(),
            type: 'system',
            content: data.message,
            token: data.token,
            chart: data.chart
          }
        ]);
      } else {
        setMessages(prev => [
          ...prev,
          {
            id: Date.now(),
            type: 'system',
            content: data.message
          }
        ]);
      }
    } catch (err) {
      setMessages(prev => [
        ...prev,
        {
          id: Date.now(),
          type: 'system',
          content: 'There was an error contacting the backend. Please try again.'
        }
      ]);
    }
  
    setInput('');
    setLoading(false); 
  };
  


  // Handlers for button clicks to open new tabs
  const handleRocketClick = () => {
    window.open('/', '_blank');
  };

  const handleXClick = () => {
    window.open('https://x.com/theblyvterminal', '_blank');
  };

  const handleBLYVClick = () => {
    window.open('https://www.solanatracker.io/tokens', '_blank');
  };

  return (
    <>
    <div className="font-mono minimum-height-screen bg-white flex flex-col items-center justify-center p-4">
      {/* Main terminal container */}
      <div className="w-full max-w-6xl border border-gray-300 rounded-md flex flex-col overflow-hidden">
        {/* Header */}
        <div className="flex justify-between items-center px-4 py-2 border-b border-gray-300 bg-gray-100">
          <div className="flex items-center">
            <span className="text-green-500 font-medium">SOL: {solanaPrice}</span>
          </div>
          
          <div className="text-center text-gray-700 font-bold">
            <BLVYTerminal/>
          </div>
          
          <div className="flex items-center gap-3">
            <button 
              onClick={handleRocketClick}
              className="text-green-500 hover:text-green-600"
              aria-label="Open roadmap in new tab"
            >
              <RocketLaunchIcon className="w-5 h-5" />
            </button>
            <button 
              onClick={handleXClick}
              className="text-green-500 hover:text-green-600"
              aria-label="Open Twitter in new tab"
            >
              <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="currentColor" className="w-5 h-5">
                <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"/>
              </svg>
            </button>
            <button 
              onClick={handleBLYVClick}
              className="bg-green-500 hover:bg-green-600 text-white text-xs px-3 py-1 rounded"
              aria-label="Open tokens page in new tab"
            >
              $BLYV
            </button>
          </div>
        </div>
        
        {/* Terminal content */}
        <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-white">
          {messages.map((msg) => (
            <div key={msg.id} className="flex">
              <div className={`mr-2 ${msg.type === 'system' ? "text-green-500" : "text-gray-800"}`}>
                {msg.type === 'user' ? 'USER>' : 'SYSTEM>'}
              </div>
              <div className={`whitespace-pre-wrap text-sm ${msg.type === "system" ? 'text-green-400' : 'text-gray-800'}`}>{msg.content}</div>
            </div>
          ))}
        </div>
        {success && <TokenDashboard tokenData={tokenData} chartData={chartData}/>}

        {/* {success &&
          <div style={{ width: '100%', height: '600px' }}>
          <iframe
            src={`https://dexscreener.com/solana/${tokenData.address}?embed=1&loadChartSettings=0&trades=0&tabs=0&info=0&chartLeftToolbar=0&chartTheme=light&theme=light&chartStyle=0&chartType=usd&interval=15`}
            width="100%"
            height="100%"
            style={{ border: 'none' }}
            allowFullScreen
            title="Dexscreener Chart"
          ></iframe>
        </div>} */}

        {/* Input */}
        <form onSubmit={handleSubmit} className="border-t border-gray-300 p-2 flex bg-white">
          <div className="text-green-500 mr-2">{">"}</div>
          <input 
            type="text" 
            value={input}
            onChange={(e) => setInput(e.target.value)}
            className="flex-1 bg-transparent border-none outline-none text-gray-800"
            placeholder="Enter command..."
          />
          <button 
            type="submit"
            className="text-green-500 hover:text-green-600"
          >
            <PaperAirplaneIcon className="w-5 h-5" />
          </button>
        </form>
      </div>
      {loading && (
          <div className="m-auto">
            <div className="animate-spin rounded-full h-10 w-10 border-t-4 border-b-4 border-green-500"></div>
          </div>
        )}
      {/* {success && <TokenDashboard tokenData={tokenData} chartData={chartData}/>} */}
    </div>
    </>
  );
}

export default Terminal;