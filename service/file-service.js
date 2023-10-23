const multer = require('multer');
const path = require('path');

const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, 'uploads/') // укажите папку для сохранения файлов
    },
    filename: function (req, file, cb) {
        // Сохранение файла с оригинальным именем или вы можете изменить имя файла, как хотите
        cb(null, Date.now() + path.extname(file.originalname))
    }
})

const upload = multer({ storage: storage });

module.exports = upload;