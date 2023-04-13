import * as AWS from 'aws-sdk';

// Constant for the S3 Bucket name for the project
const s3ImageBucketName = 'monuments-and-memorials';
// Constant for the S3 folder name where the Monument images are stored
const s3ImageFolderName = 'images/';
// Constant for the S3 folder name where temporary Monument images are stored
const s3TemporaryImageFolderName = 'temp/';

const httpMethodTypes = ['GET', 'POST', 'PUT', 'DELETE'];

/**
 * Send a GET request to the specified URL
 * @param url - URL to send the GET to
 * @param options - Optional params
 * @param options.returnFullError - If true, the full error object will be returned instead of just error text
 */
export async function get(url, options = {}) {
    return await sendRequest(url, options);
}

/**
 * Send a POST request to the specified URL with the specified data
 * @param url - URL to send the POST to
 * @param data - Data to send to the specified URL
 * @param contentType - The ContentType header, defaults to 'application/json'
 */
export async function post(url, data, contentType = 'application/json') {
    return await sendRequest(url, {
        methodType: 'POST', data, contentType
    });
}

/**
 * Send a POST request to the specified URL with the specified file
 * @param url - URL to send the POST to
 * @param file - File to send to the specified URL
 */
export async function postFile(url, file) {
    return await sendRequest(url, {
        methodType: 'POST',
        file
    });
}

/**
 * Send a PUT request to the specified URL with the specified data
 * @param url - URL to send the PUT to
 * @param data - Data to send to the specified URL
 * @param contentType - The ContentType header, defaults to 'application/json'
 */
export async function put(url, data, contentType = 'application/json') {
    return await sendRequest(url, {
        methodType: 'PUT', data, contentType
    });
}

/**
 * Send a DELETE request to the specified URL with the specified data
 * "delete" is a reserved keyword in javascript, so this function is named "del"
 * @param url - URL to send the DELETE to
 * @param data - Data to send to the specified URL
 * @param options - Optional params
 * @param options.returnFullError - If true, the full error object will be returned instead of just error text
 * @param options.contentType - The ContentType header, defaults to 'application/json'
 */
export async function del(url, data, options) {
    return await sendRequest(url, {
        methodType: 'DELETE', data, ...options
    });
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
 * @param returnFullError - If true, the full error object will be returned instead of just error text
 */
async function sendRequest(url, {methodType='GET', data=undefined, file=undefined,
    contentType = 'application/json', returnFullError = false}) {
    if (httpMethodTypes.includes(methodType) && url) {
        let error = null;

        let configuration = {
            method: methodType
        };

        if (data) {
            configuration.body = JSON.stringify(data);
            configuration.headers = {
                'Content-Type': contentType,
                credentials: 'include'
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
                    if (returnFullError) throw res;
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
        if (error || (res && res.error)) throw(error || (res && res.error));
        else return res;
    }
}

/**
 * Uploads the specified images to the monument-images S3 bucket, inside the images/ folder
 * @param images - List of images to upload to S3
 * @param temporaryFolder - True to upload the images to the temporary folder, False otherwise
 * @returns {Promise<[]>} - Promise that when awaited, returns a List of S3 Object keys for the uploaded images
 */
export async function uploadImagesToS3(images, temporaryFolder) {
    // Setup the global AWS config

    let imageUrls = [];
    const folderName = temporaryFolder ? s3TemporaryImageFolderName : s3ImageFolderName;

    for (const image of images) {
        let key = generateUniqueKey(folderName + image.name)

        // Create an S3 upload
        let s3Upload = new AWS.S3.ManagedUpload({
            params: {
                Bucket: s3ImageBucketName,
                Key: key,
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
    const decodedObjectUrl = decodeURIComponent(encodedObjectUrl.replace(/\+/g, ' '));
    const decodedObjectUrlArray = decodedObjectUrl.split('/');
    return s3ImageFolderName + decodedObjectUrlArray[decodedObjectUrlArray.length - 1];
}

/**
 * Helper function to get the Image name using the specified S3 Object URL
 * @param encodedObjectUrl - The encoded Object URL to use to parse the Image name
 */
export function getS3ImageNameFromObjectUrl(encodedObjectUrl) {
    const decodedObjectUrl = decodeURIComponent(encodedObjectUrl.replace(/\+/g, ' '));
    const decodedObjectUrlArray = decodedObjectUrl.split('/');
    return decodedObjectUrlArray[decodedObjectUrlArray.length - 1];
}

function generateUniqueKey(objectKey) {
    let number = 0;

    while (!isUniqueKey(objectKey)) {
        const checkRegex = ".*\\([0-9]+\\)$";
        const captureRegex = "\\(([0-9]+)\\)$";
        // If the key already ends with "(1)", for example
        if (objectKey.matches(checkRegex)) {
            const substring = objectKey.match(captureRegex)
            number = parseInt(substring[1].replace('(', '').replace(')', ''));
            number++;
            objectKey = objectKey.replaceAll(captureRegex, "(" + number + ")");
        } else {
            objectKey += " (1)";
        }
    }

    return objectKey;
}

async function isUniqueKey(objectKey) {
    // Create a new AWS S3 Client
    const s3Client = new AWS.S3();

    try {
        try {
            await s3Client.headObject({ Bucket: s3ImageBucketName, Key: objectKey }).promise();
            return false
        } catch (headErr) {
            if (headErr.code === 'NotFound') {
                return true
            }
        }
    } catch (e) {
        console.log("Error attempting to access S3 Bucket: " + s3ImageBucketName + " and Object: " + objectKey);
        console.log(e);
        return true;
    }
}
