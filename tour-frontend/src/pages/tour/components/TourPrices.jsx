import { Input } from '@/components/ui/input';
import React, { useState } from 'react';

function TourPrices({ price, promo = 0 }) {
    const [groupSize, setGroupSize] = useState(1);
    const [selectedCategory, setSelectedCategory] = useState('');
    const [result, setResult] = useState({ original: '0 $', discounted: '0 $' });

    const handleGroupSizeChange = (e) => {
        setGroupSize(e.target.value);
    };

    const handleCategoryChange = (e) => {
        setSelectedCategory(e.target.value);
    };

    const calculateResult = () => {
        if (selectedCategory && groupSize) {
            let key;
            if (groupSize <= 2) {
                key = selectedCategory + '|2';
            } else if (groupSize >= 5) {
                key = selectedCategory + '|5<n';
            } else {
                key = selectedCategory + '|3-4';
            }
            
            const originalPrice = groupSize * price[key];
            const discountedPrice = originalPrice * (1 - promo / 100);
            
            setResult({
                original: `${originalPrice} $`,
                discounted: `${discountedPrice.toFixed(2)} $`
            });
        } else {
            setResult({ original: '0 $', discounted: '0 $' });
        }
    };

    React.useEffect(() => {
        calculateResult();
    }, [groupSize, selectedCategory]);

    if (!price) {
        return <p>No price data available.</p>;
    }

    const groupedPrices = price
        ? Object.entries(price)
              .filter(([key]) => !['id', 'tour_id', 'created_at', 'updated_at'].includes(key))
              .reduce((acc, [key, value]) => {
                  const [category, groupSize] = key.split('|');
                  if (!acc[category]) {
                      acc[category] = [];
                  }
                  acc[category].push({ groupSize, price: value });
                  return acc;
              }, {})
        : {};

    const groupSizes = [...new Set(Object.values(groupedPrices).flat().map(item => item.groupSize))];

    return (
        <div className="mt-8">
            <h3 className="text-2xl font-semibold text-white bg-orange-300 header-waguer border-b-8 border-orange-300 p-3 text-center mb-4">
                Tour Prices {promo > 0 && <span className="ml-2 bg-red-500 text-white px-3 py-1 rounded-full text-sm">-{promo}% OFF!</span>}
            </h3>
            <p className="mb-6 text-lg font-verdana text-gray-700">The following prices are categorized by accommodation type and group size. Prices are quoted per person.</p>
            
            <table className="table-auto w-full border-collapse border border-gray-200">
                <thead className="bg-orange-100">
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
                                    const priceData = details.find(item => item.groupSize === size);
                                    const originalPrice = priceData ? priceData.price : null;
                                    const discountedPrice = originalPrice ? originalPrice * (1 - promo / 100) : null;
                                    
                                    return (
                                        <td key={size} className="border border-gray-300 px-4 py-2">
                                            {priceData ? (
                                                <div>
                                                    {promo > 0 && (
                                                        <span className="line-through text-gray-500">{originalPrice} $</span>
                                                    )}
                                                    <span className={`block font-bold ${promo > 0 ? 'text-green-600' : ''}`}>
                                                        {discountedPrice ? discountedPrice.toFixed(2) : originalPrice} $
                                                    </span>
                                                </div>
                                            ) : '-'}
                                        </td>
                                    );
                                })}
                            </tr>
                        </React.Fragment>
                    ))}
                </tbody>
            </table>

            <div className="shadow-lg p-4 bg-orange-50 mt-6">
                <h3 className="text-2xl font-semibold text-orange-500 p-3 text-center mb-4">Calculate Your Budget</h3>
                <div className="flex gap-6">
                    <div className="lg:w-1/2">
                        <label className="block text-gray-700 text-sm font-semibold mb-2">Group size:</label>
                        <Input
                            type="number"
                            min="1"
                            variant="orange"
                            placeholder="Group size"
                            className="px-4 py-3 border rounded-lg text-sm bg-white text-orange-700 font-semibold placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-orange-500 border-orange-600"
                            value={groupSize}
                            onChange={handleGroupSizeChange}
                        />
                    </div>
                    <div className="lg:w-1/2">
                        <label className="block text-gray-700 text-sm font-semibold mb-2">Category:</label>
                        <select
                            className="block w-full px-4 py-3 border rounded-lg text-sm bg-white text-orange-700 font-semibold placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-orange-500 border-orange-600"
                            value={selectedCategory}
                            onChange={handleCategoryChange}
                        >
                            <option value="" disabled>Select a category</option>
                            {Object.keys(groupedPrices).map((category) => (
                                <option key={category} value={category} className="text-orange-600 font-semibold">
                                    {category}
                                </option>
                            ))}
                        </select>
                    </div>
                </div>

                <div className="mt-4 flex flex-col items-center gap-2">
                    {promo > 0 && (
                        <div className="w-1/2 relative">
                            <Input
                                className="w-full text-center font-bold text-gray-500 line-through text-lg"
                                variant="orange"
                                value={result.original}
                                readOnly
                            />
                            <span className="absolute -right-16 top-1/2 -translate-y-1/2 bg-red-500 text-white px-2 py-1 rounded-full text-xs">
                                -{promo}%
                            </span>
                        </div>
                    )}
                    <Input
                        className="w-1/2 text-center font-bold text-green-600 text-lg"
                        variant="orange"
                        value={result.discounted}
                        readOnly
                    />
                </div>

                <div className="mt-4 text-orange-600 text-sm font-semibold">
                    <p>⚠️ Please note that the listed prices are for the standard trip package. Any additional activities not included in the itinerary will be subject to extra charges.</p>
                    <p>⚠️ An external fee may also apply depending on the specific requirements of your trip. Please check with us for further details.</p>
                    <p>⚠️ Please note that during January and December, there will be an additional 10% charge on every tour price. This seasonal adjustment applies to all bookings within these months.</p>
                </div>
            </div>
        </div>
    );
}

function categoryDescription(category) {
    const descriptions = {
        "3-stars": "Budget-friendly accommodation with essential amenities.",
        "4-stars": "Comfortable accommodation with additional amenities.",
        "4&5-stars": "Premium accommodation with high-end services.",
        "5-stars": "Luxury accommodation with world-class facilities."
    };
    return descriptions[category] || "Standard accommodation.";
}

function groupSizeDescription(groupSize) {
    const groupSizeDescriptions = {
        "2": "2 people (Couple or small group)",
        "3-4": "3 to 4 people (Small family or group of friends)",
        "5<n": "5 or more people (Large group)"
    };
    return groupSizeDescriptions[groupSize] || groupSize;
}

export default TourPrices;