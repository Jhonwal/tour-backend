import { Input } from '@/components/ui/input';
import React, { useState } from 'react';

function TourPrices({ price }) {
    const [groupSize, setGroupSize] = useState(1);
    const [selectedCategory, setSelectedCategory] = useState('');
    const [result, setResult] = useState('0 $');

    const handleGroupSizeChange = (e) => {
        setGroupSize(e.target.value);
    };

    const handleCategoryChange = (e) => {
        setSelectedCategory(e.target.value);
    };

    const calculateResult = () => {
        if (selectedCategory && groupSize) {
            if (groupSize <= 2) {
                let key = selectedCategory + '|2';
                setResult(`${groupSize * price[key]} $`);
            } else if (groupSize >= 5) {
                let key = selectedCategory + '|5<n';
                setResult(`${groupSize * price[key]} $`);
            } else {
                let key = selectedCategory + '|3-4';
                setResult(`${groupSize * price[key]} $`);
            }
        } else {
            setResult('0 $');
        }
    };

    React.useEffect(() => {
        calculateResult();
    }, [groupSize, selectedCategory]);

    if (!price) {
        return <p>No price data available.</p>;
    }

    // Group prices by category
    const groupedPrices = price
        ? Object.entries(price)
              .filter(([key]) => !['id', 'tour_id', 'created_at', 'updated_at'].includes(key)) // Exclude non-price fields
              .reduce((acc, [key, value]) => {
                  const [category, groupSize] = key.split('|');
                  if (!acc[category]) {
                      acc[category] = [];
                  }
                  acc[category].push({ groupSize, price: value });
                  return acc;
              }, {})
        : {};

    // Extract unique group sizes
    const groupSizes = [...new Set(Object.values(groupedPrices).flat().map(item => item.groupSize))];

    return (
        <div className="mt-8">
            <h3 className="text-2xl mb-2 font-semibold text-white bg-blue-300 bg-gradient-to-tl from-blue-400 via-cyan-500 to-blue-700 border-b-8 border-blue-300 p-3 text-center">Tour Prices</h3>
            <table className="table-auto w-full border-collapse border border-gray-200">
                <thead className="bg-blue-100">
                    <tr>
                        <th className="border border-gray-300 px-4 py-2 text-left font-semibold text-gray-800">Accommodation Category</th>
                        {groupSizes.map((size) => (
                            <th key={size} className="border border-gray-300 px-4 py-2 text-left font-semibold text-gray-800">
                                {groupSizeDescription(size)}
                            </th>
                        ))}
                    </tr>
                </thead>
                <tbody>
                    {Object.entries(groupedPrices).map(([category, details]) => (
                        <React.Fragment key={category}>
                            <tr>
                                <td className="border border-gray-300 px-4 py-2 font-bold">{category} - {categoryDescription(category)}</td>
                                {groupSizes.map((size) => {
                                    const priceData = details.find(item => item.groupSize == size);
                                    return (
                                        <td key={size} className="border border-gray-300 px-4 py-2">
                                            {priceData ? priceData.price + ' $' : '-'}
                                        </td>
                                    );
                                })}
                            </tr>
                        </React.Fragment>
                    ))}
                </tbody>
            </table>
        </div>
    );
}

// Function to provide a description of the category
function categoryDescription(category) {
    const descriptions = {
        "3-stars": "Budget-friendly accommodation with essential amenities.",
        "4-stars": "Comfortable accommodation with additional amenities.",
        "4&5-stars": "Premium accommodation with high-end services.",
        "5-stars": "Luxury accommodation with world-class facilities."
    };
    return descriptions[category] || "Standard accommodation.";
}

// Function to describe the group size
function groupSizeDescription(groupSize) {
    const groupSizeDescriptions = {
        "2": "2 people (Couple or small group)",
        "3-4": "3 to 4 people (Small family or group of friends)",
        "5<n": "5 or more people (Large group)"
    };
    return groupSizeDescriptions[groupSize] || groupSize;
}

export default TourPrices;
