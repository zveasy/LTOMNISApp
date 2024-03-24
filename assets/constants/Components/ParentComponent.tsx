import React from "react";
import CostPercentageComponent from "./CostPercentageComponent";

interface User {
    firstName: string;
    lastName: string;
    avatar: boolean;
    cost?: number;
    percentage?: number;
  }
  
  interface ParentComponentProps {
    users: User[];
    totalCost: number;
    type: 'equal' | 'custom';
  }
  
  const ParentComponent: React.FC<ParentComponentProps> = ({ users, totalCost, type }) => {
    if (type === 'equal') {
      const equalCost = totalCost / users.length;
      const equalPercentage = 100 / users.length;
  
      return (
        <CostPercentageComponent
          costTitle={`Cost: $${equalCost.toFixed(2)}`}
          percentageTitle={`Percentage: ${equalPercentage.toFixed(2)}%`}
          avatar={false}
        />
      );
    }
  
    if (type === 'custom') {
      return (
        <>
          {users.map((user, index) => (
            <CostPercentageComponent
              key={index}
              costTitle={`Cost: $${(user.cost || 0).toFixed(2)}`}
              percentageTitle={`Percentage: ${(user.percentage || 0).toFixed(2)}%`}
              firstName={user.firstName}
              lastName={user.lastName}
              avatar={user.avatar}
            />
          ))}
        </>
      );
    }
  
    return null;
  };
  
  export default ParentComponent;
  