const Grid = require("gridfs-stream");
const multer = require("multer");
const path = require("path");
const express = require("express");
const router = express.Router();
const { GridFsStorage } = require('multer-gridfs-storage');
const mongoose = require("mongoose");
// require("dotenv").config({ path: path.resolve(__dirname, '../.env') });

const gfs = { grid: undefined }
let gridfsBucket;

const dev = `mongodb+srv://uniexadmins:UniEXCOOL987654@serverlessinstance0.8jjmz.mongodb.net/dev?retryWrites=true&w=majority`;
const production = `mongodb+srv://uniexadmins:UniEXCOOL987654@serverlessinstance0.8jjmz.mongodb.net/production?retryWrites=true&w=majority`;

// Make the bucket in GFS
mongoose.connection.once("open", () => {
    gridfsBucket = new mongoose.mongo.GridFSBucket(mongoose.connections[0].db, {
        bucketName: 'uploads'
    });

    gfs.grid = Grid(mongoose.connections[0].db, mongoose.mongo);
    gfs.grid.collection("uploads");

    console.log("Connected...");
}).on("error", function (error) {
    console.log("error is:", error);
});


// Store the files in the bucket 
const storage = new GridFsStorage({
    url: production,
    file: (req, file) => {
        return new Promise((resolve, reject) => {

            const filename = `${file.originalname}_${Date.now()}${req.body.email}${path.extname(file.originalname)}`
            const fileInfo = {
                filename: filename,
                bucketName: 'uploads'
            };
            resolve(fileInfo);

        });
    }
});

const upload = multer({
    storage: storage
});

router.use("/api/images", express.static("uploads/images"))

// @route GET /files
// @desc  Display all files in JSON
router.get('/api/files', (req, res) => {
    gfs.grid.files.find().toArray((err, files) => {
        // Check if files
        if (!files || files.length === 0) {
            return res.status(404).json({
                err: 'No files exist'
            });
        }

        // Files exist
        return res.json(files);
    });
});


// @route GET /files/:filename
// @desc  Display single file object
router.get('/api/files/:filename', (req, res) => {
    gfs.grid.files.findOne({ filename: req.params.filename }, (err, file) => {
        // Check if file
        if (!file || file.length === 0) {
            return res.status(404).json({
                err: 'No file exists'
            });
        }
        // File exists
        return res.json(file);
    });
});


router.get('/:filename', (req, res) => {
    gfs.grid.files.findOne({ filename: req.params.filename }, (err, file) => {
        // Check if file
        if (!file || file.length === 0) {
            return res.status(404).json({
                err: 'No file exists'
            });
        }

        // Check if image
        if (file.contentType === 'image/jpeg' || file.contentType === 'image/png') {
            // Read output to browser
            const readStream = gridfsBucket.openDownloadStream(file._id);
            readStream.pipe(res);
        } else {
            res.status(404).json({
                err: 'Not an image'
            });
        }
    });
});



module.exports = { router, upload, gfs }