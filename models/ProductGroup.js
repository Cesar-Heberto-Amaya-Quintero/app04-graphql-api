import mongoose from 'mongoose';

const {Schema} = mongoose;

const ProductGroupSchema = new Schema({
    name: String
});

export default mongoose.model('ProductGroup', ProductGroupSchema);