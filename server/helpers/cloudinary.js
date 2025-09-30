/* const cloudinary = require("cloudinary").v2;
const multer = require("multer");

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

const storage = new multer.memoryStorage();

async function imageUploadUtil(file) {
  const result = await cloudinary.uploader.upload(file, {
    resource_type: "auto",
  });

  return result;
}

const upload = multer({ storage });

module.exports = { upload, imageUploadUtil };
 */

const cloudinary = require("cloudinary").v2;
const multer = require("multer");

// Configure Cloudinary with explicit options
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
  secure: true, // Use HTTPS
});

// Test function to verify configuration
const testCloudinaryConfig = () => {
  console.log("Testing Cloudinary config...");
  console.log("Cloud name:", cloudinary.config().cloud_name);
  console.log("API key:", cloudinary.config().api_key);
  console.log("API secret exists:", !!cloudinary.config().api_secret);
  console.log("Secure mode:", cloudinary.config().secure);
};

testCloudinaryConfig();

const storage = new multer.memoryStorage();

async function imageUploadUtil(file) {
  try {
    // Use current timestamp to avoid signature issues
    const timestamp = Math.round(Date.now() / 1000);

    const result = await cloudinary.uploader.upload(file, {
      resource_type: "auto",
      timestamp: timestamp,
      // Add folder organization (optional)
      folder: "ecommerce-uploads",
      // Ensure unique filename
      use_filename: true,
      unique_filename: true,
    });

    console.log("Upload successful:", {
      public_id: result.public_id,
      secure_url: result.secure_url,
    });

    return result;
  } catch (error) {
    console.error("Cloudinary upload error:", {
      message: error.message,
      name: error.name,
      http_code: error.http_code,
    });
    throw error;
  }
}

const upload = multer({ storage });

module.exports = { upload, imageUploadUtil };
