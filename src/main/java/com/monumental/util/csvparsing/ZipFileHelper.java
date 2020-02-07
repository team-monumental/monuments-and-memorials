package com.monumental.util.csvparsing;

import com.opencsv.CSVReader;
import org.springframework.web.multipart.MultipartFile;

import java.io.*;
import java.nio.file.Files;
import java.nio.file.Paths;
import java.util.ArrayList;
import java.util.List;
import java.util.zip.ZipEntry;
import java.util.zip.ZipFile;

/**
 * Class that defines methods for interfacing with .zip files
 */
public class ZipFileHelper {

    /**
     * Converts a Spring MultipartFile to a ZipFile
     * The easiest way to accomplish this is by creating a temporary file and using the temp file
     * to create the ZipFile
     * @param multipartFile - MultipartFile to convert to a ZipFile
     * @return ZipFile - ZipFile representation of the MultipartFile
     * @throws IOException - If any I/O errors occur while converting the MultipartFile
     */
    public static ZipFile convertMultipartFileToZipFile(MultipartFile multipartFile) throws IOException {
        File tempFile = File.createTempFile("temp", null);
        // Transfer the contents of the MultipartFile to the temp File
        multipartFile.transferTo(tempFile);
        // Create a new ZipFile using the temp File
        ZipFile zipFile = new ZipFile(tempFile);
        // Delete the temp File
        tempFile.delete();

        return zipFile;
    }

    /**
     * Read all of the contents of a CSV file ZipEntry into a List of Strings split on newline characters
     * @param zipFile - ZipFile that the csvFileZipEntry belongs to
     * @param csvFileZipEntry - ZipEntry for the CSV file to read into a List of Strings
     * @return List<String> - Entire contents of the CSV file ZipEntry, split on newlines
     */
    public static List<String[]> readEntireCsvFileFromZipEntry(ZipFile zipFile, ZipEntry csvFileZipEntry) {
        try {
            InputStream csvFileInputStream = zipFile.getInputStream(csvFileZipEntry);
            InputStreamReader csvFileInputStreamReader = new InputStreamReader(csvFileInputStream);
            BufferedReader csvFileBufferedReader = new BufferedReader(csvFileInputStreamReader);
            CSVReader reader = new CSVReader(csvFileBufferedReader);
            return reader.readAll();
        } catch (IOException e) {
            return new ArrayList<>();
        }
    }

    /**
     * Convert a specified ZipEntry to a File object
     * The easiest way to accomplish this is to use a temp File and transfer the contents of the ZipEntry
     * into the temp File
     * @param zipFile - The ZipFile that the ZipEntry belongs to
     * @param zipEntry - The ZipEntry to convert to a File
     * @return File - File object representation of the ZipEntry
     * @throws IOException - If any I/O errors occur when reading from the ZipFile or ZipEntry
     */
    public static File convertZipEntryToFile(ZipFile zipFile, ZipEntry zipEntry) throws IOException {

        // Get the system's temp directory path
        String tempDirectoryPath = System.getProperty("java.io.tmpdir");

        String pathName = tempDirectoryPath + "/" + zipEntry.getName();

        // In case the application left an unusual state, delete the temp image if it exists
        Files.deleteIfExists(Paths.get(pathName));

        // Get the contents of the ZipEntry
        InputStream zipEntryInputStream = zipFile.getInputStream(zipEntry);

        // Copy the contents of the ZipEntry into a temp File inside the Temp directory
        Files.copy(zipEntryInputStream, Paths.get(pathName));

        // Get a File object for the new temp File
        return new File(pathName);
    }

    /**
     * Determine if the specified filePath points to a .zip file
     * @param filePath - The path to the file to check, as a String
     * @return boolean - True if the file extension of the filePath is ".zip", false otherwise
     */
    public static boolean isZipFile(String filePath) {
        String[] fileExtensionArray = filePath.split("\\.");
        String fileExtension = fileExtensionArray[fileExtensionArray.length - 1];

        return fileExtension.equals("zip");
    }
}
