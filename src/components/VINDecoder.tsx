'use client'

import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { useState } from 'react'

type Vehicle = {
    Make: string;
    Model: string;
    ModelYear: number;
    BodyClass: string;
    EngineModel: string;
}

const VinDecoder = function VinDecoder() {
    const [vin, setVin] = useState<string>('')
    const [vehicleData, setVehicleData] = useState<Vehicle[] | []>([])
    const [error, setError] = useState<string>('')
  

    const handleSearch = async () => {
        if (vin.length !== 17) {
            setError('Invalid VIN. A VIN must be 17 characters long.')
            return
        }
        setError('')
        try {
            const response = await fetch(`https://vpic.nhtsa.dot.gov/api/vehicles/DecodeVinValues/${vin}?format=json`)
            const data = await response.json()

            if (data.Results && data.Results.length > 0) {
                setVehicleData(data.Results)
            } else {
                setError('No vehicle data found for the provided VIN.')
                setVehicleData([])
            }
        } catch (error: unknown) {
            console.error(error);
            setError('Failed to fetch vehicle data. Please try again later.')
            setVehicleData([])
        }
    }
    
    return (
        <div className='p-4 flex flex-col gap-5'>
            <Input
                placeholder="Search Vehicle by its VIN"
                value={vin}
                onChange={(e) => setVin(e.target.value)}
            />
            <Button className='w-48' onClick={handleSearch}>Search</Button>

            {error && <p className="text-red-500">{error}</p>}

            {vehicleData ?  vehicleData.map((vehicle: Vehicle, index) => (
                <div key={index} className="mt-4 p-4 border border-gray-300 rounded-md">
                    <h3 className="text-xl font-bold">Vehicle Information</h3>
                    <ul>
                        <li><strong>Make:</strong> {vehicle.Make}</li>
                        <li><strong>Model:</strong> {vehicle.Model}</li>
                        <li><strong>Year:</strong> {vehicle.ModelYear}</li>
                        <li><strong>Body Type:</strong> {vehicle.BodyClass}</li>
                        <li><strong>Engine Model:</strong> {vehicle.EngineModel}</li>
                    </ul>
                </div>
            )):null}
        </div>
    )
}

export default VinDecoder
