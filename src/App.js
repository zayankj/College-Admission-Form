import React, { useState } from "react";
import "./App.css";

function App() {
  return (
    <div className="App">
      <AdmissionForm />
    </div>
  );
}

function AdmissionForm() {
  const [step, setStep] = useState(1);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submissionSuccess, setSubmissionSuccess] = useState(false);
  const [pdfUrl, setPdfUrl] = useState("");

  // State variables for form fields
  const [formData, setFormData] = useState({
    firstName: "",
    surName: "",
    dob: "",
    gender: "",
    nationality: "",
    aadhar: "",
    category: "",
    photo: null,
    permanentAddress: "",
    correspondenceAddress: "",
    email: "",
    phone: "",
    altPhone: "",
    prevSchool: "",
    yearOfPassing10: "",
    board10: "",
    percentage10: "",
    yearOfPassing12: "",
    board12: "",
    percentage12: "",
    marksheet10: null,
    marksheet12: null,
    course: "",
    fatherName: "",
    fatherOccupation: "",
    fatherContact: "",
    motherName: "",
    motherOccupation: "",
    motherContact: "",
    guardianAddress: "",
    annualIncome: "",
  });

  const nextStep = (e) => {
    e.preventDefault();
    if (validateForm()) {
      setStep(step + 1);
    }
  };

  const prevStep = () => {
    setStep(step - 1);
  };

  const validateForm = () => {
    const form = document.getElementById("admissionForm");
    const currentStepFields = form.querySelectorAll(
      `[data-step="${step}"] input, [data-step="${step}"] select`
    );
    for (const field of currentStepFields) {
      if (!field.checkValidity()) {
        field.reportValidity();
        return false;
      }
    }
    return true;
  };

  const handleChange = (e) => {
    const { name, value, type, files } = e.target;
    setFormData({
      ...formData,
      [name]: type === "file" ? files[0] : value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);

    const formDataToSend = new FormData();
    for (const key in formData) {
      formDataToSend.append(key, formData[key]);
    }

    try {
      const response = await fetch("http://localhost:5000/submit", {
        method: "POST",
        body: formDataToSend,
      });

      if (!response.ok) {
        throw new Error("Network response was not ok");
      }

      const data = await response.json();
      console.log("Success:", data);

      // Set PDF URL and show success message
      setPdfUrl(data.pdfUrl);
      setSubmissionSuccess(true);
      setStep(7); // Move to success step
    } catch (error) {
      console.error("Error:", error);
      alert("There was an error with your submission. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDownloadPDF = () => {
    window.open(pdfUrl, "_blank");
  };

  const handleNewSubmission = () => {
    // Reset form
    setFormData({
      firstName: "",
      surName: "",
      dob: "",
      gender: "",
      nationality: "",
      aadhar: "",
      category: "",
      photo: null,
      permanentAddress: "",
      correspondenceAddress: "",
      email: "",
      phone: "",
      altPhone: "",
      prevSchool: "",
      yearOfPassing10: "",
      board10: "",
      percentage10: "",
      yearOfPassing12: "",
      board12: "",
      percentage12: "",
      marksheet10: null,
      marksheet12: null,
      course: "",
      fatherName: "",
      fatherOccupation: "",
      fatherContact: "",
      motherName: "",
      motherOccupation: "",
      motherContact: "",
      guardianAddress: "",
      annualIncome: "",
    });
    setStep(1);
    setSubmissionSuccess(false);
    setPdfUrl("");
  };

  return (
    <div className="form-container">
      <form id="admissionForm">
        <h2>Admission Form</h2>

        {step === 1 && (
          <div data-step="1">
            <h3>Personal Information</h3>
            <label htmlFor="firstName">First Name:</label>
            <input
              type="text"
              id="firstName"
              name="firstName"
              required
              value={formData.firstName}
              onChange={handleChange}
            />
            <br />
            <br />
            <label htmlFor="surName">Surname Name:</label>
            <input
              type="text"
              id="surName"
              name="surName"
              required
              value={formData.surName}
              onChange={handleChange}
            />
            <br />
            <br />
            <label htmlFor="dob">Date of Birth:</label>
            <input
              type="date"
              id="dob"
              name="dob"
              required
              value={formData.dob}
              onChange={handleChange}
            />
            <br />
            <br />
            <label htmlFor="gender">Gender:</label>
            <select
              id="gender"
              name="gender"
              required
              value={formData.gender}
              onChange={handleChange}
            >
              <option value="">Select Gender</option>
              <option value="Male">Male</option>
              <option value="Female">Female</option>
              <option value="Other">Other</option>
            </select>
            <br />
            <br />
            <label htmlFor="nationality">Nationality:</label>
            <input
              type="text"
              id="nationality"
              name="nationality"
              required
              value={formData.nationality}
              onChange={handleChange}
            />
            <br />
            <br />
            <label htmlFor="aadhar">Aadhar Number:</label>
            <input
              type="text"
              id="aadhar"
              name="aadhar"
              required
              value={formData.aadhar}
              onChange={handleChange}
            />
            <br />
            <br />
            <label>Category:</label>
            <select
              id="category"
              name="category"
              required
              value={formData.category}
              onChange={handleChange}
            >
              <option value="">Select Your Category</option>
              <option value="General">General</option>
              <option value="SC">SC</option>
              <option value="ST">ST</option>
              <option value="OBC">OBC</option>
              <option value="others">Others</option>
            </select>
            <br />
            <br />
            <label htmlFor="photo">Upload Photo:</label>
            <input
              type="file"
              id="photo"
              name="photo"
              accept="image/*"
              required
              onChange={handleChange}
            />
            <br />
            <br />

            <button type="submit" onClick={nextStep}>
              Next
            </button>
          </div>
        )}

        {step === 2 && (
          <div data-step="2">
            <h3>Contact Information</h3>
            <label htmlFor="permanentAddress">Permanent Address:</label>
            <input
              type="text"
              id="permanentAddress"
              name="permanentAddress"
              required
              value={formData.permanentAddress}
              onChange={handleChange}
            />
            <br />
            <br />
            <label htmlFor="correspondenceAddress">
              Correspondence Address:
            </label>
            <input
              type="text"
              id="correspondenceAddress"
              name="correspondenceAddress"
              required
              value={formData.correspondenceAddress}
              onChange={handleChange}
            />
            <br />
            <br />
            <label htmlFor="email">Email ID:</label>
            <input
              type="email"
              id="email"
              name="email"
              required
              value={formData.email}
              onChange={handleChange}
            />
            <br />
            <br />
            <label htmlFor="phone">Phone Number:</label>
            <input
              type="tel"
              id="phone"
              name="phone"
              required
              value={formData.phone}
              onChange={handleChange}
            />
            <br />
            <br />
            <label htmlFor="altPhone">Alternate Phone Number:</label>
            <input
              type="tel"
              id="altPhone"
              name="altPhone"
              value={formData.altPhone}
              onChange={handleChange}
            />
            <br />
            <br />

            <button type="button" onClick={prevStep}>
              Previous
            </button>
            <button type="submit" onClick={nextStep}>
              Next
            </button>
          </div>
        )}

        {step === 3 && (
          <div data-step="3">
            <h3>Academic Information</h3>
            <label htmlFor="prevSchool">Previous School/College Name:</label>
            <input
              type="text"
              id="prevSchool"
              name="prevSchool"
              required
              value={formData.prevSchool}
              onChange={handleChange}
            />
            <br />
            <br />
            <label htmlFor="yearOfPassing10">Year of Passing (10th):</label>
            <input
              type="text"
              id="yearOfPassing10"
              name="yearOfPassing10"
              required
              value={formData.yearOfPassing10}
              onChange={handleChange}
            />
            <br />
            <br />
            <label htmlFor="board10">Board of Education (10th):</label>
            <input
              type="text"
              id="board10"
              name="board10"
              required
              value={formData.board10}
              onChange={handleChange}
            />
            <br />
            <br />
            <label htmlFor="percentage10">Percentage/CGPA (10th):</label>
            <input
              type="text"
              id="percentage10"
              name="percentage10"
              required
              value={formData.percentage10}
              onChange={handleChange}
            />
            <br />
            <br />
            <label htmlFor="yearOfPassing12">Year of Passing (12th):</label>
            <input
              type="text"
              id="yearOfPassing12"
              name="yearOfPassing12"
              required
              value={formData.yearOfPassing12}
              onChange={handleChange}
            />
            <br />
            <br />
            <label htmlFor="board12">Board of Education (12th):</label>
            <input
              type="text"
              id="board12"
              name="board12"
              required
              value={formData.board12}
              onChange={handleChange}
            />
            <br />
            <br />
            <label htmlFor="percentage12">Percentage/CGPA (12th):</label>
            <input
              type="text"
              id="percentage12"
              name="percentage12"
              required
              value={formData.percentage12}
              onChange={handleChange}
            />
            <br />
            <br />
            <label htmlFor="marksheet10">Upload 10th Marksheet :</label>
            <input
              type="file"
              id="marksheet10"
              name="marksheet10"
              accept="image/*"
              required
              onChange={handleChange}
            />
            <br />
            <br />
            <label htmlFor="marksheet12">Upload 12th Marksheet :</label>
            <input
              type="file"
              id="marksheet12"
              name="marksheet12"
              accept="image/*"
              required
              onChange={handleChange}
            />
            <br />
            <br />
            <button type="button" onClick={prevStep}>
              Previous
            </button>
            <button type="submit" onClick={nextStep}>
              Next
            </button>
          </div>
        )}

        {step === 4 && (
          <div data-step="4">
            <h3>Course Information</h3>
            <label htmlFor="course">Select Course:</label>
            <select
              id="course"
              name="course"
              required
              value={formData.course}
              onChange={handleChange}
            >
              <option value="">Select Your Course</option>
              <option value="CSE">Computer Science Engineering</option>
              <option value="ECE">
                Electronics and Communication Engineering
              </option>
              <option value="EEE">
                Electrical and Electronics Engineering
              </option>
              <option value="CE">Civil Engineering</option>
              <option value="ME">Mechanical Engineering</option>
              <option value="CSE_DS">
                Computer Science with Data Science Engineering
              </option>
              <option value="CSE_AI">
                Computer Science with Artificial Intelligence Engineering
              </option>
              <option value="RE">Robotics Engineering</option>
            </select>
            <br />
            <br />
            <button type="button" onClick={prevStep}>
              Previous
            </button>
            <button type="submit" onClick={nextStep}>
              Next
            </button>
          </div>
        )}

        {step === 5 && (
          <div data-step="5">
            <h3>Guardian Information</h3>
            <label htmlFor="fatherName">Father's Name:</label>
            <input
              type="text"
              id="fatherName"
              name="fatherName"
              required
              value={formData.fatherName}
              onChange={handleChange}
            />
            <br />
            <br />
            <label htmlFor="fatherOccupation">Father's Occupation:</label>
            <input
              type="text"
              id="fatherOccupation"
              name="fatherOccupation"
              required
              value={formData.fatherOccupation}
              onChange={handleChange}
            />
            <br />
            <br />
            <label htmlFor="fatherContact">Father's Contact Number:</label>
            <input
              type="tel"
              id="fatherContact"
              name="fatherContact"
              required
              value={formData.fatherContact}
              onChange={handleChange}
            />
            <br />
            <br />
            <label htmlFor="motherName">Mother's Name:</label>
            <input
              type="text"
              id="motherName"
              name="motherName"
              required
              value={formData.motherName}
              onChange={handleChange}
            />
            <br />
            <br />
            <label htmlFor="motherOccupation">Mother's Occupation:</label>
            <input
              type="text"
              id="motherOccupation"
              name="motherOccupation"
              required
              value={formData.motherOccupation}
              onChange={handleChange}
            />
            <br />
            <br />
            <label htmlFor="motherContact">Mother's Contact Number:</label>
            <input
              type="tel"
              id="motherContact"
              name="motherContact"
              required
              value={formData.motherContact}
              onChange={handleChange}
            />
            <br />
            <br />
            <label htmlFor="guardianAddress">
              Guardian's Address (if different from the applicant's address):
            </label>
            <input
              type="text"
              id="guardianAddress"
              name="guardianAddress"
              value={formData.guardianAddress}
              onChange={handleChange}
            />
            <br />
            <br />
            <label htmlFor="annualIncome">Annual Family Income:</label>
            <input
              type="text"
              id="annualIncome"
              name="annualIncome"
              required
              value={formData.annualIncome}
              onChange={handleChange}
            />
            <br />
            <br />
            <button type="button" onClick={prevStep}>
              Previous
            </button>
            <button type="submit" onClick={nextStep}>
              Next
            </button>
          </div>
        )}

        {step === 6 && (
          <div data-step="6">
            <h3>Review Information</h3>

            {formData.photo && (
              <div>
                <h4>Uploaded Photo:</h4>
                <img
                  src={URL.createObjectURL(formData.photo)}
                  alt="Uploaded"
                  style={{ maxWidth: "200px", maxHeight: "200px" }}
                />
              </div>
            )}

            <p>
              <strong>First Name:</strong> {formData.firstName}
            </p>
            <p>
              <strong>Surname:</strong> {formData.surName}
            </p>
            <p>
              <strong>Date of Birth:</strong> {formData.dob}
            </p>
            <p>
              <strong>Gender:</strong> {formData.gender}
            </p>
            <p>
              <strong>Nationality:</strong> {formData.nationality}
            </p>
            <p>
              <strong>Aadhar Number:</strong> {formData.aadhar}
            </p>
            <p>
              <strong>Category:</strong> {formData.category}
            </p>
            <p>
              <strong>Permanent Address:</strong> {formData.permanentAddress}
            </p>
            <p>
              <strong>Correspondence Address:</strong>{" "}
              {formData.correspondenceAddress}
            </p>
            <p>
              <strong>Email ID:</strong> {formData.email}
            </p>
            <p>
              <strong>Phone Number:</strong> {formData.phone}
            </p>
            <p>
              <strong>Alternate Phone Number:</strong> {formData.altPhone}
            </p>
            <p>
              <strong>Previous School/College Name:</strong>{" "}
              {formData.prevSchool}
            </p>
            <p>
              <strong>Year of Passing (10th):</strong>{" "}
              {formData.yearOfPassing10}
            </p>
            <p>
              <strong>Board of Education (10th):</strong> {formData.board10}
            </p>
            <p>
              <strong>Percentage/CGPA (10th):</strong> {formData.percentage10}
            </p>
            <p>
              <strong>Year of Passing (12th):</strong>{" "}
              {formData.yearOfPassing12}
            </p>
            <p>
              <strong>Board of Education (12th):</strong> {formData.board12}
            </p>
            <p>
              <strong>Percentage/CGPA (12th):</strong> {formData.percentage12}
            </p>
            <p>
              <strong>Selected Course:</strong> {formData.course}
            </p>
            <p>
              <strong>Father's Name:</strong> {formData.fatherName}
            </p>
            <p>
              <strong>Father's Occupation:</strong> {formData.fatherOccupation}
            </p>
            <p>
              <strong>Father's Contact Number:</strong> {formData.fatherContact}
            </p>
            <p>
              <strong>Mother's Name:</strong> {formData.motherName}
            </p>
            <p>
              <strong>Mother's Occupation:</strong> {formData.motherOccupation}
            </p>
            <p>
              <strong>Mother's Contact Number:</strong> {formData.motherContact}
            </p>
            <p>
              <strong>Guardian's Address:</strong> {formData.guardianAddress}
            </p>
            <p>
              <strong>Annual Family Income:</strong> {formData.annualIncome}
            </p>

            {formData.marksheet10 && (
              <div>
                <h4>Uploaded 10th Marksheet:</h4>
                <img
                  src={URL.createObjectURL(formData.marksheet10)}
                  alt="Uploaded"
                  style={{ maxWidth: "200px", maxHeight: "200px" }}
                />
              </div>
            )}
            {formData.marksheet12 && (
              <div>
                <h4>Uploaded 12th Marksheet:</h4>
                <img
                  src={URL.createObjectURL(formData.marksheet12)}
                  alt="Uploaded"
                  style={{ maxWidth: "200px", maxHeight: "200px" }}
                />
              </div>
            )}

            <button type="button" onClick={prevStep} disabled={isSubmitting}>
              Previous
            </button>
            <button
              type="submit"
              onClick={handleSubmit}
              disabled={isSubmitting}
            >
              {isSubmitting ? "Submitting..." : "Submit"}
            </button>
          </div>
        )}

        {step === 7 && submissionSuccess && (
          <div className="success-container">
            <div className="success-icon">✓</div>
            <h2>Submission Successful!</h2>
            <p>Your admission form has been submitted successfully.</p>
            <p>Your application PDF has been generated.</p>

            <div className="pdf-download-section">
              <button className="download-btn" onClick={handleDownloadPDF}>
                📄 Download PDF
              </button>
            </div>

            <button
              className="new-submission-btn"
              onClick={handleNewSubmission}
            >
              Submit Another Form
            </button>
          </div>
        )}
      </form>
    </div>
  );
}

export default App;
