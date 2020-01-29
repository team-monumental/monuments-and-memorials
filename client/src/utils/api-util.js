import * as AWS from "aws-sdk";

// Constant for the S3 Bucket name where the Monument images are stored
const s3ImageBucketName = 'monument-images';
// Constant for the S3 folder name where the Monument images are stored
const s3ImageBucketFolderName = 'images/';

/**
 * Send a GET request to the specified url
 * @param url - URL to send the GET to
 */
export async function get(url) {
    let error = null;
    let res = await fetch(url)
        .then(async (res) => {
            if (!res.ok) {
                let errorMessage = await res.text();

                try {
                    errorMessage = JSON.parse(errorMessage);
                } catch (error) {}

                throw Error(errorMessage.message);
            }
            return res;
        })
        .then(res => res.json())
        .catch(err => error = err);
    if (error || res.error) throw(error || res.error);
    else return res;
}

/**
 * Send a POST request to the specified url with the specified data
 * @param url - URL to send the POST to
 * @param data - JSON data to send to the specified URL
 * @param contentType - The ContentType header, defaults to 'application/json'
 */
export async function post(url, data, contentType = 'application/json') {
    let error = null;
    let res = await fetch(url, {
        method: 'POST',
        body: JSON.stringify(data),
        headers: {
            'Content-Type': contentType
        }
    })
        .then(async (res) => {
            if (!res.ok) {
                let errorMessage = await res.text();

                try {
                    errorMessage = JSON.parse(errorMessage);
                } catch (error) {}

                throw Error(errorMessage.message);
            }
            return res;
        })
        .then(res => res.json())
        .catch(err => error = err);
    if (error || res.error) throw(error || res.error);
    else return res;
}

/**
 * Send a POST request to the specified url with the specified file
 * @param url - URL to send the POST to
 * @param file - File data to send to the specified URL
 */
export async function postFile(url, file) {
    let error = null;

    const formData = new FormData();
    formData.append('file', file);

    let res = await fetch(url, {
        method: 'POST',
        body: formData
    })
        .then(async (res) => {
            if (!res.ok) {
                let errorMessage = await res.text();

                try {
                    errorMessage = JSON.parse(errorMessage);
                } catch (error) {}

                throw Error(errorMessage.message);
            }
            return res;
        })
        .then(res => res.json())
        .catch(err => error = err);
    if (error || res.error) throw(error || res.error);
    else return res;
}

/**
 * Send a PUT request to the specified url with the specified data
 * @param url - URL to send the PUT to
 * @param data - JSON data to send to the specified URL
 */
export async function put(url, data) {
    let error = null;
    let res = await fetch(url, {
        method: 'PUT',
        body: JSON.stringify(data),
        headers: {
            'Content-Type': 'application/json'
        }
    })
        .then(async (res) => {
            if (!res.ok) {
                let errorMessage = await res.text();

                try {
                    errorMessage = JSON.parse(errorMessage);
                } catch (error) {}

                throw Error(errorMessage.message);
            }
            return res;
        })
        .then(res => res.json())
        .catch(err => error = err);
    if (error || res.error) throw(error || res.error);
    else return res;
}

/**
 * Uploads the specified images to the monument-images S3 bucket, inside the images/ folder
 * @param images - List of images to upload to S3
 * @returns {Promise<[]>} - Promise that when awaited, returns a List of S3 Object keys for the uploaded images
 */
export default async function uploadImagesToS3(images) {
    // Setup the global AWS config
    AWS.config.update({
        region: 'us-east-2',
        accessKeyId: `${process.env.REACT_APP_AWS_ACCESS_KEY_ID}`,
        secretAccessKey: `${process.env.REACT_APP_AWS_SECRET_ACCESS_KEY}`
    });

    let imageUrls = [];

    for (const image of images) {
        // Create an S3 upload
        let s3Upload = new AWS.S3.ManagedUpload({
            params: {
                Bucket: s3ImageBucketName,
                Key: s3ImageBucketFolderName + image.name,
                Body: image,
                ACL: 'public-read'
            }
        });

        try {
            // Execute the upload
            let data = await s3Upload.promise();
            imageUrls.push(data.Location);
        } catch (err) {
            console.log("ERROR UPLOADING IMAGE TO S3: " + image.name);
            console.log("ERROR: " + err.message);
        }
    }

    return imageUrls;
}

export async function deleteImagesFromS3(imageUrls) {
    // Setup the global AWS config
    AWS.config.update({
        region: 'us-east-2',
        accessKeyId: `${process.env.REACT_APP_AWS_ACCESS_KEY_ID}`,
        secretAccessKey: `${process.env.REACT_APP_AWS_SECRET_ACCESS_KEY}`
    });

    // Create a new AWS S3 Client
    const s3Client = new AWS.S3();

    // Setup parameters
    const params = {
        Bucket: s3ImageBucketName
    };

    for (const imageUrl of imageUrls) {
        params['Key'] = getS3ImageObjectKeyFromObjectUrl(imageUrl);

        try {
            // Execute the delete operation
            await s3Client.deleteObject(params).promise();
        } catch (err) {
            console.log("ERROR DELETING IMAGE FROM S3: " + imageUrl);
            console.log("ERROR: " + err.message);
        }
    }
}

/**
 * Helper function to get the S3 Object Key for an Image using the specified Object URL
 * @param objectUrl - The Object URL to use to parse the Image Object Key
 */
function getS3ImageObjectKeyFromObjectUrl(objectUrl) {
    const objectUrlArray = objectUrl.split('/');
    return s3ImageBucketFolderName + objectUrlArray[objectUrlArray.length - 1];
}

/**
 * Helper function to get the Image name using the specified S3 Object URL
 * @param objectUrl - The Object URL to use to parse the Image name
 */
export function getS3ImageNameFromObjectUrl(objectUrl) {
    const objectUrlArray = objectUrl.split('/');
    return objectUrlArray[objectUrlArray.length - 1];
}