import { useState } from "react";
import { z } from "zod";
import useApi from "@/services/api.js";
import { toast } from "react-toastify";
import { Loader2Icon } from "lucide-react";

const TestimonialForm = ({ closePopover }) => {
    const api = useApi();
    const [loading, setLoading] = useState(false);
    const [formData, setFormData] = useState({
        name: "",
        email: "",
        message: "",
        rating: 1,
        avatar: null,
    });

    const [errors, setErrors] = useState({});

    const testimonialSchema = z.object({
        name: z.string().min(2, "Name must be at least 2 characters"),
        email: z.string().email("Invalid email format"),
        message: z.string().min(10, "Message must be at least 10 characters"),
        rating: z.number().min(1).max(5, "Rating must be between 1 and 5"),
        avatar: z
            .instanceof(File)
            .refine(
                (file) => file && file.type.startsWith("image/"),
                "Avatar must be an image file"
            )
            .nullable(),
    });

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData({ ...formData, [name]: value });
    };

    const handleFileChange = (e) => {
        const file = e.target.files[0];
        setFormData({ ...formData, avatar: file });
    };

    const handleRatingChange = (newRating) => {
        setFormData({ ...formData, rating: newRating });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            setLoading(true);
            testimonialSchema.parse(formData);

            const formDataToSend = new FormData();
            formDataToSend.append("name", formData.name);
            formDataToSend.append("email", formData.email);
            formDataToSend.append("message", formData.message);
            formDataToSend.append("rating", formData.rating);
            if (formData.avatar) {
                formDataToSend.append("avatar", formData.avatar);
            }

            await api.post("/api/testimonials", formDataToSend, {
                headers: { "Content-Type": "multipart/form-data" },
            });
            setLoading(false);
            toast.success("Testimonial added successfully!",{
                position:'top-center'
            });
            setFormData({
                name: "",
                email: "",
                message: "",
                rating: 1,
                avatar: null,
            });
            closePopover(false);
        } catch (error) {
            if (error instanceof z.ZodError) {
                const fieldErrors = error.flatten().fieldErrors;
                setErrors(fieldErrors);
                setLoading(false);
            } else {
                setLoading(false);
                toast.error("Error submitting testimonial:", error.response?.data);
            }
        }
    };

    return (
        <form
            onSubmit={handleSubmit}
            className="bg-white shadow-md rounded px-6 py-6 space-y-6"
        >
            <h2 className="text-2xl font-bold mb-4 text-orange-800 text-center">Add Your Testimonial</h2>

            <div className="grid gap-4 md:grid-cols-2">
                {/* Name Input */}
                <div>
                    <label htmlFor="name" className="block text-orange-700 text-sm font-bold mb-1">
                        Name
                    </label>
                    <input
                        type="text"
                        name="name"
                        placeholder="Your Name"
                        value={formData.name}
                        onChange={handleChange}
                        required
                        className="shadow appearance-none border rounded w-full py-2 px-3 text-orange-700 leading-tight focus:outline-none focus:ring-2 focus:ring-orange-500"
                    />
                    {errors.name && <p className="text-red-500 text-xs mt-1">{errors.name}</p>}
                </div>

                {/* Email Input */}
                <div>
                    <label htmlFor="email" className="block text-orange-700 text-sm font-bold mb-1">
                        Email
                    </label>
                    <input
                        name="email"
                        placeholder="Your Email"
                        value={formData.email}
                        onChange={handleChange}
                        required
                        className="shadow appearance-none border rounded w-full py-2 px-3 text-orange-700 leading-tight focus:outline-none focus:ring-2 focus:ring-orange-500"
                    />
                    {errors.email && <p className="text-red-500 text-xs mt-1">{errors.email}</p>}
                </div>
            </div>

            {/* Message Input */}
            <div>
                <label htmlFor="message" className="block text-orange-700 text-sm font-bold mb-1">
                    Message
                </label>
                <textarea
                    name="message"
                    placeholder="Your Message"
                    value={formData.message}
                    onChange={handleChange}
                    required
                    className="shadow appearance-none border rounded w-full py-2 px-3 text-orange-700 leading-tight focus:outline-none focus:ring-2 focus:ring-orange-500 h-24"
                ></textarea>
                {errors.message && (
                    <p className="text-red-500 text-xs mt-1">{errors.message}</p>
                )}
            </div>

            <div className="grid gap-4 md:grid-cols-2">
                {/* Rating Input */}
                <div>
                    <label className="block text-orange-700 text-sm font-bold mb-1">Rating</label>
                    <div className="flex items-center">
                        {[...Array(5)].map((_, i) => (
                            <svg
                                key={i}
                                onClick={() => handleRatingChange(i + 1)}
                                xmlns="http://www.w3.org/2000/svg"
                                fill={formData.rating > i ? "orange" : "none"}
                                viewBox="0 0 24 24"
                                stroke="orange"
                                className="w-8 h-8 cursor-pointer hover:scale-110 transition-transform"
                            >
                                <path
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    strokeWidth={2}
                                    d="M11.049 2.927c.3-.921 1.603-.921 1.902 0l2.053 6.319a1 1 0 00.95.69h6.656c.969 0 1.371 1.24.588 1.81l-5.388 3.912a1 1 0 00-.364 1.118l2.053 6.319c.3.921-.755 1.688-1.538 1.118l-5.388-3.912a1 1 0 00-1.176 0l-5.388 3.912c-.783.57-1.838-.197-1.538-1.118l2.053-6.319a1 1 0 00-.364-1.118L2.293 11.746c-.783-.57-.381-1.81.588-1.81h6.656a1 1 0 00.95-.69l2.053-6.319z"
                                />
                            </svg>
                        ))}
                    </div>
                </div>

                {/* Avatar Upload */}
                <div>
                    <label
                        htmlFor="avatar"
                        className="block text-orange-700 text-sm font-bold mb-1"
                    >
                        Upload Avatar
                    </label>
                    <input
                        type="file"
                        accept="image/*"
                        onChange={handleFileChange}
                        className="block w-full text-sm text-orange-700 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-orange-100 file:text-orange-700 hover:file:bg-orange-200"
                    />
                    {errors.avatar && <p className="text-red-500 text-xs mt-1">{errors.avatar}</p>}
                </div>
            </div>

            {/* Submit Button */}
            <button
                type="submit"
                className="bg-orange-500 hover:bg-orange-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline w-full"
                disabled={loading}
            >
            {loading? (
                <span className="flex items-center justify-center">
                    <Loader2Icon className="w-6 h-6 animate-spin" />
                    sending...
                </span>
              ) :(
                "Send"
              )
            }
            </button>
        </form>
    );
};

export default TestimonialForm;
