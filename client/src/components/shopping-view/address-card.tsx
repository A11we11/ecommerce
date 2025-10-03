import type { AddressCardProps } from "@/types";
import { Button } from "../ui/button";
import { Card, CardContent, CardFooter } from "../ui/card";
import { Label } from "../ui/label";
import { Check } from "lucide-react";

function AddressCard({
  addressInfo,
  handleDeleteAddress,
  handleEditAddress,
  setCurrentSelectedAddress,
  selectedId,
}: AddressCardProps) {
  return (
    <Card
      /* onClick={
        setCurrentSelectedAddress 
          ? () => setCurrentSelectedAddress(addressInfo)
          : undefined
      } */
      onClick={
        setCurrentSelectedAddress && addressInfo
          ? () => setCurrentSelectedAddress(addressInfo)
          : undefined
      }
      /*  className={`cursor-pointer border-red-700 ${
        
        selectedId === addressInfo?._id
          ? "border-red-900 border-[4px]"
          : "border-black"
      }`} */

      className={`cursor-pointer transition-all ${
        selectedId?._id === addressInfo?._id
          ? "border-red-900 border-[4px]"
          : "border-red-700 border-2"
      }`}
    >
      <CardContent className="grid p-4 gap-4 relative">
        {/*  */}

        {selectedId?._id === addressInfo?._id && (
          <div className="absolute top-2 right-2 bg-black rounded-full p-1">
            <Check className="w-4 h-4 text-white" />
          </div>
        )}
        {/*  */}
        <Label>Address: {addressInfo?.address}</Label>
        <Label>City: {addressInfo?.city}</Label>
        <Label>pincode: {addressInfo?.pincode}</Label>
        <Label>Phone: {addressInfo?.phone}</Label>
        <Label>Notes: {addressInfo?.notes}</Label>
      </CardContent>
      <CardFooter className="p-3 flex justify-between">
        <Button onClick={() => addressInfo && handleEditAddress?.(addressInfo)}>
          Edit
        </Button>
        <Button
          onClick={() => addressInfo && handleDeleteAddress?.(addressInfo)}
        >
          Delete
        </Button>
      </CardFooter>
    </Card>
  );
}

export default AddressCard;
