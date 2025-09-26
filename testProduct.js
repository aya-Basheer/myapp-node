require('dotenv').config();
const mongoose = require('mongoose');
const Product = require('./models/productModel'); // تأكد من المسار الصحيح

// اتصال بـ MongoDB
mongoose.connect(process.env.MONGO_URI || 'mongodb://127.0.0.1:27017/myapp', {
  useNewUrlParser: true,
  useUnifiedTopology: true,
})
.then(() => console.log('✅ Connected to MongoDB for testing'))
.catch(err => console.error('❌ MongoDB connection error:', err));

async function testProductModel() {
  try {
    // إنشاء منتج تجريبي
    const product = new Product({
      name: "Test Product",
      price: 50,
      description: "منتج تجريبي للتأكد من النموذج"
    });

    // حفظه في القاعدة
    await product.save();
    console.log("✅ Product saved successfully!");

    // قراءة المنتجات من القاعدة
    const products = await Product.find({});
    console.log("Products in DB:", products);

  } catch (err) {
    console.error("❌ Error testing ProductModel:", err);
  } finally {
    // إنهاء الاتصال بعد الاختبار
    mongoose.connection.close();
  }
}

// تشغيل الاختبار
testProductModel();
