const express = require("express");
const cors = require("cors");
const multer = require("multer");
const path = require("path");
const fs = require("fs");
const PDFDocument = require("pdfkit");
require("dotenv").config();

const app = express();
const PORT = process.env.PORT || 5000;

// Ensure uploads folder exists
const uploadsDir = path.join(__dirname, "uploads");
if (!fs.existsSync(uploadsDir)) fs.mkdirSync(uploadsDir);

// Ensure pdfs folder exists
const pdfsDir = path.join(__dirname, "pdfs");
if (!fs.existsSync(pdfsDir)) fs.mkdirSync(pdfsDir);

// Configure multer storage
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, uploadsDir);
  },
  filename: (req, file, cb) => {
    const safeName = `${Date.now()}-${file.originalname.replace(/\s+/g, "-")}`;
    cb(null, safeName);
  },
});
const upload = multer({ storage });

app.use(
  cors({
    origin: process.env.FRONTEND_ORIGIN || "http://localhost:3000",
    methods: ["GET", "POST", "OPTIONS"],
  })
);
app.use(express.json());

// Serve static files from uploads and pdfs directories
app.use("/uploads", express.static(uploadsDir));
app.use("/pdfs", express.static(pdfsDir));

// Simple health check
app.get("/", (req, res) => res.send({ ok: true }));

// Function to generate PDF
function generatePDF(formData, files, pdfPath) {
  return new Promise((resolve, reject) => {
    try {
      const doc = new PDFDocument({ margin: 50, size: "A4" });
      const stream = fs.createWriteStream(pdfPath);

      doc.pipe(stream);

      // Header
      doc
        .fontSize(24)
        .fillColor("#2c3e50")
        .text("ADMISSION FORM", { align: "center" })
        .moveDown(0.5);

      doc
        .fontSize(10)
        .fillColor("#7f8c8d")
        .text(`Application ID: ${Date.now()}`, { align: "center" })
        .text(`Date: ${new Date().toLocaleDateString()}`, { align: "center" })
        .moveDown(1.5);

      // Draw a line
      doc
        .strokeColor("#3498db")
        .lineWidth(2)
        .moveTo(50, doc.y)
        .lineTo(550, doc.y)
        .stroke()
        .moveDown(1);

      // Helper function to add section
      const addSection = (title) => {
        doc.moveDown(0.5);
        doc
          .fontSize(14)
          .fillColor("#2980b9")
          .text(title, { underline: true })
          .moveDown(0.5);
      };

      // Helper function to add field
      const addField = (label, value) => {
        doc.fontSize(11).fillColor("#2c3e50").text(label, { continued: true });
        doc
          .fillColor("#34495e")
          .text(`: ${value || "N/A"}`)
          .moveDown(0.3);
      };

      // Add photo if exists
      const photoFile = files.find((f) => f.fieldname === "photo");
      if (photoFile) {
        try {
          doc.image(photoFile.path, 450, 150, { width: 100, height: 100 });
        } catch (err) {
          console.log("Could not add photo to PDF:", err.message);
        }
      }

      // Personal Information
      addSection("PERSONAL INFORMATION");
      addField("First Name", formData.firstName);
      addField("Surname", formData.surName);
      addField("Date of Birth", formData.dob);
      addField("Gender", formData.gender);
      addField("Nationality", formData.nationality);
      addField("Aadhar Number", formData.aadhar);
      addField("Category", formData.category);

      // Contact Information
      addSection("CONTACT INFORMATION");
      addField("Permanent Address", formData.permanentAddress);
      addField("Correspondence Address", formData.correspondenceAddress);
      addField("Email ID", formData.email);
      addField("Phone Number", formData.phone);
      addField("Alternate Phone Number", formData.altPhone);

      // Academic Information
      addSection("ACADEMIC INFORMATION");
      addField("Previous School/College", formData.prevSchool);

      doc
        .fontSize(12)
        .fillColor("#2980b9")
        .text("10th Standard:", { underline: false })
        .moveDown(0.3);
      addField("  Year of Passing", formData.yearOfPassing10);
      addField("  Board of Education", formData.board10);
      addField("  Percentage/CGPA", formData.percentage10);

      doc.moveDown(0.3);
      doc
        .fontSize(12)
        .fillColor("#2980b9")
        .text("12th Standard:", { underline: false })
        .moveDown(0.3);
      addField("  Year of Passing", formData.yearOfPassing12);
      addField("  Board of Education", formData.board12);
      addField("  Percentage/CGPA", formData.percentage12);

      // Course Information
      addSection("COURSE INFORMATION");
      addField("Selected Course", formData.course);

      // Guardian Information
      addSection("GUARDIAN INFORMATION");

      doc
        .fontSize(12)
        .fillColor("#2980b9")
        .text("Father's Details:", { underline: false })
        .moveDown(0.3);
      addField("  Name", formData.fatherName);
      addField("  Occupation", formData.fatherOccupation);
      addField("  Contact Number", formData.fatherContact);

      doc.moveDown(0.3);
      doc
        .fontSize(12)
        .fillColor("#2980b9")
        .text("Mother's Details:", { underline: false })
        .moveDown(0.3);
      addField("  Name", formData.motherName);
      addField("  Occupation", formData.motherOccupation);
      addField("  Contact Number", formData.motherContact);

      doc.moveDown(0.3);
      addField("Guardian's Address", formData.guardianAddress);
      addField("Annual Family Income", formData.annualIncome);

      // Footer
      doc.moveDown(2);
      doc
        .strokeColor("#3498db")
        .lineWidth(1)
        .moveTo(50, doc.y)
        .lineTo(550, doc.y)
        .stroke()
        .moveDown(1);

      doc
        .fontSize(10)
        .fillColor("#7f8c8d")
        .text("This is a system-generated document.", { align: "center" })
        .text("For any queries, please contact the admission office.", {
          align: "center",
        });

      doc.end();

      stream.on("finish", () => resolve(pdfPath));
      stream.on("error", reject);
    } catch (err) {
      reject(err);
    }
  });
}

