import { Visitors } from "../components/Visitors";
import { Input } from "@/components/ui/input";
import { Link } from "react-router-dom";

export default function MainTours(){
    return (
        <>
            <div className="flex flex-col p-2">
            <div className="flex justify-between items-center mb-2">
                <Input type='text' className='md:w-2/4 sm:w-2/3 w-full mr-2' placeholder='search' variant='orange' />
                <Link to="/admin/tours/new-tours">Add New Tour</Link>
            </div>
            <div className="grid md:grid-cols-3 sm:grid-cols-1 gap-4">
                <Visitors/><Visitors/><Visitors/>
            </div>
            </div>
        </>
    );
}