import React, { useState, useEffect } from 'react';

const API_BASE = process.env.REACT_APP_API_URL || 'http://localhost:5000';
const INITIAL_FORM = { deviceId: '', name: '', deviceType: '', room: '', brand: '', model: '', quantity: 1, status: 'Đang sử dụng', purchaseDate: '', description: '' };

function App() {
  const [devices, setDevices] = useState([]);
  const [search, setSearch] = useState('');
  const [form, setForm] = useState(INITIAL_FORM);
  const [editingId, setEditingId] = useState(null);

  const fetchDevices = async (keyword = '') => {
    try {
      const url = keyword ? `${API_BASE}/api/devices?search=${encodeURIComponent(keyword)}` : `${API_BASE}/api/devices`;
      const res = await fetch(url);
      const data = await res.json();
      setDevices(data);
    } catch (err) { alert('Lỗi tải dữ liệu!'); }
  };

  useEffect(() => { fetchDevices(); }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const url = editingId ? `${API_BASE}/api/devices/${editingId}` : `${API_BASE}/api/devices`;
      const method = editingId ? 'PUT' : 'POST';
      const res = await fetch(url, { method, headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ ...form, quantity: Number(form.quantity) }) });
      if (!res.ok) { const err = await res.json(); throw new Error(err.message); }
      alert(editingId ? 'Cập nhật thành công!' : 'Thêm mới thành công!');
      setForm(INITIAL_FORM); setEditingId(null); fetchDevices(search);
    } catch (err) { alert(err.message); }
  };

  const handleEdit = (device) => {
    setEditingId(device.deviceId); setForm(device); window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleDelete = async (id, name) => {
    if (!window.confirm(`Xóa thiết bị ${name}?`)) return;
    await fetch(`${API_BASE}/api/devices/${id}`, { method: 'DELETE' });
    fetchDevices(search);
  };

  const getStatusClass = (status) => {
    if (status === 'Đang sử dụng') return 'badge status-active';
    if (status === 'Hư hỏng') return 'badge status-broken';
    if (status === 'Đang sửa chữa') return 'badge status-repair';
    return 'badge status-stopped';
  };

  return (
    <div className="container">
      <header><h1>Hệ Thống Quản Lý Thiết Bị</h1><span>235238 - Lê Thị Yến Oanh</span></header>
      
      <div className="card">
        <h3>{editingId ? 'Sửa Thiết Bị' : 'Thêm Thiết Bị'}</h3>
        <form onSubmit={handleSubmit}>
          <div className="form-grid">
            <div className="form-group"><label>Mã TB (*)</label><input required value={form.deviceId} onChange={e => setForm({...form, deviceId: e.target.value})} disabled={!!editingId} /></div>
            <div className="form-group"><label>Tên TB (*)</label><input required value={form.name} onChange={e => setForm({...form, name: e.target.value})} /></div>
            <div className="form-group"><label>Loại TB (*)</label><input required value={form.deviceType} onChange={e => setForm({...form, deviceType: e.target.value})} /></div>
            <div className="form-group"><label>Phòng (*)</label><input required value={form.room} onChange={e => setForm({...form, room: e.target.value})} /></div>
            <div className="form-group"><label>Hãng (*)</label><input required value={form.brand} onChange={e => setForm({...form, brand: e.target.value})} /></div>
            <div className="form-group"><label>Model (*)</label><input required value={form.model} onChange={e => setForm({...form, model: e.target.value})} /></div>
            <div className="form-group"><label>Số lượng (*)</label><input type="number" min="0" required value={form.quantity} onChange={e => setForm({...form, quantity: e.target.value})} /></div>
            <div className="form-group">
              <label>Tình trạng (*)</label>
              <select value={form.status} onChange={e => setForm({...form, status: e.target.value})}>
                <option value="Đang sử dụng">Đang sử dụng</option><option value="Hư hỏng">Hư hỏng</option>
                <option value="Đang sửa chữa">Đang sửa chữa</option><option value="Ngừng sử dụng">Ngừng sử dụng</option>
              </select>
            </div>
            <div className="form-group"><label>Ngày mua (*)</label><input type="date" required value={form.purchaseDate} onChange={e => setForm({...form, purchaseDate: e.target.value})} /></div>
          </div>
          <div style={{ marginTop: 15 }}><button type="submit" className="btn-primary">Lưu lại</button> {editingId && <button type="button" className="btn-secondary" onClick={() => {setEditingId(null); setForm(INITIAL_FORM);}}>Hủy</button>}</div>
        </form>
      </div>

      <div className="card">
        <form className="toolbar" onSubmit={e => { e.preventDefault(); fetchDevices(search); }}>
          <input placeholder="Tìm theo mã, tên, phòng..." value={search} onChange={e => setSearch(e.target.value)} />
          <button type="submit" className="btn-primary">Tìm kiếm</button>
        </form>
        <table>
          <thead><tr><th>Mã TB</th><th>Tên</th><th>Loại</th><th>Phòng</th><th>SL</th><th>Trạng thái</th><th>Thao tác</th></tr></thead>
          <tbody>
            {devices.map(item => (
              <tr key={item._id}>
                <td>{item.deviceId}</td><td>{item.name}</td><td>{item.deviceType}</td><td>{item.room}</td><td>{item.quantity}</td>
                <td><span className={getStatusClass(item.status)}>{item.status}</span></td>
                <td>
                  <button className="btn-warning" onClick={() => handleEdit(item)}>Sửa</button>
                  <button className="btn-danger" onClick={() => handleDelete(item.deviceId, item.name)}>Xóa</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
export default App;
