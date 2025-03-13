import multer from 'multer';

const upload = multer({dest: "/tmp/uploads"});

export default upload;