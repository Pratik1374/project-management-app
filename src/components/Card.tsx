import React from "react";

interface CardProps {
  title?: string;
  children: React.ReactNode;
}

const Card: React.FC<CardProps> = ({ title, children }) => {
  return (
    <div className="mb-6 rounded-lg bg-gray-800 p-6 shadow-lg">
      {title && <h2 className="card-title">{title}</h2>}
      <div>{children}</div>
    </div>
  );
};

export default Card;
