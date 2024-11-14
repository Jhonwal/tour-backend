import { z } from 'zod';

// Zod schema for tour validation
const tourSchema = z.object({
  depart_city: z.string().min(1, { message: "Departure city is required" }),
  end_city: z.string().min(1, { message: "End city is required" }),
  description: z.string().min(1, { message: "Description is required" }),
  map_image: z.instanceof(File, { message: "Map image is required" }),
  banner: z.instanceof(File, { message: "Banner image is required" }),
  duration: z.number().positive({ message: "Duration must be a positive number" }),
  max_participants: z.number().positive({ message: "Maximum participants must be a positive number" }),
  tour_type_id: z.string().min(1, { message: "Tour type is required" }),
});

export default tourSchema;
