import { useEffect, useState } from 'react';

export function SubscriptionSlideDownCard({action, expanded, active_background, active_color, title, children}) {
  const [isExpanded, setIsExpanded] = useState(expanded);
  
  const toggleExpand = () => {
    action();
    setIsExpanded(!isExpanded);
  };

  const getBackgroundColor = () => {
    if (active_background) {
      return active_background;
    } else {
      return "";
    }
  }

    const getTextColor = () => {
        if (active_color) {
        return active_color;
        } else {
        return "";
        }
    }


  return (
    <div className="flex flex-col w-full max-w-md mx-auto">
      {/* Unified card with consistent rounded corners */}
      <div 
        className={`${getBackgroundColor()} ${getTextColor()} rounded-2xl shadow-lg overflow-hidden transition-all duration-300`}
        onClick={toggleExpand}
      >
        {/* Main card content */}
        <div className="p-6 cursor-pointer hover:brightness-110 active:brightness-95 transition-all duration-300">
          <h3 className="text-xl font-medium text-center">{title}</h3>
        </div>
        
        {/* Sliding text area - simple text only */}
        <div 
          className={`overflow-hidden transition-all duration-500 ease-in-out ${
            isExpanded ? 'max-h-24 opacity-100' : 'max-h-0 opacity-0'
          }`}
        >
          <div className="px-6 pb-6">
            {children ? children : <></>}
          </div>
        </div>
      </div>
    </div>
  );
}