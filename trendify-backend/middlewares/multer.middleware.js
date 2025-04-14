import multer from 'multer';

const storage = multer.memoryStorage(); // Lưu file vào RAM thay vì ổ cứng

const upload = multer({ storage });

export default upload;
