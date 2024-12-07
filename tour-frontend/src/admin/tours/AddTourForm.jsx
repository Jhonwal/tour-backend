import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Button } from '@/components/ui/button';
import { BadgeInfo, Loader2, SquareX } from 'lucide-react';
import {
    Form,
    FormItem,
    FormLabel,
    FormControl,
    FormMessage,
    FormField,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import useApi from '@/services/api.js';
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useCookies } from "react-cookie";
import { getToken } from '@/services/getToken';

// Define the Zod schema for form validation
const isValidImageFile = (file) => {
    if (!(file instanceof File)) return false;
    const validTypes = ['image/jpeg', 'image/png', 'image/gif', 'image/webp'];
    const maxSize = 2 * 1024 * 1024; // 2MB in bytes
    return validTypes.includes(file.type) && file.size <= maxSize;
};

const tourSchema = z.object({
    depart_city: z.string().min(1, 'Departure city is required'),
    name: z.string().min(1, 'Tour name is required'),
    end_city: z.string().min(1, 'End city is required'),
    description: z.string().min(10, 'Description must be at least 10 characters long'),
    map_image: z.any().refine((file) => {
        if (file instanceof FileList && file.length > 0) {
            return Array.from(file).every(isValidImageFile);
        }
        return false;
    }, 'Map image is required and must be a valid image less than 2MB'),
    banner: z.any().refine((file) => {
        if (file instanceof FileList && file.length > 0) {
            return Array.from(file).every(isValidImageFile);
        }
        return false;
    }, 'Banner image is required and must be a valid image less than 2MB'),
    duration: z.preprocess((val) => Number(val), z.number().min(1, 'Duration must be at least 1 day')),
    tour_type_id: z.string().min(1, 'Please select a tour type'),
    image_count: z.preprocess((val) => Number(val), z.number().min(0, 'The number of images cannot be negative')),
});

