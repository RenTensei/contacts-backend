import multer from 'multer';

import { constants } from '@helpers';

const multerConfig = multer.diskStorage({
  destination: constants.tempStoragePath,
  filename: (req, file, cb) => {
    const fileExtension = file.originalname.split('.').pop();
    cb(null, `${req.body.user._id}_avatar.${fileExtension}`);
  }
});

const upload = multer({
  storage: multerConfig
});

export default upload;
