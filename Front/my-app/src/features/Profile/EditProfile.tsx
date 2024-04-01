import { useDispatch, useSelector } from "react-redux";
import { selectProfileImage, selectToken, selectUserID } from "../Presite/login/loginSlice";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { editProfileAsync, fetchProfile, selectProfile } from "./profileSlice";
import { AppDispatch } from "../../app/store";

export function EditProfile() {
  const token = useSelector(selectToken);
  const dispatch: AppDispatch = useDispatch();
  const navigate = useNavigate();
  const userID = useSelector(selectUserID)
  const [image, setImage] = useState<File | null>(null);
  const [address, setAddress] = useState<string>('');
  const [dob, setDob] = useState<string>(''); 
  
  const profileImage = useSelector(selectProfileImage);
  const profile = useSelector(selectProfile);
  
  useEffect(() => {
    if (!token) {
      navigate('/');
    }
  }, [token, navigate]);
  
  const handleImageChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = event.target.files;
    if (files && files.length > 0) {
      setImage(files[0]);
    }
  };
  
  
  const editProfile = async () => {
    const formData = new FormData();
    formData.append('profile_image', image as File);
    formData.append('address', address);
    formData.append('dob', dob);
    
    dispatch(editProfileAsync({ token, formData })); 
    if (userID) { 
      dispatch(fetchProfile({ token, userID: Number(userID) })); 
    }
  };
  
  return (
    <div>
      <h2> Edit Your Profile</h2>
      <div>
        <input type="file" onChange={handleImageChange} accept="image/*" />
        <input type="text" placeholder="Address" value={address} onChange={(e) => setAddress(e.target.value)} />
        <input type="date" placeholder="Date of Birth" value={dob} onChange={(e) => setDob(e.target.value)} />
        <button onClick={editProfile}>Save</button>
      </div>
    </div>
  );
}
