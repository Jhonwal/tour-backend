import React from "react";
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from "../../components/ui/card";
import { EnvelopeOpenIcon, InstagramLogoIcon } from "@radix-ui/react-icons";
import { FacebookIcon } from "lucide-react";


export default function InfoCard({ image, name, description, email, facebook, instagram }) {
    return (
        <Card className="info-card border bg-white text-gray-800 h-full">
            <CardHeader className="p-6">
                <img src={image} alt={`${name}'s avatar`} className="avatar rounded-full w-20 h-20 mx-auto ring-offset-2 ring-4 ring-red-500 outline outline-offset-2 outline-yellow-500" />
            </CardHeader>
            <CardContent className="p-6 pt-0 text-center">
                <CardTitle className="text-2xl font-semibold leading-none tracking-tight">{name}</CardTitle>
                <CardDescription className="text-sm text-gray-600">{description}</CardDescription>
            </CardContent>
            <CardFooter className="p-6 pt-0">
                <div className="">
                    <a href={`mailto:${email}`} className="text-gray-600 flex items-end my-2">
                        <EnvelopeOpenIcon className="w-8 h-8 mr-2 text-green-600" />
                        <span className="hover:text-green-600">{email}</span>
                    </a>
                    <a href={facebook} target="_blank" rel="noopener noreferrer" className="text-gray-600 flex items-end my-2">
                        <FacebookIcon className="w-8 h-8 mr-2 text-blue-500" />
                        <span className="hover:text-blue-600">{facebook} </span>
                    </a>
                    <a href={instagram} target="_blank" rel="noopener noreferrer" className="text-gray-600 flex items-end my-2">
                        <InstagramLogoIcon className="w-8 h-8 mr-2 text-red-600" />
                        <span className="hover:text-red-600">{instagram}</span>
                    </a>
                </div>
            </CardFooter>
        </Card>
    );
}