const AddTourForm = () => {
    const api = useApi();
    const navigate = useNavigate();
    const [serverError, setServerError] = useState('');
    const [loading, setLoading] = useState(false);
    const [tourTypes, setTourTypes] = useState([]);
    const [mapImagePreview, setMapImagePreview] = useState(''); // State for map image preview
    const [bannerPreview, setBannerPreview] = useState('');
    const [additionalPreview, setAdditionalPreview] = useState([]); // State for banner preview
    const [cookie, setCookie] = useCookies('tours');
    const [additionalImages, setAdditionalImages] = useState([]);
    const [imageCount, setImageCount] = useState(0);

    useEffect(() => {
        if (cookie.tours) {
            navigate('/admin/tours/activites');
        }
    }, [cookie, navigate]);

    const form = useForm({
        resolver: zodResolver(tourSchema),
        defaultValues: {
            name: '',
            depart_city: '',
            end_city: '',
            description: '',
            map_image: null,
            banner: null,
            duration: '',
            tour_type_id: '',
            image_count: 0,
        },
    });

    const {
        handleSubmit,
        control,
        formState: { errors },
    } = form;

    useEffect(() => {
        const fetchTourTypes = async () => {
            try {
                const response = await api.get('/api/tour-types');
                setTourTypes(response.data);
            } catch (error) {
                console.error('Failed to fetch tour types:', error);
            }
        };

        fetchTourTypes();
    }, [api]);
    const handleAdditionalImageChange = (e, index) => {
        const files = e.target.files;
        if (files && files[0]) {
            const fileUrl = URL.createObjectURL(files[0]);

            // Update the additionalImages array
            const updatedImages = [...additionalImages];
            updatedImages[index] = files[0];
            setAdditionalImages(updatedImages);

            // Update the additionalPreview array
            const updatedPreviews = [...additionalPreview];
            updatedPreviews[index] = fileUrl;
            setAdditionalPreview(updatedPreviews);
        }
    };


    const handleAddTour = async (data) => {
        setLoading(true);
        setServerError('');
        const dateExpire = new Date();
        dateExpire.setDate(dateExpire.getDate() + 60);

        const formData = new FormData();
        formData.append('name', data.name);
        formData.append('depart_city', data.depart_city);
        formData.append('end_city', data.end_city);
        formData.append('description', data.description);
        formData.append('map_image', data.map_image[0]); // Access file using index
        formData.append('banner', data.banner[0]); // Access file using index
        formData.append('duration', data.duration);
        formData.append('tour_type_id', data.tour_type_id);
        additionalImages.forEach((file, index) => {
            if (file) {
                formData.append('additional_images[]', file); // Use consistent field name
            }
        });        
        try {
            const token = getToken();
            await api.post('/api/add-tours', formData, {
                headers: {
                    Authorization: `Bearer ${token}`,
                    'Content-Type': 'multipart/form-data',
                },
            });

            setCookie('tours', 'true', { path: '/', expires: dateExpire });
            navigate('/admin/tours/activites');
        } catch (error) {
            setServerError('Failed to add tour. Please check your inputs and try again.');
            console.log(error);
        } finally {
            setLoading(false);
        }
    };

    const closeError = () => {
        setServerError('');
    };

    return (
        <div className="bg-white rounded-3xl shadow-lg p-6 w-full max-w-4xl mx-auto">
            <Form {...form}>
                <form onSubmit={handleSubmit(handleAddTour)} className="space-y-6">
                    <h1 className="text-center text-lg font-bold mb-4">Add New Tour</h1>

                    {/* Alerts */}
                    {serverError && (
                        <div
                            className="flex items-center p-4 mb-4 text-red-800 border-t-4 border-red-300 bg-red-50"
                            role="alert"
                        >
                            <BadgeInfo className="mr-3"/>
                            <div className="text-sm font-medium">{serverError}</div>
                            <SquareX
                                onClick={closeError}
                                className="ms-auto p-1.5 rounded-lg cursor-pointer"
                            />
                        </div>
                    )}

                    {/* Form Fields */}
                    <div className="grid grid-cols-1 gap-4">
                        <FormField control={control} name="name" render={({field}) => (
                            <FormItem>
                                <FormLabel>Trip name</FormLabel>
                                <FormControl>
                                    <Input variant="orange" placeholder="Trip name" {...field} />
                                </FormControl>
                                {errors.name && <FormMessage>{errors.name.message}</FormMessage>}
                            </FormItem>
                        )}/>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <FormField control={control} name="depart_city" render={({field}) => (
                            <FormItem>
                                <FormLabel>Departure City</FormLabel>
                                <FormControl>
                                    <Input variant="orange" placeholder="Departure City" {...field} />
                                </FormControl>
                                {errors.depart_city && <FormMessage>{errors.depart_city.message}</FormMessage>}
                            </FormItem>
                        )}/>

                        <FormField control={control} name="end_city" render={({field}) => (
                            <FormItem>
                                <FormLabel>End City</FormLabel>
                                <FormControl>
                                    <Input variant="orange" placeholder="End City" {...field} />
                                </FormControl>
                                {errors.end_city && <FormMessage>{errors.end_city.message}</FormMessage>}
                            </FormItem>
                        )}/>
                    </div>

                    <FormField control={control} name="description" render={({field}) => (
                        <FormItem>
                            <FormLabel>Description</FormLabel>
                            <FormControl>
                                <Textarea variant="orange" rows={3} placeholder="Tour Description" {...field} />
                            </FormControl>
                            {errors.description && <FormMessage>{errors.description.message}</FormMessage>}
                        </FormItem>
                    )}/>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <FormField control={control} name="map_image" render={({field}) => (
                            <FormItem>
                                <FormLabel>Map Image</FormLabel>
                                <FormControl>
                                    <Input
                                        variant="orange"
                                        type="file"
                                        accept="image/*"
                                        onChange={(e) => {
                                            const files = e.target.files;
                                            field.onChange(files ? files : null);
                                            if (files && files[0]) {
                                                const fileUrl = URL.createObjectURL(files[0]);
                                                setMapImagePreview(fileUrl); // Set map image preview
                                            }
                                        }}
                                    />
                                </FormControl>
                                {mapImagePreview &&
                                    <img src={mapImagePreview} alt="Map Preview"
                                         className="m-auto max-w-xs rounded-lg border-4 border-transparent animate-spin-border"/>}
                                {errors.map_image && <FormMessage>{errors.map_image.message}</FormMessage>}
                            </FormItem>
                        )}/>

                        <FormField control={control} name="banner" render={({field}) => (
                            <FormItem>
                                <FormLabel>Banner</FormLabel>
                                <FormControl>
                                    <Input
                                        variant="orange"
                                        type="file"
                                        accept="image/*"
                                        onChange={(e) => {
                                            const files = e.target.files;
                                            field.onChange(files ? files : null);
                                            if (files && files[0]) {
                                                const fileUrl = URL.createObjectURL(files[0]);
                                                setBannerPreview(fileUrl); // Set banner preview
                                            }
                                        }}
                                    />
                                </FormControl>
                                {bannerPreview &&
                                    <img src={bannerPreview} alt="Banner Preview"  className="m-auto max-w-xs rounded-lg border-4 border-transparent animate-spin-border"/>}
                                {errors.banner && <FormMessage>{errors.banner.message}</FormMessage>}
                            </FormItem>
                        )}/>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <FormField control={control} name="duration" render={({field}) => (
                            <FormItem>
                                <FormLabel>Duration (days)</FormLabel>
                                <FormControl>
                                    <Input
                                        variant="orange"
                                        type="number"
                                        placeholder="Duration"
                                        value={field.value}
                                        onChange={(e) => field.onChange(Number(e.target.value))}
                                    />
                                </FormControl>
                                {errors.duration && <FormMessage>{errors.duration.message}</FormMessage>}
                            </FormItem>
                        )}/>

                        <FormField control={control} name="image_count" render={({field}) => (
                            <FormItem>
                                <FormLabel>Number of Additional Images</FormLabel>
                                <FormControl>
                                    <Input
                                        type="number"
                                        min='0'
                                        placeholder="0"
                                        variant="orange"
                                        value={field.value}
                                        onChange={(e) => {
                                            const count = Number(e.target.value);
                                            field.onChange(count);
                                            setImageCount(count);
                                            setAdditionalImages(new Array(count).fill(null));
                                        }}
                                    />
                                </FormControl>
                                {errors.image_count && <FormMessage>{errors.image_count.message}</FormMessage>}
                            </FormItem>
                        )}/>
                    </div>

                    <FormField control={control} name="tour_type_id" render={({field}) => (
                        <FormItem>
                            <FormLabel>Tour Type</FormLabel>
                            <FormControl>
                                <select
                                    {...field}
                                    className="block w-full px-3 py-2 border rounded-md text-sm bg-white text-orange-700 font-semibold placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-orange-500 border-orange-600"
                                >
                                    <option value="" disabled className="text-center font-semibold bg-orange-500">Select
                                        a Type
                                    </option>
                                    {tourTypes.map((type) => (
                                        <option key={type.id} value={type.id}
                                                className="text-orange-600 text-center font-semibold focus:ring-2 focus:ring-orange-500 hover:bg-orange-500">
                                            {type.name}
                                        </option>
                                    ))}
                                </select>
                            </FormControl>
                            {errors.tour_type_id && <FormMessage>{errors.tour_type_id.message}</FormMessage>}
                        </FormItem>
                    )}/>

                    {/* Dynamic Inputs for Additional Images */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        {Array.from({length: imageCount}, (_, index) => (
                            <FormField key={index} control={control} name={`additional_image_${index}`}
                                render={({field}) => (
                                   <FormItem>
                                       <FormLabel>Additional Image {index + 1}</FormLabel>
                                        <FormControl>
                                            <Input
                                                type="file"
                                                accept="image/*"
                                                variant="orange"
                                                onChange={(e) => handleAdditionalImageChange(e, index)}  // Use the handler
                                            />
                                        </FormControl>
                                       {additionalPreview[index] &&
                                            <img src={additionalPreview[index]}
                                                alt={`Additional Preview ${index + 1}`}
                                                className="m-auto max-w-xs rounded-lg border-4 border-transparent animate-spin-border"/>
                                        }
                                   </FormItem>
                               )}/>

                        ))}
                    </div>

                    {/* Submit Button */}
                    <Button type="submit" variant="waguer2" disabled={loading} className="w-full">
                        {loading ? <><Loader2 className="animate-spin"/> please wait</> : 'Add Tour'}
                    </Button>
                </form>
            </Form>
        </div>
    );
};

export default AddTourForm;
