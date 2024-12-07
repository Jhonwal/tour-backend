import { useEffect, useState } from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart";
import { LabelList, Pie, PieChart } from "recharts";
import useApi from "@/services/api";
import { getToken } from "@/services/getToken";

export function TourTypes() {
  const [chartData, setChartData] = useState([]);
  const [totalTours, setTotalTours] = useState(0);
  const [percentageChange, setPercentageChange] = useState(0);
  const [deferent, setDeferent] = useState(0);
  const api = useApi();

  useEffect(() => {
    // Fetch data from the Laravel API
    const token =  getToken();
    const headers = {
      Authorization: `Bearer ${token}`,
      "Content-Type": "application/json",
    };
    api.get("/api/tour-types/chart",{headers})
      .then((response) => {
        const data = response.data.chartData;
        setChartData(data);

        // Calculate the total number of tours
        const total = data.reduce((acc, curr) => acc + curr.tours, 0);
        setTotalTours(total);

        // Set percentage change and deferent values (assuming these exist in the response)
        setPercentageChange(response.data.percentageChange || 0);
        setDeferent(response.data.deferent || 0);
      })
      .catch((error) => {
        console.error("Error fetching tour type data:", error);
      });
  }, []);

  // Render loading state if chartData is empty
  if (chartData.length === 0) {
    return <div>Loading...</div>;
  }

  // Define colors for consistency
  const colorMapping = {};

  const chartConfig = {
    tours: {
      label: "Tours",
    },
    ...chartData.reduce((acc, curr) => {
      acc[curr.type] = {
        label: curr.type,
        color: colorMapping[curr.type] || curr.fill,
      };
      return acc;
    }, {}),
  };


  return (
    <Card className="flex flex-col bg-orange-300 bg-opacity-15">
      <CardHeader className="items-center pb-0">
        <CardTitle>Tour Type Distribution</CardTitle>
      </CardHeader>
      <CardContent className="flex-1 pb-0">
        <ChartContainer
          config={chartConfig}
          className="mx-auto aspect-square max-h-[200px]"
        >
          <PieChart>
            <ChartTooltip cursor={false} content={<ChartTooltipContent hideLabel />} />
            <Pie
              data={chartData}
              dataKey="tours"
              nameKey="type"
              innerRadius={60}
              strokeWidth={5}
            >
              <LabelList
                dataKey="tours"
                position="center"
                content={({ viewBox }) => {
                  if (viewBox && "cx" in viewBox && "cy" in viewBox) {
                    return (
                      <text x={viewBox.cx} y={viewBox.cy} textAnchor="middle" dominantBaseline="middle">
                        <tspan x={viewBox.cx} y={viewBox.cy} className="fill-foreground text-3xl font-bold">
                          {totalTours.toLocaleString()}
                        </tspan>
                        <tspan x={viewBox.cx} y={(viewBox.cy || 0) + 24} className="fill-muted-foreground">
                          Tours
                        </tspan>
                      </text>
                    );
                  }
                  return null;
                }}
              />
            </Pie>
          </PieChart>
        </ChartContainer>
      </CardContent>
      <CardFooter className="flex-col gap-2 text-sm">
        <div className="leading-none text-muted-foreground">
          Showing number of tours for each tour type
        </div>
      </CardFooter>
    </Card>
  );
}
