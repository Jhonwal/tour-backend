import React, { useState, useEffect } from "react";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  Drawer,
  DrawerClose,
  DrawerContent,
  DrawerDescription,
  DrawerFooter,
  DrawerHeader,
  DrawerTitle,
  DrawerTrigger,
} from "@/components/ui/drawer";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import useApi from "@/services/api";
import { getToken } from "@/services/getToken";
import { Loader2Icon } from "lucide-react";

const UpdateTour = ({ tourId }) => {
  const [open, setOpen] = useState(false);
  const [isDesktop, setIsDesktop] = useState(false);
  const api = useApi();
  const [formData, setFormData] = useState({});
  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const mediaQuery = window.matchMedia("(min-width: 768px)");
    setIsDesktop(mediaQuery.matches);
    const handleChange = () => setIsDesktop(mediaQuery.matches);
    mediaQuery.addEventListener("change", handleChange);
    return () => mediaQuery.removeEventListener("change", handleChange);
  }, []);

  useEffect(() => {
    if (open) {
      fetchTourDetails();
    }
  }, [open]);

  const fetchTourDetails = async () => {
    setLoading(true);
    try {
      const token = getToken();
      const response = await api.get(`/api/tours/${tourId}`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
      });
      if (response.status === 200) {
        setFormData(response.data);
      } else {
        toast.error("Failed to fetch tour details.");
      }
    } catch (error) {
      console.error("Error fetching tour details:", error);
      toast.error("There was an error fetching the tour details.");
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevState) => ({ ...prevState, [name]: value }));
    setErrors((prevErrors) => ({ ...prevErrors, [name]: "" }));
  };

  const handleFileChange = (e) => {
    const { name, files } = e.target;
    setFormData((prevState) => ({ ...prevState, [name]: files[0] }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);

    const formDataToSend = new FormData();
    Object.entries(formData).forEach(([key, value]) => {
      if (value) formDataToSend.append(key, value);
    });

    try {
      const response = await api.put(`/api/tours/${tourId}`, formDataToSend, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });

      if (response.status === 200) {
        toast.success("Tour updated successfully!");
        setOpen(false);
      } else {
        toast.error("Failed to update the tour. Please try again.");
      }
    } catch (error) {
      console.error("Error updating the tour:", error);
      toast.error("There was an error while updating the tour. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const UpdateFormContent = ({ formData, onChange, onSubmit, errors, isSubmitting }) => (
    <form onSubmit={onSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-4 max-w-4xl lg:max-h-[80vh] p-4 overflow-auto">
      <div className='space-y-2'>
        <Label>Tour Name</Label>
        <Input
          type="text"
          name="name"
          variant="orange"
          value={formData.name || ""}
          onChange={onChange}
        />
        {errors.name && <span className="text-red-500">{errors.name}</span>}
      </div>
      <div className='space-y-2'>
        <Label>Departure City</Label>
        <Input
          type="text"
          name="depart_city"
          variant="orange"
          value={formData.depart_city || ""}
          onChange={onChange}
        />
        {errors.depart_city && <span className="text-red-500">{errors.depart_city}</span>}
      </div>
      <div className='space-y-2'>
        <Label>End City</Label>
        <Input
          type="text"
          name="end_city"
          variant="orange"
          value={formData.end_city || ""}
          onChange={onChange}
        />
        {errors.end_city && <span className="text-red-500">{errors.end_city}</span>}
      </div>
      <div className='space-y-2'>
        <Label>Duration (in days)</Label>
        <Input
          type="number"
          name="duration"
          variant="orange"
          value={formData.duration || ""}
          onChange={onChange}
        />
        {errors.duration && <span className="text-red-500">{errors.duration}</span>}
      </div>
      <div className='space-y-2 col-span-2'>
        <Label>Description</Label>
        <Textarea
          type="text"
          name="description"
          variant="orange"
          value={formData.description || ""}
          onChange={onChange}
          className="w-full"
        ></Textarea>
        {errors.description && <span className="text-red-500">{errors.description}</span>}
      </div>
      <div className='space-y-2 col-span-2'>
        <Label>Map Image</Label>
        <Input
          type="file"
          name="map_image"
          variant="orange"
          onChange={handleFileChange}
          className="w-full"
        />
      </div>
      <div className='space-y-2 col-span-2'>
        <Label>Banner</Label>
        <Input
          type="file"
          name="banner"
          variant="orange"
          onChange={handleFileChange}
          className="w-full"
        />
      </div>
      <Button variant='waguer2' type="submit" disabled={isSubmitting} className="col-span-2 sm:w-auto">
          {isSubmitting ? "Updating..." : "Update Tour"}
      </Button>
      
    </form>
  );

  return (
    <>
      <ToastContainer />
      {isDesktop ? (
        <Dialog open={open} onOpenChange={setOpen}>
          <DialogTrigger asChild>
            <Button variant="primary">Update Tour</Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Update Tour</DialogTitle>
              <DialogDescription>
                Modify the details of the tour and save your changes.
              </DialogDescription>
            </DialogHeader>
            {loading ? (
              <div className="flex items-center justify-center">
                <Loader2Icon className="animate-spin text-3xl text-blue-700"/>
              </div>
            ) : (
              <UpdateFormContent
                formData={formData}
                onChange={handleChange}
                onSubmit={handleSubmit}
                errors={errors}
                isSubmitting={isSubmitting}
              />
            )}
          </DialogContent>
        </Dialog>
      ) : (
        <Drawer open={open} onOpenChange={setOpen}>
          <DrawerTrigger asChild>
            <Button variant="primary">Update Tour</Button>
          </DrawerTrigger>
          <DrawerContent>
            <DrawerHeader>
              <DrawerTitle>Update Tour</DrawerTitle>
              <DrawerDescription>
                Modify the details of the tour and save your changes.
              </DrawerDescription>
            </DrawerHeader>
            {loading ? (
              <div className="flex items-center justify-center">
                <Loader2Icon className="animate-spin"/>
              </div>
            ) : (
              <UpdateFormContent
                formData={formData}
                onChange={handleChange}
                onSubmit={handleSubmit}
                errors={errors}
                isSubmitting={isSubmitting}
              />
            )}
            <DrawerFooter>
              <DrawerClose asChild>
                <Button variant="outline">Cancel</Button>
              </DrawerClose>
            </DrawerFooter>
          </DrawerContent>
        </Drawer>
      )}
    </>
  );
};

export default UpdateTour;
