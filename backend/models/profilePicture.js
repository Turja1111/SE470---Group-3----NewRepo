import mongoose from 'mongoose';

const profile_pic_Schema = new mongoose.Schema({
  imageUrl: {
    type: String,
  },
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
});

const ProfilePicture = mongoose.model('ProfilePicture', profile_pic_Schema);
export default  ProfilePicture;
