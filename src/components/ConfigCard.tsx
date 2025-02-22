
import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { cn } from "@/lib/utils";

interface ConfigCardProps {
  title: string;
  children: React.ReactNode;
  className?: string;
}

const ConfigCard = ({ title, children, className }: ConfigCardProps) => {
  return (
    <Card className={cn("w-full animate-fade-up shadow-lg", className)}>
      <CardHeader>
        <CardTitle className="text-xl font-medium">{title}</CardTitle>
      </CardHeader>
      <CardContent>{children}</CardContent>
    </Card>
  );
};

export default ConfigCard;
