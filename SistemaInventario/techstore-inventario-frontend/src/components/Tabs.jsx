function Tabs({ tabs, activeIndex, onTabChange }) {
    return (
      <div className="w-full">
        <div className="flex space-x-4 mb-6 border-b">
          {tabs.map((tab, index) => (
            <button
              key={index}
              onClick={() => {
                if (onTabChange) onTabChange(index);
              }}
              className={`py-2 px-4 font-semibold text-sm rounded-t ${
                activeIndex === index
                  ? "text-white border-b-2 border-white"
                  : "text-gray-500 hover:text-white"
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>
        <div className="bg-white shadow rounded p-6">
          {tabs[activeIndex].content}
        </div>
      </div>
    );
  }
  
  export default Tabs;
  