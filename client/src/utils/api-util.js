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
        .then(res => res.json())
        .catch(err => error = err);
    if (error || res.error) throw(error || res.error);
    else return res;
}

/**
 * Send a POST request to the specified url with the specified data
 * @param url - URL to send the POST to
 * @param data - JSON data to send to the specified URL
 */
export async function post(url, data) {
    let error = null;
    let res = await fetch(url, {
        method: 'POST',
        body: JSON.stringify(data),
        headers: {
            'Content-Type': 'application/json'
        }
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
                const resText = await res.text();
                const resJson = JSON.parse(resText);
                throw Error(resJson.message);
            }
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