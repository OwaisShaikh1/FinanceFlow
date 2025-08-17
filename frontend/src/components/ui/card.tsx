import * as React from "react";
import "./card.css"; // custom CSS for card

export interface CardProps extends React.HTMLAttributes<HTMLDivElement> {}

function Card({ className = "", ...props }: CardProps) {
  return <div className={`card ${className}`} {...props} />;
}

function CardHeader({
  className = "",
  ...props
}: React.HTMLAttributes<HTMLDivElement>) {
  return <div className={`card-header ${className}`} {...props} />;
}

function CardTitle({
  className = "",
  ...props
}: React.HTMLAttributes<HTMLHeadingElement>) {
  return <h3 className={`card-title ${className}`} {...props} />;
}

function CardContent({
  className = "",
  ...props
}: React.HTMLAttributes<HTMLDivElement>) {
  return <div className={`card-content ${className}`} {...props} />;
}

export { Card, CardHeader, CardTitle, CardContent };
