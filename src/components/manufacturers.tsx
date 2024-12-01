"use client";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import Pagination from "@/components/ui/pagination";
import { Progress } from "@/components/ui/progress";
import { useState, useEffect, useCallback } from "react";

type Manufacturer = {
    Country: string;
    Mfr_CommonName: string;
    Mfr_ID: number;
    Mfr_Name: string;
    VehicleTypes: VehicleType[] | null;
    Makes: string[];
};

type VehicleType = {
    IsPrimary: boolean;
    Name: string;
};

const ManufacturersMakes = () => {
    const [manufacturers, setManufacturers] = useState<Manufacturer[]>([]);
    const [filteredData, setFilteredData] = useState<Manufacturer[]>([]);
    const [vehicleTypeName, setVehicleTypeName] = useState<string>("");
    const [searchQuery, setSearchQuery] = useState<string>("");
    const [loading, setLoading] = useState<boolean>(false);
    const [currentPage, setCurrentPage] = useState<number>(1);
    const [vehicleNames, setVehicleNames] = useState<string[]>([]);
    const itemsPerPage = 10;

    const fetchManufacturers = async (): Promise<void> => {
        setLoading(true);
        try {
            const response = await fetch(
                "https://vpic.nhtsa.dot.gov/api/vehicles/getallmanufacturers?format=json"
            );
            const data = await response.json();

            const manufacturers: Manufacturer[] = data.Results || [];
            setManufacturers(manufacturers);
            setFilteredData(manufacturers);

            const fetchedVehicleNames = manufacturers.reduce<string[]>((acc, manufacturer) => {
                if (manufacturer.Mfr_Name) acc.push(manufacturer.Mfr_Name); 
                return acc;
            }, []);
            setVehicleNames(fetchedVehicleNames);
        } catch (err) {
            console.error("Failed to fetch manufacturers", err);
        } finally {
            setLoading(false);
        }
    };

    const handleFilter = useCallback((): void => {
        const filtered = manufacturers.filter((manufacturer) =>
            (!vehicleTypeName || manufacturer.VehicleTypes?.some(vt => vt.Name.toLowerCase().includes(vehicleTypeName.toLowerCase()))) &&
            (!searchQuery || manufacturer.Mfr_Name.toLowerCase().includes(searchQuery.toLowerCase()))
        );
        setFilteredData(filtered);
    },[manufacturers, searchQuery, vehicleTypeName]);

    useEffect(() => {
        fetchManufacturers();
    }, []);

    useEffect(() => {
        handleFilter();
    }, [vehicleTypeName, searchQuery, handleFilter]);

    const indexOfLastItem = currentPage * itemsPerPage;
    const indexOfFirstItem = indexOfLastItem - itemsPerPage;
    const currentItems = filteredData.slice(indexOfFirstItem, indexOfLastItem);
    const totalPages = Math.ceil(filteredData.length / itemsPerPage);

    return (
        <div className="container mx-auto p-4">
            <h1 className="text-xl font-bold">Manufacturers and Makes</h1>
            <div className="mt-4 flex gap-4">
                <Input
                    placeholder="Search Manufacturers"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                />
                <Input
                    placeholder="Filter by Vehicle Type"
                    value={vehicleTypeName}
                    onChange={(e) => setVehicleTypeName(e.target.value)}
                />
            </div>

            {loading ? (
                <Progress className="mt-4" />
            ) : (
                <div>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-4">
                        {currentItems.map((manufacturer: Manufacturer) => (
                            <Card key={manufacturer.Mfr_ID} className="p-4">
                                <h2 className="font-bold">{manufacturer.Mfr_Name}</h2>
                                <p>{manufacturer.Country}</p>
                                <ul>
                                    {manufacturer.Makes?.map((make: string, index) => (
                                        <li key={index}>{make}</li>
                                    ))}
                                </ul>
                            </Card>
                        ))}
                    </div>

                    <Pagination
                        currentPage={currentPage}
                        totalPages={totalPages}
                        onPageChange={setCurrentPage}
                    />
                </div>
            )}
        </div>
    );
};

export default ManufacturersMakes;
