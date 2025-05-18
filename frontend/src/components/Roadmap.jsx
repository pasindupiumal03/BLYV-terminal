import { useNavigate } from 'react-router-dom';
import { 
  RocketLaunchIcon, 
  StarIcon, 
  BellIcon, 
  CodeBracketIcon, 
  UserGroupIcon,
  ArrowRightIcon,
  CheckCircleIcon,
  CircleStackIcon
} from '@heroicons/react/24/solid';


function Roadmap() {
  const navigate = useNavigate();
  
  return (
    <div className="min-h-screen bg-white text-gray-900 flex flex-col items-center font-mono relative overflow-hidden">
      <div className="max-w-6xl w-full px-4 py-12 relative z-10">
        {/* Header */}
        <div className="text-center mb-16">
          <h1 className="text-5xl font-bold mb-6 flex justify-center items-center gap-2">
            <span className="text-green-500">BLYV</span> Roadmap
          </h1>
          <p className="text-lg max-w-3xl mx-auto text-gray-700 mb-8">
            Explore what's next for BLYV Terminal. We're building 
            in public, shipping new features every week, and 
            listening to your feedback as we grow.
          </p>
          
          <div className="mt-4 flex justify-center gap-4">
            <button 
              onClick={() => navigate('/terminal')}
              className="bg-green-500 text-white px-6 py-2 rounded-lg flex items-center gap-2 hover:bg-green-600 transition-colors"
            >
              Open Terminal <ArrowRightIcon className="w-4 h-4" />
            </button>
            <button
              className="border border-gray-300 px-6 py-2 rounded-lg flex items-center gap-2 hover:bg-gray-100 transition-colors"
              onClick={() => window.open('https://blyv.gitbook.io/blyv', '_blank')}
            >
              View Docs
            </button>
          </div>
        </div>
        
        {/* Timeline */}
        <div className="relative mb-16">
          <div className="h-1 w-full bg-gray-200 absolute top-7"></div>
          <div className="flex justify-between relative">
            <TimelineNode week={1} icon={<CheckCircleIcon className="w-6 h-6 text-white" />} completed={true} />
            <TimelineNode week={2} icon="2" completed={false} progress={10} />
            <TimelineNode week={4} icon="4" completed={false} />
            <TimelineNode week={6} icon="6" completed={false} />
            <TimelineNode week={8} icon="8" completed={false} />
            <TimelineNode week={12} icon="12" completed={false} />
          </div>
        </div>
        
        {/* Week Boxes */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          <WeekBox 
            week={1} 
            icon={<RocketLaunchIcon className="w-6 h-6" />} 
            status="Completed" 
            progress={100}
            items={[
              'Token launch ($BLYV)',
              'Terminal + website go live',
              'Token analytics: price, volume, holders, liquidity, etc.',
              'Basic price prediction model using probability across key metrics'
            ]}
          />
          
          <WeekBox 
            week={2} 
            icon={<StarIcon className="w-6 h-6" />} 
            status="In Progress" 
            progress={10}
            items={[
              'Custom token watchlist (save & pin tokens)',
              'Tiered access: holders unlock advanced analytics',
              'Whitepaper Lite: overview of goals and upcoming feature roadmap'
            ]}
          />
          
          <WeekBox 
            week={4} 
            icon={<CircleStackIcon className="w-6 h-6" />} 
            status="Upcoming"
            items={[
              '$BLYV staking (single-sided)',
              'Custom alert builder (on-chain events, LP changes, whale moves)',
              'Wallet portfolio analytics',
              'Advanced dashboards with custom widgets and layouts'
            ]}
          />
          
          <WeekBox 
            week={6} 
            icon={<BellIcon className="w-6 h-6" />} 
            status="Upcoming"
            items={[
              'Telegram bot alerts (price moves, rug warnings, whale activity)',
              'API access for power users and developers',
              'DAO-lite: community voting on features using $BLYV'
            ]}
          />
          
          <WeekBox 
            week={8} 
            icon={<CodeBracketIcon className="w-6 h-6" />} 
            status="Upcoming"
            items={[
              'Cross-chain support for most-demanded ecosystem',
              'Launchpad for internally vetted/audited tokens',
              'WEB3 SDK: integrate analytics into external dApps'
            ]}
          />
          
          <WeekBox 
            week={12} 
            icon={<UserGroupIcon className="w-6 h-6" />} 
            status="Upcoming"
            items={[
              'Social + on-chain data merge (Twitter/Telegram signals in analytics)',
              'Custom signal builder (e.g., "+50% in 4h + whale entry")',
              'Pro dashboard profiles (share or fork setups across users)'
            ]}
          />
        </div>
      </div>
    </div>
  );
}

function TimelineNode({ week, icon, completed, progress = 0 }) {
  let bgColor = "bg-gray-300";
  let textColor = "text-gray-500";
  
  if (completed) {
    bgColor = "bg-green-500";
    textColor = "text-green-500";
  } else if (progress > 0) {
    bgColor = "bg-blue-500";
    textColor = "text-blue-500";
  }
  
  return (
    <div className="flex flex-col items-center">
      <div className={`w-14 h-14 rounded-full ${bgColor} flex items-center justify-center z-10`}>
        {typeof icon === 'string' ? (
          <span className="text-white font-semibold">{icon}</span>
        ) : icon}
      </div>
      <div className={`mt-2 ${textColor} font-medium`}>
        Week {week}
      </div>
      <div className={`text-sm ${textColor}`}>
        {progress}%
      </div>
    </div>
  );
}

function WeekBox({ week, icon, items, status, progress = 0 }) {
  let borderColor = "border-gray-200";
  let progressBarColor = "bg-gray-300";
  let statusBgColor = "bg-gray-200 text-gray-700";
  
  if (status === "Completed") {
    borderColor = "border-green-500";
    progressBarColor = "bg-green-500";
    statusBgColor = "bg-green-600 text-white";
  } else if (status === "In Progress") {
    borderColor = "border-blue-500";
    progressBarColor = "bg-blue-500";
    statusBgColor = "bg-blue-600 text-white";
  }
  
  return (
    <div className={`border-2 ${borderColor} rounded-xl p-5 bg-white`}>
      <div className="flex items-center gap-2 mb-3 text-gray-800">
        <div className="text-green-500">
          {icon}
        </div>
        <h3 className="text-xl font-semibold">Week {week}</h3>
      </div>
      
      <div className="h-2 w-full bg-gray-100 rounded-full mb-4">
        <div 
          className={`h-full ${progressBarColor} rounded-full`} 
          style={{ width: `${progress}%` }}
        ></div>
      </div>
      
      <ul className="space-y-3 mb-6">
        {items.map((item, index) => (
          <li key={index} className="flex items-start gap-2">
            <div className="min-w-1.5 h-1.5 rounded-full bg-green-500 mt-2"></div>
            <span className="text-sm text-gray-700">{item}</span>
          </li>
        ))}
      </ul>
      
      <div className="flex justify-end">
        <span className={`px-4 py-1 rounded-full text-xs font-medium ${statusBgColor}`}>
          {status}
        </span>
      </div>
    </div>
  );
}

export default Roadmap;