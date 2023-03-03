
const Grid = require("gridfs-stream");
const multer = require("multer");
const path = require("path");
const express = require("express");
const mongodb = require('mongodb');
const router = express.Router();
const connection = require('../database');
const { GridFsStorage } = require('multer-gridfs-storage');
const mongoose = require("mongoose");
//const connUrl = `mongodb+srv://chrisdias2311:uniExmembers2311@serverlessinstance0.a8eqn.mongodb.net/?retryWrites=true&w=majority`

async function deleteimg(fileid) {
    let gridfsBucket;

    mongoose.connect(connUrl);
    //const db =mongoose.connection;
    mongoose.connection.once("open", async () => {
        gridfsBucket = new mongoose.mongo.GridFSBucket(mongoose.connections[0].db, {
            bucketName: "uploads",
        });
        try {


            const del = await gridfsBucket.delete(mongoose.Types.ObjectId(fileid));
            console.log(del);

        }
        catch (err) {
            console.log(err);
        }
    })

}

module.exports = { deleteimg };