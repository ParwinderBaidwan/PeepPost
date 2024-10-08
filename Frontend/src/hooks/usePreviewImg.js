import  { useState } from 'react'
import useShowToast from './useShowToast';

const usePreviewImg = () => {
    const [imgUrl, setImageUrl] = useState(null);
    const showToast = useShowToast();

    const handleImageChange = (e) => {
        const file = e.target.files[0];
        // console.log(file);

        if(file && file.type.startsWith("image/")){
            const reader = new FileReader();

            reader.onloadend = () => {
                setImageUrl(reader.result);
            }

            reader.readAsDataURL(file);
        } else{
            showToast("Invalid file type", "Please select an image file", "error");
            setImageUrl(null);
        }
    };
    // console.log(imgUrl);
  return {handleImageChange, imgUrl, setImageUrl};
}

export default usePreviewImg;