import React from 'react';
import {
    Card,
    CardContent,
    CardHeader,
    CardTitle,
} from '@/components/ui/card';

interface CardProp {
    title: string;
    content: string;
    icon?: React.ReactNode;
    description?: string;
    className?: string;
}

const MyCard: React.FC<CardProp> = ({ title, content, icon, description, className = '' }) => {
    return (
        <Card className={`p-4 shadow-md${className}`}>
            <CardHeader className="flex flex-row justify-between items-center p-2">
                <CardTitle className="text-lg font-medium text-gray-600">
                    {title}
                </CardTitle>
                {icon && <span className="text-gray-500">{icon}</span>}
            </CardHeader>
            <CardContent className="p-2">
                <div className="text-4xl font-bold text-gray-900">{content}</div>
                {description && <div className="text-sm text-gray-500 mt-1">{description}</div>}
            </CardContent>
        </Card>
    );
};

export default MyCard;
