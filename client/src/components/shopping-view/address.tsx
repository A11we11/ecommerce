import { useEffect, useState, type FormEvent } from "react";
import CommonForm from "../common/form";
import { Card, CardContent, CardHeader, CardTitle } from "../ui/card";
import { addressFormControls } from "@/config";
import { useSelector } from "react-redux";
import {
  addNewAddress,
  deleteAddress,
  editaAddress,
  fetchAllAddresses,
} from "@/store/shop/address-slice";
import AddressCard from "./address-card";

import type {
  Address,
  AddressCardProps,
  AddressFormData,
  RootState,
} from "@/types";
import { useAppDispatch } from "@/hooks/redux";
import { toast } from "sonner";

const initialAddressFormData: AddressFormData = {
  address: "",
  city: "",
  phone: "",
  pincode: "",
  notes: "",
};

function AddressView({
  setCurrentSelectedAddress,
  selectedId,
}: AddressCardProps) {
  const [formData, setFormData] = useState<AddressFormData>(
    initialAddressFormData
  );
  const [currentEditedId, setCurrentEditedId] = useState<string | null>(null);
  const dispatch = useAppDispatch();
  const { user } = useSelector((state: RootState) => state.auth);
  const { addressList } = useSelector((state: RootState) => state.shopAddress);

  function handleManageAddress(event: FormEvent) {
    event.preventDefault();

    if (addressList.length >= 3 && currentEditedId === null) {
      setFormData(initialAddressFormData);
      toast.error("You can add max 3 addresses");

      return;
    }

    /* currentEditedId !== null
      ? dispatch(
          editaAddress({
            userId: user?.id,
            addressId: currentEditedId,
            formData,
          })
        ).then((data: any) => {
          if (data?.payload?.success) {
            if (user?.id) {
              dispatch(fetchAllAddresses(user.id));
            }
            setCurrentEditedId(null);
            setFormData(initialAddressFormData);
            toast({
              title: "Address updated successfully",
            });
          }
        })
      : dispatch(
          addNewAddress({
            ...formData,
            userId: user?.id,
          })
        ).then((data: any) => {
          if (data?.payload?.success) {
            if (user?.id) {
              dispatch(fetchAllAddresses(user.id));
            }
            setFormData(initialAddressFormData);
            toast({
              title: "Address added successfully",
            });
          }
        }); */
    if (currentEditedId !== null) {
      const payload = {
        userId: user?.id,
        addressId: currentEditedId,
        formData,
      };

      dispatch(editaAddress(payload)).then((data: any) => {
        if (data?.payload?.success) {
          if (user?.id) {
            dispatch(fetchAllAddresses(user.id));
          }
          setCurrentEditedId(null);
          setFormData(initialAddressFormData);
          toast.success("Address updated successfully");
        } else {
          console.warn("❌ editaAddress failed:", data?.payload);
        }
      });
    } else {
      const payload = {
        userId: user?.id,
        formData,
      };

      dispatch(addNewAddress(payload)).then((data: any) => {
        if (data?.payload?.success) {
          if (user?.id) {
            dispatch(fetchAllAddresses(user.id));
          }
          setFormData(initialAddressFormData);
          toast.success("Address added successfully");
        } else {
          console.warn("❌ addNewAddress failed:", data?.payload);
        }
      });
    }
  }

  /*  function handleDeleteAddress(getCurrentAddress: Address) {
    if (!getCurrentAddress._id) return;
    dispatch(
      deleteAddress({ userId: user?.id, addressId: getCurrentAddress._id })
    ).then((data: any) => {
      if (data?.payload?.success) {
        if (user?.id) {
          dispatch(fetchAllAddresses(user.id));
        }
        toast({
          title: "Address deleted successfully",
        });
      }
    });
  } */

  function handleDeleteAddress(getCurrentAddress: Address) {
    if (!getCurrentAddress._id) return;

    const payload = {
      userId: user?.id,
      addressId: getCurrentAddress._id,
    };

    dispatch(deleteAddress(payload)).then((data: any) => {
      if (data?.payload?.success) {
        if (user?.id) {
          dispatch(fetchAllAddresses(user.id));
        }
        toast.success("Address deleted successfully");
      } else {
        console.warn("❌ deleteAddress failed:", data?.payload);
      }
    });
  }

  function handleEditAddress(getCurrentAddress: Address) {
    if (getCurrentAddress?._id) {
      setCurrentEditedId(getCurrentAddress?._id);
    }

    setFormData({
      ...formData,
      address: getCurrentAddress?.address,
      city: getCurrentAddress?.city,
      phone: getCurrentAddress?.phone,
      pincode: getCurrentAddress?.pincode,
      notes: getCurrentAddress?.notes,
    });
  }

  /*  function isFormValid(): boolean {
    return Object.keys(formData)
      .map((key: string) => formData[key].trim() !== "")
      .every((item: boolean) => item);
  } */

  function isFormValid(): boolean {
    return Object.keys(formData)
      .map((key: string) => {
        const value = formData[key];
        // Convert numbers/null to string before trim
        return String(value ?? "").trim() !== "";
      })
      .every((item: boolean) => item);
  }

  /* 
String(value ?? "") → safely converts number | string | null into a string.
.trim() works only on strings, so no more type error.
?? "" ensures null becomes an empty string, not "null".

The error comes because not all fields in formData are guaranteed to be string — some might be number (like price, averageReview) or null. Numbers don’t have .trim().
*/

  /*   useEffect(() => {
    if (user?.id) {
      dispatch(fetchAllAddresses(user.id));
    }
  }, [dispatch]);

  console.log(addressList, "addressList"); */

  useEffect(() => {
    if (user?.id) {
      dispatch(fetchAllAddresses(user.id));
    }
  }, [dispatch]);

  return (
    <Card>
      <div className="mb-5 p-3 grid grid-cols-1 sm:grid-cols-2  gap-2">
        {addressList && addressList.length > 0
          ? addressList.map((singleAddressItem: Address) => (
              <AddressCard
                key={singleAddressItem._id}
                selectedId={selectedId}
                handleDeleteAddress={handleDeleteAddress}
                addressInfo={singleAddressItem}
                handleEditAddress={handleEditAddress}
                setCurrentSelectedAddress={setCurrentSelectedAddress}
              />
            ))
          : null}
      </div>
      <CardHeader>
        <CardTitle>
          {currentEditedId !== null ? "Edit Address" : "Add New Address"}
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-3">
        <CommonForm
          formControls={addressFormControls}
          formData={formData}
          setFormData={setFormData}
          buttonText={currentEditedId !== null ? "Edit" : "Add"}
          onSubmit={handleManageAddress}
          isBtnDisabled={!isFormValid()}
        />
      </CardContent>
    </Card>
  );
}

export default AddressView;
