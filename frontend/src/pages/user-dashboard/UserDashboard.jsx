

import { BiEdit, BiBell, BiSearch, BiVideo,BiMusic,BiBook, BiHistory } from "react-icons/bi";
import { PieChart, Pie, Cell, Tooltip, Legend } from "recharts";
import Greetings from "../../components/greeting";
import Search from "../../components/search";
import Tab from "../../components/Tab";
import { useState } from "react";
import { useEffect } from "react";
import axios from "axios";
const UserDashboard = () => {
  const [showSearch, setShowSearch] = useState(false);
  const [activeTab, setActiveTab] = useState(1);
  const [assets, setAssets] = useState([]);
  const userInfo = getUserInfo()[0]; 

  useEffect(() => {
    const fetchAssets = async () => {
      try {
        const response = await axios.get("/api/files");
        setAssets(response.data);
      } catch (error) {
        console.error("Error fetching assets", error);
      }
    };
    fetchAssets();
  }, []);

  const toggleSearch = () => setShowSearch(!showSearch);

  const handleTabChange = (tabIndex) => setActiveTab(tabIndex);

  const renderContentByType = (type) => {
    const contentTypeMap = {
      Ebook: ['application/pdf', 'text/plain'], // Add more ebook MIME types if needed
      Video: ['video/mp4', 'video/quicktime'], // Add more video MIME types if needed
      Music: ['audio/mpeg', 'audio/wav'] // Add more music MIME types if needed
    };
    const allowedTypes = contentTypeMap[type];
    const content = assets.filter(asset => allowedTypes.some(allowedType => asset.contentType.includes(allowedType)));
    if (content.length === 0) {
      return <div className="justify-center">You don't have any {type} yet!</div>;
    }
    return (
      <div>
        <h1 className="text-2xl font-bold mb-4">{type}</h1>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {content.map((item) => (
            <div key={item._id} className="bg-gray-100 p-4 rounded-md border border-gray-300">
              <h2 className="text-lg font-bold">{item.filename}</h2>
              <p className="text-gray-600">{item.fileDescription}</p>
            </div>
          ))}
        </div>
      </div>
    );
  };

  const renderUsageHistory = () => {
    const ebookCount = assets.filter(asset => ['application/pdf', 'text/plain'].some(allowedType => asset.contentType.includes(allowedType))).length;
    const videoCount = assets.filter(asset => ['video/mp4', 'video/quicktime'].some(allowedType => asset.contentType.includes(allowedType))).length;
    const musicCount = assets.filter(asset => ['audio/mpeg', 'audio/wav'].some(allowedType => asset.contentType.includes(allowedType))).length;

    const data = [
      { name: "Ebook", value: ebookCount, fill: "#8884d8" },
      { name: "Video", value: videoCount, fill: "#83a6ed" },
      { name: "Music", value: musicCount, fill: "#8dd1e1" }
    ];

    return (
      <PieChart width={400} height={400}>
        <Pie data={data} dataKey="value" cx="50%" cy="50%" outerRadius={100} label>
          {data.map((entry, index) => (
            <Cell key={`cell-${index}`} fill={entry.fill} />
          ))}
        </Pie>
        <Tooltip />
        <Legend />
      </PieChart>
    );
  };

  return (
    <div className="min-h-screen flex flex-col md:flex-row">
      
      <aside className="md:w-1/4 bg-gray-100 border-r border-gray-300 p-4">
        <div className="mb-6">
          <img
            src="https://i.pravatar.cc/150?img=7"
            alt="profile"
            className="h-[200px] w-[200px] rounded-md mb-2"
          />
          <h1 className="text-xl font-bold">
            {userInfo.firstName} {userInfo.lastName}
          </h1>
          <p className="text-gray-600">{userInfo.email}</p>
          <p className="mt-2">{userInfo.bio}</p>
        </div>
      </aside>
      <div className="md:w-3/4 bg-white p-4">
        <header className="border-b border-gray-300 pb-4 mb-4">
          <div className="flex justify-between items-center">
            <Greetings />
            <div className="flex items-center">
              <div className="relative mr-4">
                <button className="text-blue-500" onClick={toggleSearch}>
                  <BiSearch className="inline-block" />
                </button>
                {showSearch && <Search onClose={toggleSearch} />}
              </div>
              <button className="text-blue-500 relative">
                <BiBell className="inline-block" />
                {/* Notifications tooltip */}
              </button>
              <button className="text-blue-500 relative">
                <BiEdit className="inline-block" />
              </button>
            </div>
          </div>
        </header>
        <div>
        <div className="flex mb-4">
      <Tab
        tabIndex={1}
        activeTab={activeTab}
        onClick={() => handleTabChange(1)}
        icon={<BiBook />}
        label="Ebook"
      />
      <Tab
        tabIndex={2}
        activeTab={activeTab}
        onClick={() => handleTabChange(2)}
        icon={<BiVideo />}
        label="Video"
      />
      <Tab
        tabIndex={3}
        activeTab={activeTab}
        onClick={() => handleTabChange(3)}
        icon={<BiMusic />}
        label="Music"
      />
      <Tab
        tabIndex={4}
        activeTab={activeTab}
        onClick={() => handleTabChange(4)}
        icon={<BiHistory />}
        label="Usage History"
      />
    </div>
          <div>
            {activeTab === 1 && renderContentByType("Ebook")}
            {activeTab === 2 && renderContentByType("Video")}
            {activeTab === 3 && renderContentByType("Music")}
            {activeTab === 4 && renderUsageHistory()}
            {/* Consider adding additional tabs here for Recommendations, Settings, Feedback */}  
          </div>
        </div>
      </div>
    </div>
  );
};

export default UserDashboard;

const getUserInfo = () => [
  {
    id: 1,
    firstName: "John",
    lastName: "Doe",
    email: "john@example.com",
    bio: "I enjoy learning new things.",
    Ebook: [
      {
        id: 1,
        name: "JavaScript",
        description: "JavaScript for beginners",
      },
      {
        id: 2,
        name: "React",
        description: "React for beginners",
      },
      {
        id: 3,
        name: "Node",
        description: "Node for beginners",
      },
    ],
    Video: [
      {
        id: 1,
        name: "JavaScript",
        description: "JavaScript for beginners video",
      },
    ],
    Music: [
      {
        id: 1,
        name: "ALi birra ",
        description: "Best Oromo music",
      },
    ]
  }
];

