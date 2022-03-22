import { PDFDocument } from "pdf-lib";
import * as fs from "fs";


const mergePdf = async (filenames : string[], saveFile : string) => {
    const pdfDoc = await PDFDocument.create();
    if (filenames && saveFile) {
        let i:number = 0;
        while (i < filenames.length) {
            const file = filenames[i];
            // Read pdf file as bytes (Uint8array) and load as a PDFDocument
            const pdfBytes = fs.readFileSync(file);
            const graphDoc = await PDFDocument.load(pdfBytes);

            // Copy first page to the pdfDoc
            const [page] = await pdfDoc.copyPages(graphDoc, [0]);
            pdfDoc.addPage(page);

            // Delete the individual pdfs
            fs.unlink(file, (err) => {
                if (err)
                    console.log(err);
            });
            if (filenames.splice(i, 1).length > 0) {
                i--;
            }
            i++;
        }

        // Save the merged pdf file
        const pdfBytes = await pdfDoc.save();
        fs.writeFile("apps/cli/data/" + saveFile, pdfBytes, (err) => {
            if (err) {
                console.log(err);
            } else {
                console.log("Successfully written to " + saveFile);
            }
        });
    }
};

export default mergePdf;