// Route to accept the form submission
app.post("/submit", upload.any(), async (req, res) => {
  try {
    console.log("Received fields:", req.body);
    console.log(
      "Received files:",
      req.files?.map((f) => f.filename)
    );

    const savedFiles = (req.files || []).map((f) => ({
      fieldname: f.fieldname,
      originalname: f.originalname,
      filename: f.filename,
      path: f.path,
    }));

    // Generate PDF
    const pdfFilename = `admission-${Date.now()}.pdf`;
    const pdfPath = path.join(pdfsDir, pdfFilename);

    await generatePDF(req.body, savedFiles, pdfPath);

    // Save submission record
    const submissionsFile = path.join(__dirname, "submissions.json");
    const submissionRecord = {
      id: Date.now(),
      timestamp: new Date().toISOString(),
      fields: req.body,
      files: savedFiles,
      pdfFile: pdfFilename,
      pdfUrl: `/pdfs/${pdfFilename}`,
    };

    let existing = [];
    if (fs.existsSync(submissionsFile)) {
      try {
        existing = JSON.parse(fs.readFileSync(submissionsFile));
      } catch (e) {
        existing = [];
      }
    }
    existing.push(submissionRecord);
    fs.writeFileSync(submissionsFile, JSON.stringify(existing, null, 2));

    res.json({
      message: "Form submitted successfully",
      submission: submissionRecord,
      pdfUrl: `http://localhost:${PORT}/pdfs/${pdfFilename}`,
    });
  } catch (err) {
    console.error("Submission error:", err);
    res.status(500).json({ error: "Server error while processing submission" });
  }
});

// Start server
app.listen(PORT, () =>
  console.log(`Server listening on http://localhost:${PORT}`)
);
