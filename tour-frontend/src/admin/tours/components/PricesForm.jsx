// components/PricesForm.jsx
import React from 'react';
import useApi from '@/services/api';
import { getToken } from '@/services/getToken';
import { toast } from 'react-toastify';
import { Input } from '@/components/ui/input';

const PricesForm = ({ tourData, onSuccess }) => {
  const api = useApi();

  const handleSubmit = async (e) => {
    e.preventDefault();
    const formData = new FormData(e.target);
    const priceColumns = [
      '3-stars|2', '4-stars|2', '4&5-stars|2', '5-stars|2',
      '3-stars|3-4', '4-stars|3-4', '4&5-stars|3-4', '5-stars|3-4',
      '3-stars|5<n', '4-stars|5<n', '4&5-stars|5<n', '5-stars|5<n'
    ];

    const priceData = {};
    priceColumns.forEach(column => {
      priceData[column] = parseFloat(formData.get(column));
    });

    try {
      const token = getToken();
      const response = await api.post(
        `/api/tours/update-prices/${tourData.tour.id}`,
        priceData,
        {
          headers: {
            'Authorization': `Bearer ${token}`,
          },
        }
      );
      if (response.data.success) {
        toast.success('Prices updated successfully');
        onSuccess();
      }
    } catch (error) {
      toast.error('Error updating prices');
    }
  };

  return (
    <section className="bg-orange-50 p-6 rounded-lg shadow-lg">
      <h2 className="text-2xl font-bold mb-4 text-orange-800">Update Tour Prices</h2>
      <form onSubmit={handleSubmit} className="space-y-6">
        {tourData.prices.map((price) => (
          <div key={price.id} className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              <div>
                <label className="block text-sm font-medium mb-1 text-orange-700">3 Stars (2 People)</label>
                <Input variant='orange'
                  type="number"
                  name="3-stars|2"
                  defaultValue={price['3-stars|2']}
                  className="w-full p-2 border rounded focus:ring-2 focus:ring-orange-500"
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1 text-orange-700">4 Stars (2 People)</label>
                <Input variant='orange'
                  type="number"
                  name="4-stars|2"
                  defaultValue={price['4-stars|2']}
                  className="w-full p-2 border rounded focus:ring-2 focus:ring-orange-500"
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1 text-orange-700">4&5 Stars (2 People)</label>
                <Input variant='orange'
                  type="number"
                  name="4&5-stars|2"
                  defaultValue={price['4&5-stars|2']}
                  className="w-full p-2 border rounded focus:ring-2 focus:ring-orange-500"
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1 text-orange-700">5 Stars (2 People)</label>
                <Input variant='orange'
                  type="number"
                  name="5-stars|2"
                  defaultValue={price['5-stars|2']}
                  className="w-full p-2 border rounded focus:ring-2 focus:ring-orange-500"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              <div>
                <label className="block text-sm font-medium mb-1 text-orange-700">3 Stars (3-4 People)</label>
                <Input variant='orange'
                  type="number"
                  name="3-stars|3-4"
                  defaultValue={price['3-stars|3-4']}
                  className="w-full p-2 border rounded focus:ring-2 focus:ring-orange-500"
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1 text-orange-700">4 Stars (3-4 People)</label>
                <Input variant='orange'
                  type="number"
                  name="4-stars|3-4"
                  defaultValue={price['4-stars|3-4']}
                  className="w-full p-2 border rounded focus:ring-2 focus:ring-orange-500"
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1 text-orange-700">4&5 Stars (3-4 People)</label>
                <Input variant='orange'
                  type="number"
                  name="4&5-stars|3-4"
                  defaultValue={price['4&5-stars|3-4']}
                  className="w-full p-2 border rounded focus:ring-2 focus:ring-orange-500"
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1 text-orange-700">5 Stars (3-4 People)</label>
                <Input variant='orange'
                  type="number"
                  name="5-stars|3-4"
                  defaultValue={price['5-stars|3-4']}
                  className="w-full p-2 border rounded focus:ring-2 focus:ring-orange-500"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              <div>
                <label className="block text-sm font-medium mb-1 text-orange-700">3 Stars (5+ People)</label>
                <Input variant='orange'
                  type="number"
                  name="3-stars|5<n"
                  defaultValue={price['3-stars|5<n']}
                  className="w-full p-2 border rounded focus:ring-2 focus:ring-orange-500"
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1 text-orange-700">4 Stars (5+ People)</label>
                <Input variant='orange'
                  type="number"
                  name="4-stars|5<n"
                  defaultValue={price['4-stars|5<n']}
                  className="w-full p-2 border rounded focus:ring-2 focus:ring-orange-500"
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1 text-orange-700">4&5 Stars (5+ People)</label>
                <Input variant='orange'
                  type="number"
                  name="4&5-stars|5<n"
                  defaultValue={price['4&5-stars|5<n']}
                  className="w-full p-2 border rounded focus:ring-2 focus:ring-orange-500"
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1 text-orange-700">5 Stars (5+ People)</label>
                <Input variant='orange'
                  type="number"
                  name="5-stars|5<n"
                  defaultValue={price['5-stars|5<n']}
                  className="w-full p-2 border rounded focus:ring-2 focus:ring-orange-500"
                />
              </div>
            </div>
          </div>
        ))}
        <button
          type="submit"
          className="bg-orange-500 text-white px-4 py-2 rounded hover:bg-orange-600 transition duration-300"
        >
          Update Prices
        </button>
      </form>
    </section>
  );
};

export default PricesForm;