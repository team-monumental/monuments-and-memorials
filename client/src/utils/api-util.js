import * as AWS from 'aws-sdk';

// Constant for the S3 Bucket name for the project
const s3ImageBucketName = 'monuments-and-memorials';
// Constant for the S3 folder name where the Monument images are stored
const s3ImageBucketFolderName = 'images/';

const httpMethodTypes = ['GET', 'POST', 'PUT'];

/**
 * Send a GET request to the specified URL
 * @param url - URL to send the GET to
 */
export async function get(url) {
    return await sendRequest(url);
}

/**
 * Send a POST request to the specified URL with the specified data
 * @param url - URL to send the POST to
 * @param data - Data to send to the specified URL
 * @param contentType - The ContentType header, defaults to 'application/json'
 */
export async function post(url, data, contentType = 'application/json') {
    return await sendRequest(url, 'POST', data, undefined, contentType);
}

/**
 * Send a POST request to the specified URL with the specified file
 * @param url - URL to send the POST to
 * @param file - File to send to the specified URL
 */
export async function postFile(url, file) {
    return await sendRequest(url, 'POST', undefined, file);
}

/**
 * Send a PUT request to the specified URL with the specified data
 * @param url - URL to send the PUT to
 * @param data - Data to send to the specified URL
 * @param contentType - The ContentType header, defaults to 'application/json'
 */
export async function put(url, data, contentType = 'application/json') {
    return await sendRequest(url, 'PUT', data, undefined, contentType);
}

/**
 * Generic function to send an HTTP request to a specified URL
 * with specified data
 * @param url - URL to send the request to
 * @param methodType - String for the type of HTTP request to send
 *        Defaults to 'GET'
 * @param data - Data to send to the URL, Defaults to undefined
 * @param file - File to send to the URL, Defaults to undefined
 * @param contentType - The ContentType header, defaults to 'application/json'
 */
async function sendRequest(url, methodType='GET', data=undefined, file=undefined, contentType = 'application/json') {
    if (httpMethodTypes.includes(methodType) && url) {
        let error = null;

        let configuration = {
            method: methodType
        };

        if (data) {
            configuration.body = JSON.stringify(data);
            configuration.headers = {
                'Content-Type': contentType
            };
        }
        else if (file) {
            const formData = new FormData();
            formData.append('file', file);

            configuration.body = formData;
        }

        let res = await fetch(url, configuration)
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
}

/**
 * Uploads the specified images to the monument-images S3 bucket, inside the images/ folder
 * @param images - List of images to upload to S3
 * @returns {Promise<[]>} - Promise that when awaited, returns a List of S3 Object keys for the uploaded images
 */
export async function uploadImagesToS3(images) {
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
 * @param encodedObjectUrl - The encoded Object URL to use to parse the Image Object Key
 */
export function getS3ImageObjectKeyFromObjectUrl(encodedObjectUrl) {
    const decodedObjectUrl = decodeURIComponent(encodedObjectUrl);
    const decodedObjectUrlArray = decodedObjectUrl.split('/');
    return s3ImageBucketFolderName + decodedObjectUrlArray[decodedObjectUrlArray.length - 1];
}

/**
 * Helper function to get the Image name using the specified S3 Object URL
 * @param encodedObjectUrl - The encoded Object URL to use to parse the Image name
 */
export function getS3ImageNameFromObjectUrl(encodedObjectUrl) {
    const decodedObjectUrl = decodeURIComponent(encodedObjectUrl);
    const decodedObjectUrlArray = decodedObjectUrl.split('/');
    return decodedObjectUrlArray[decodedObjectUrlArray.length - 1];
}