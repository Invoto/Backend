const { PutObjectCommand } = require("@aws-sdk/client-s3");
const { uploaderClient, BucketPaths, BucketURLS } = require("../config/storage");
const fs = require("fs");

function uploadFileToStorage(imageFile, onSuccess, onFailure) {
    let bucketFilePath = BucketPaths.Volunteer.Public + "/" + imageFile.filename;

    fs.readFile(imageFile.path, (err, imageFileData) => {
        if (err) {
            onFailure(err);
        }
        else {
            let uploaderParams = {
                Bucket: process.env.INVOTO_DO_SPACES_BUCKET,
                Key: bucketFilePath,
                Body: imageFileData,
            };

            uploaderClient.send(new PutObjectCommand(uploaderParams)).then((data) => {
                onSuccess(data);
            }, (error) => {
                onFailure(error);
            });
        }
    });
}

function getBucketURL(imageFile) {
    return BucketURLS.Volunteer.Public + "/" + encodeURIComponent(imageFile.filename);
}

module.exports = {
    uploadFileToStorage,
    getBucketURL,
};
