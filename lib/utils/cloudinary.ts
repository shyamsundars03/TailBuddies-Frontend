export const uploadToCloudinary = async (file: File): Promise<string> => {
    const cloudName = process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME?.trim();
    const uploadPreset = (process.env.NEXT_PUBLIC_CLOUDINARY_UPLOAD_PRESET || 'ml_default').trim();

    if (!cloudName) {
        throw new Error('Cloudinary cloud name is not configured');
    }

    const formData = new FormData();
    formData.append('file', file);
    formData.append('upload_preset', uploadPreset);

    // console.log('CLOUDINARY_DEBUG: Starting upload', { cloudName, uploadPreset });
    
    
    const uploadUrl = `https://api.cloudinary.com/v1_1/${cloudName}/image/upload`;

    // console.log('CLOUDINARY_DEBUG: POSTing to', uploadUrl);




    try {
        const response = await fetch(
            uploadUrl,
            {
                method: 'POST',
                body: formData,
            }
        );

        if (!response.ok) {
            throw new Error('Upload failed');
        }

        const data = await response.json();
        return data.secure_url;

        
    } catch (error) {
        console.error('Cloudinary upload error:', error);
        throw error;
    }
};
