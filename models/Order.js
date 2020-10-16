import mongoose from 'mongoose';

const {Schema} = mongoose;

const ProductSchema = new Schema({
    user: String,
    price: String,
    
});

export default mongoose.model('Order', ProductSchema);