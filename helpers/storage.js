const { PutObjectCommand } = require("@aws-sdk/client-s3");
const { uploaderClient, BucketPaths, BucketURLS } = require("../config/storage");
const fs = require("fs");

function uploadFileToStorage(bucketPath, imageFile, onSuccess, onFailure) {
    let bucketFilePath = bucketPath + "/" + imageFile.filename;

    fs.readFile(imageFile.path, (err, imageFileData) => {
        if (err) {
            onFailure(err);
        }
        else {
            let uploaderParams = {
                Bucket: process.env.INVOTO_DO_SPACES_BUCKET,
                Key: bucketFilePath,
                Body: imageFileData,
                ACL: "public-read",
            };

            uploaderClient.send(new PutObjectCommand(uploaderParams)).then((data) => {
                onSuccess(data);
            }, (error) => {
                onFailure(error);
            });
        }
    });
}

function uploadFileToExtractionStorage(imageFile, onSuccess, onFailure) {
    uploadFileToStorage(BucketPaths.Extraction.Public, imageFile, onSuccess, onFailure);
}

function uploadFileToVolunteerStorage(imageFile, onSuccess, onFailure) {
    uploadFileToStorage(BucketPaths.Volunteer.Public, imageFile, onSuccess, onFailure);
}

function getBucketURL(bucketPath, imageFile) {
    return bucketPath + "/" + encodeURIComponent(imageFile.filename);
}

function getBucketExtractionURL(imageFile) {
    return getBucketURL(BucketURLS.Extraction.Public, imageFile);
}

function getBucketVolunteerURL(imageFile) {
    return getBucketURL(BucketURLS.Volunteer.Public, imageFile);
}

module.exports = {
    uploadFileToStorage,
    uploadFileToExtractionStorage,
    uploadFileToVolunteerStorage,
    getBucketURL,
    getBucketExtractionURL,
    getBucketVolunteerURL,
};
