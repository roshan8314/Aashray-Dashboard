import React from 'react';
import { DivideIcon as LucideIcon } from 'lucide-react';

interface StatsCardProps {
  title: string;
  value: string | number;
  icon: LucideIcon;
  color: string;
  percentage?: {
    value: number;
    isPositive: boolean;
  };
}

const StatsCard: React.FC<StatsCardProps> = ({ 
  title, 
  value, 
  icon: Icon, 
  color,
  percentage 
}) => {
  return (
    <div className="bg-white rounded-xl shadow-md p-6 transition-all duration-200 hover:shadow-lg">
      <div className="flex justify-between items-center">
        <div>
          <p className="text-gray-500 text-sm font-medium">{title}</p>
          <h3 className="text-2xl font-bold mt-1">{value}</h3>
          
          {percentage && (
            <div className="flex items-center mt-2">
              <span className={`text-sm ${percentage.isPositive ? 'text-green-500' : 'text-red-500'}`}>
                {percentage.isPositive ? '+' : ''}{percentage.value}%
              </span>
              <span className="text-gray-400 text-xs ml-1">from last week</span>
            </div>
          )}
        </div>
        
        <div className={`p-3 rounded-full ${color}`}>
          <Icon className="text-white" size={24} />
        </div>
      </div>
    </div>
  );
};

export default StatsCard;