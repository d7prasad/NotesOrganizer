const express = require('express');
const multer = require('multer');
const ejs = require('ejs');
const path = require('path');

// Set Storage Engine
const storage = multer.diskStorage({
    destination: './public/uploads',
    filename: function(req, file, cb){
        cb(null, file.fieldname + '-' + Date.now() + 
        path.extname(file.originalname));
    }
});

// Init upload
const upload = multer({
    storage : storage,
    limits: {fileSize: 100000} // Setting file size limit to 1MB
    // limits: {fileSize: 100000}, // To restrict any file upload to particular format alone.
    // fileFilter: function (req, file, cb){
    //     checkFileType(file, cb);
    //  }
}).single('myImage');

// Below function is to restrict the upload format to Image.
function checkFileType(file, cb){
    // Allowed extension 
    const filetypes = /jpeg|jpg|png|gif/;
    // Check ext
    const extname = filetypes.test(path.extname(file.originalname).toLowerCase());
    // Check Mime
    const mimetype = filetypes.test(file.mimeType);

    if(mimetype && extname){
        return (null,true);
    }else{
        cb('Error: Images only!');
    }
}

//Init app
const app = express();

// EJS
app.set('view engine', 'ejs');

// Public Folder
app.use(express.static('./public'));


app.get('/', (req, res) => res.render('index'));


app.get('/add', (req, res) => res.render('upload'));

app.post('/upload', (req, res) => {
    upload(req, res, (err) => {
        if(err){
            res.render('upload', {
                msg: err
            });
        }else{
           if(req.file == undefined){
            res.render('upload', {
                msg: 'Error: No File Selected!'
            });
           } else{
                res.render('upload', {
                    msg: 'File Uploaded!'
                    // msg: 'File Uploaded!', // To display the image back to the browser upon submit
                    // file: `uploads/${req.file.filename}`
                });
           } 
        }
    })
})

const port = 4000;

app.listen(port, ()=> console.log(`Server started on port ${port}`));



