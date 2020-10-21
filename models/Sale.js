import mongoose from 'mongoose';

const {Schema} = mongoose;

const SaleSchema = new Schema({
    productId: String,
    orderId: String,
    timeStamp: Date
    
});

export default mongoose.model('Sale', SaleSchema);