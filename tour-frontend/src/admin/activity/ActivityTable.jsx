import React, { useEffect, useState } from "react";
import { Button } from "@/components/ui/button"; // Import Button from shadcn
import { Dialog, DialogTrigger, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog"; // Import Dialog components from shadcn
import useApi from "@/services/api";
import { getToken } from "@/services/getToken";
import { Plus, Edit, Trash } from "lucide-react"; // Import Lucide icons
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { ToastContainer, toast } from "react-toastify"; // Import ToastContainer and toast from react-toastify
import "react-toastify/dist/ReactToastify.css"; 

const ActivityTable = () => {
  const [activities, setActivities] = useState([]);
  const api = useApi();
  const [editingActivity, setEditingActivity] = useState(null);
  const [formData, setFormData] = useState({
    activity_name: "",
    activity_description: "",
  });
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const token = getToken();

  // Fetch activities from the backend
  useEffect(() => {
    fetchActivities();
  }, []);

  const fetchActivities = async () => {
    try {
      const response = await api.get("/api/activities", {
        headers: { Authorization: `Bearer ${token}` },
      });
      setActivities(response.data);
      console.log(response);
    } catch (error) {
      console.error("Error fetching activities:", error);
      toast.error("Failed to fetch activities. Please try again.");
    }
  };

  // Handle form input changes
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  // Handle form submission (Add or Update)
  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (editingActivity) {
        // Update existing activity
        await api.put(`/api/activities/${editingActivity.id}`, formData, {
          headers: { Authorization: `Bearer ${token}` },
        });
        toast.success("Activity updated successfully!");
      } else {
        // Add new activity
        await api.post("/api/activities", formData, {
          headers: { Authorization: `Bearer ${token}` },
        });
        toast.success("Activity added successfully!");
      }
      setEditingActivity(null);
      setFormData({ activity_name: "", activity_description: "" });
      setIsDialogOpen(false); // Close the dialog
      fetchActivities(); // Refresh the list
    } catch (error) {
      console.error("Error saving activity:", error);
      toast.error("Failed to save activity. Please try again.");
    }
  };

  // Handle editing an activity
  const handleEdit = (activity) => {
    setEditingActivity(activity);
    setFormData({
      activity_name: activity.activity_name,
      activity_description: activity.activity_description,
    });
    setIsDialogOpen(true); // Open the dialog for editing
  };

  // Handle deleting an activity
  const handleDelete = async (id) => {
    try {
      await api.delete(`/api/activities/${id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      toast.success("Activity deleted successfully!");
      fetchActivities(); // Refresh the list
    } catch (error) {
      console.error("Error deleting activity:", error);
      toast.error("Failed to delete activity. Please try again.");
    }
  };

  // Reset form and close dialog
  const resetFormAndCloseDialog = () => {
    setFormData({ activity_name: "", activity_description: "" });
    setEditingActivity(null);
    setIsDialogOpen(false);
  };

  return (
    <div className="p-4">
      <h1 className="text-2xl font-bold mb-4">Activity Management</h1>

      {/* ToastContainer for displaying notifications */}
      <ToastContainer
        position="top-right"
        autoClose={3000}
        hideProgressBar={false}
        newestOnTop={false}
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
      />

      {/* Button to open the dialog for adding a new activity */}
      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogTrigger asChild>
          <Button className="bg-orange-500 hover:bg-orange-600 text-white p-2 rounded mb-4">
            <Plus className="mr-2 h-4 w-4" /> Add New Activity
          </Button>
        </DialogTrigger>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>
              {editingActivity ? "Edit Activity" : "Add New Activity"}
            </DialogTitle>
            <DialogDescription>
              {editingActivity
                ? "Update the activity details below."
                : "Fill out the form to add a new activity."}
            </DialogDescription>
          </DialogHeader>
          {/* Form for adding/editing activities */}
          <form onSubmit={handleSubmit} className="space-y-4">
            <Input
              variant="orange"
              type="text"
              name="activity_name"
              value={formData.activity_name}
              onChange={handleInputChange}
              placeholder="Activity Name"
              className="w-full p-2 border rounded"
              required
            />
            <Textarea
              variant="orange"
              name="activity_description"
              value={formData.activity_description}
              onChange={handleInputChange}
              placeholder="Activity Description"
              className="w-full p-2 border rounded"
            />
            <div className="flex justify-end space-x-2">
              <Button
                type="button"
                onClick={resetFormAndCloseDialog}
                className="bg-gray-500 hover:bg-gray-600 text-white p-2 rounded"
              >
                Cancel
              </Button>
              <Button
                type="submit"
                className="bg-orange-500 hover:bg-orange-600 text-white p-2 rounded"
              >
                {editingActivity ? "Update" : "Add"}
              </Button>
            </div>
          </form>
        </DialogContent>
      </Dialog>

      {/* Table to display activities */}
      <div className="overflow-x-auto">
        <table className="min-w-full bg-white border">
          <thead>
            <tr className="bg-gray-100">
              <th className="py-2 px-4 border">Name</th>
              <th className="py-2 px-4 border">Description</th>
              <th className="py-2 px-4 border">Actions</th>
            </tr>
          </thead>
          <tbody>
            {activities.map((activity) => (
              <tr key={activity.id} className="hover:bg-gray-50">
                <td className="py-2 px-4 border">{activity.activity_name}</td>
                <td className="py-2 px-4 border">
                  {activity.activity_description}
                </td>
                <td className="py-2 px-4 border space-x-2">
                  <Button
                    onClick={() => handleEdit(activity)}
                    className="bg-orange-500 hover:bg-orange-600 text-white p-1 rounded"
                  >
                    <Edit className="h-4 w-4" />
                  </Button>
                  <Button
                    onClick={() => handleDelete(activity.id)}
                    className="bg-red-500 hover:bg-red-600 text-white p-1 rounded"
                  >
                    <Trash className="h-4 w-4" />
                  </Button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default ActivityTable;