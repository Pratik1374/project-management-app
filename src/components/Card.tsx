import React from "react";

interface CardProps {
  title?: string;
  children: React.ReactNode;
  shadow?: boolean;
  border?: boolean;
}

const Card: React.FC<CardProps> = ({ title, children, shadow = true, border = false }) => {
  return (
    <div className={`card ${shadow && "card-shadow"} ${border && "card-border"}`}>
      {title && <h2 className="card-title">{title}</h2>}
      <div>{children}</div>
    </div>
  );
};

export default Card;
