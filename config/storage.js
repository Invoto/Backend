const { S3Client } = require("@aws-sdk/client-s3");

const BucketPaths = {
    Volunteer: {
        Public: "volunteer/public",
    },
};

const BucketURLS = {
    Volunteer: {
        Public: "https://" + process.env.INVOTO_DO_SPACES_BUCKET + "." + process.env.INVOTO_DO_SPACES_REGION + ".cdn.digitaloceanspaces.com/" + BucketPaths.Volunteer.Public,
    }
}

const uploaderClient = new S3Client({
    endpoint: process.env.INVOTO_DO_SPACES_ENDPOINT,
    region: process.env.INVOTO_DO_SPACES_REGION,
    credentials: {
        accessKeyId: process.env.INVOTO_DO_SPACES_KEY,
        secretAccessKey: process.env.INVOTO_DO_SPACES_SECRET,
    }
});

module.exports = {
    uploaderClient,
    BucketPaths,
    BucketURLS,
};
