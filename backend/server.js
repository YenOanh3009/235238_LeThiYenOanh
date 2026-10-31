require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const sampleDevices = require('./sample-devices.json');

const app = express();
const PORT = process.env.PORT || 5000;
const MONGODB_URI = process.env.MONGODB_URI;

app.use(cors());
app.use(express.json());

const VALID_STATUSES = ['Đang sử dụng', 'Hư hỏng', 'Đang sửa chữa', 'Ngừng sử dụng'];

const deviceSchema = new mongoose.Schema(
  {
    deviceId: { type: String, required: true, unique: true, trim: true },
    name: { type: String, required: true, trim: true },
    deviceType: { type: String, required: true, trim: true },
    room: { type: String, required: true, trim: true },
    brand: { type: String, required: true, trim: true },
    model: { type: String, required: true, trim: true },
    quantity: { type: Number, required: true, min: 0 },
    status: { type: String, required: true, enum: VALID_STATUSES },
    purchaseDate: { type: String, required: true, trim: true },
    description: { type: String, default: '', trim: true }
  },
  { timestamps: true, collection: 'devices' }
);

const Device = mongoose.model('Device', deviceSchema);

function validateInput(body) {
  const required = ['deviceId', 'name', 'deviceType', 'room', 'brand', 'model', 'quantity', 'status', 'purchaseDate'];
  for (const field of required) {
    if (body[field] === undefined || body[field] === null || String(body[field]).trim() === '') {
      return `Trường ${field} là bắt buộc.`;
    }
  }
  if (Number.isNaN(Number(body.quantity)) || Number(body.quantity) < 0) {
    return 'Số lượng (quantity) phải là số không âm.';
  }
  if (!VALID_STATUSES.includes(body.status)) {
    return `Tình trạng chỉ nhận một trong các giá trị: ${VALID_STATUSES.join(', ')}`;
  }
  return null;
}

// 1. Endpoint kiểm tra sức khỏe hệ thống
app.get('/health', (req, res) => {
  res.status(200).json({
    status: 'OK',
    database: mongoose.connection.readyState === 1 ? 'connected' : 'disconnected',
    student: '235238_LeThiYenOanh'
  });
});

// 2. Lấy danh sách hoặc tìm kiếm thiết bị (?search=...)
app.get('/api/devices', async (req, res) => {
  try {
    const { search } = req.query;
    let filter = {};
    if (search && search.trim() !== '') {
      const regex = new RegExp(search.trim(), 'i');
      filter = {
        $or: [
          { deviceId: regex },
          { name: regex },
          { deviceType: regex },
          { room: regex },
          { brand: regex },
          { status: regex }
        ]
      };
    }
    const devices = await Device.find(filter).sort({ createdAt: -1 });
    res.status(200).json(devices);
  } catch (err) {
    res.status(500).json({ message: 'Lỗi khi lấy danh sách thiết bị', error: err.message });
  }
});

// 3. Xem chi tiết 1 thiết bị
app.get('/api/devices/:id', async (req, res) => {
  try {
    const { id } = req.params;
    let device = mongoose.Types.ObjectId.isValid(id) ? await Device.findById(id) : null;
    if (!device) device = await Device.findOne({ deviceId: id });
    if (!device) return res.status(404).json({ message: 'Không tìm thấy thiết bị' });
    res.status(200).json(device);
  } catch (err) {
    res.status(500).json({ message: 'Lỗi khi xem chi tiết thiết bị', error: err.message });
  }
});

// 4. Thêm thiết bị mới
app.post('/api/devices', async (req, res) => {
  try {
    const errorMsg = validateInput(req.body);
    if (errorMsg) return res.status(400).json({ message: errorMsg });

    const exists = await Device.findOne({ deviceId: req.body.deviceId.trim() });
    if (exists) {
      return res.status(409).json({ message: `Mã thiết bị "${req.body.deviceId.trim()}" đã tồn tại!` });
    }

    const created = await Device.create({
      ...req.body,
      deviceId: req.body.deviceId.trim(),
      quantity: Number(req.body.quantity)
    });
    res.status(201).json({ message: 'Thêm thiết bị thành công', data: created });
  } catch (err) {
    res.status(400).json({ message: 'Lỗi khi thêm thiết bị', error: err.message });
  }
});

// 5. Cập nhật thiết bị
app.put('/api/devices/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const errorMsg = validateInput(req.body);
    if (errorMsg) return res.status(400).json({ message: errorMsg });

    let target = mongoose.Types.ObjectId.isValid(id) ? await Device.findById(id) : null;
    if (!target) target = await Device.findOne({ deviceId: id });
    if (!target) return res.status(404).json({ message: 'Không tìm thấy thiết bị cần cập nhật' });

    const duplicate = await Device.findOne({
      deviceId: req.body.deviceId.trim(),
      _id: { $ne: target._id }
    });
    if (duplicate) {
      return res.status(409).json({ message: `Mã thiết bị "${req.body.deviceId.trim()}" bị trùng với thiết bị khác!` });
    }

    Object.assign(target, {
      ...req.body,
      deviceId: req.body.deviceId.trim(),
      quantity: Number(req.body.quantity)
    });
    const updated = await target.save();
    res.status(200).json({ message: 'Cập nhật thiết bị thành công', data: updated });
  } catch (err) {
    res.status(400).json({ message: 'Lỗi khi cập nhật thiết bị', error: err.message });
  }
});

// 6. Xóa thiết bị
app.delete('/api/devices/:id', async (req, res) => {
  try {
    const { id } = req.params;
    let deleted = mongoose.Types.ObjectId.isValid(id) ? await Device.findByIdAndDelete(id) : null;
    if (!deleted) deleted = await Device.findOneAndDelete({ deviceId: id });
    if (!deleted) return res.status(404).json({ message: 'Không tìm thấy thiết bị cần xóa' });
    res.status(200).json({ message: 'Đã xóa thiết bị thành công', data: deleted });
  } catch (err) {
    res.status(500).json({ message: 'Lỗi khi xóa thiết bị', error: err.message });
  }
});

async function start() {
  try {
    await mongoose.connect(MONGODB_URI, { dbName: '235238_LeThiYenOanh' });
    console.log('Đã kết nối MongoDB Atlas: 235238_LeThiYenOanh');

    const count = await Device.countDocuments();
    if (count === 0) {
      await Device.insertMany(sampleDevices);
      console.log('Đã tự động nạp 3 thiết bị mẫu vào collection devices.');
    }

    app.listen(PORT, () => console.log(`Server đang chạy tại cổng ${PORT}`));
  } catch (err) {
    console.error('Lỗi kết nối CSDL:', err.message);
    process.exit(1);
  }
}

start();