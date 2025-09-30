import ProductImageUpload from "@/components/admin-view/image-upload";
import { Button } from "@/components/ui/button";
import { useAppDispatch } from "@/hooks/redux";
import { addFeatureImage, getFeatureImages } from "@/store/common-slice";
import type { FeatureImage, RootState } from "@/types";
import { useEffect, useState } from "react";
import { useSelector } from "react-redux";

function AdminDashboard() {
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [uploadedImageUrl, setUploadedImageUrl] = useState("");
  const [imageLoadingState, setImageLoadingState] = useState(false);
  const dispatch = useAppDispatch();
  const { featureImageList } = useSelector(
    (state: RootState) => state.commonFeature
  );

  console.log(uploadedImageUrl, "uploadedImageUrl");

  function handleUploadFeatureImage() {
    dispatch(addFeatureImage(uploadedImageUrl)).then((data: any) => {
      if (data?.payload?.success) {
        dispatch(getFeatureImages());
        setImageFile(null);
        setUploadedImageUrl("");
      }
    });
  }

  useEffect(() => {
    dispatch(getFeatureImages());
  }, [dispatch]);

  console.log(featureImageList, "featureImageList");

  return (
    <div>
      <ProductImageUpload
        imageFile={imageFile}
        setImageFile={setImageFile}
        uploadedImageUrl={uploadedImageUrl}
        setUploadedImageUrl={setUploadedImageUrl}
        setImageLoadingState={setImageLoadingState}
        imageLoadingState={imageLoadingState}
        isCustomStyling={true}
        isEditMode={false}
      />
      <Button onClick={handleUploadFeatureImage} className="mt-5 w-full">
        Upload
      </Button>
      <div className="flex flex-col gap-4 mt-5">
        {featureImageList && featureImageList.length > 0
          ? featureImageList.map(
              (featureImgItem: FeatureImage, index: number) => (
                <div key={index} className="relative">
                  <img
                    src={featureImgItem.image}
                    className="w-full h-[300px] object-cover rounded-t-lg"
                  />
                </div>
              )
            )
          : null}
      </div>
    </div>
  );
}

export default AdminDashboard;
