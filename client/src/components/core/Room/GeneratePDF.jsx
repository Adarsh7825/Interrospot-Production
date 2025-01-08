import React, { useState } from 'react';
import jsPDF from 'jspdf';
import { fetchCandidateImage, fetchInterviewerImage, fetchJobPosition } from "../../../services/operations/roomAPI";
import { toast } from 'react-toastify';
import { useSelector } from 'react-redux';
import { sendPftoRecruiterAPI } from '../../../services/operations/sendPftoRecruiterAPI';

const GeneratePDF = ({ roomid, questions, overallFeedback }) => {
    const [isLoading, setIsLoading] = useState(false);
    const user = useSelector((state) => state.profile);

    const generatePDF = async () => {
        try {
            setIsLoading(true);
            console.log('Generating PDF...');
            const doc = new jsPDF();

            // Set background color
            doc.setFillColor(26, 26, 46); // #1A1A2E
            doc.rect(0, 0, doc.internal.pageSize.width, doc.internal.pageSize.height, 'F');

            // Add header with gradient-like effect
            doc.setFillColor(15, 52, 96); // #0F3460
            doc.rect(0, 0, doc.internal.pageSize.width, 40, 'F');

            // Add the candidate photo
            const candidateImg = new Image();
            const candidateImageUrl = await fetchCandidateImage(roomid);
            candidateImg.src = candidateImageUrl;

            await new Promise((resolve) => {
                candidateImg.onload = resolve;
            });

            // Add circular frame effect
            doc.setDrawColor(233, 69, 96); // #E94560
            doc.setLineWidth(0.5);
            doc.circle(35, 35, 25, 'S');
            doc.addImage(candidateImg.src, 'JPEG', 10, 10, 50, 50);

            // Add the interviewer photo
            const interviewerImg = new Image();
            const interviewerImageUrl = await fetchInterviewerImage(roomid);
            interviewerImg.src = interviewerImageUrl;

            await new Promise((resolve) => {
                interviewerImg.onload = resolve;
            });

            // Add circular frame effect for interviewer
            doc.setDrawColor(83, 52, 131); // #533483
            doc.circle(95, 35, 25, 'S');
            doc.addImage(interviewerImg.src, 'JPEG', 70, 10, 50, 50);

            // Add the job position with styled header
            const jobPosition = await fetchJobPosition(roomid);
            doc.setFontSize(20);
            doc.setTextColor(233, 69, 96); // #E94560
            doc.text(`Job Position: ${jobPosition}`, 10, 70);

            // Add the date of interview
            const date = new Date();
            const formattedDate = date.toLocaleDateString();
            doc.setFontSize(14);
            doc.setTextColor(255, 255, 255);
            doc.text(`Interview Date: ${formattedDate}`, 10, 85);

            // Add the questions and ratings with improved styling
            let yOffset = 100;
            const pageHeight = doc.internal.pageSize.height;
            const lineHeight = 12;
            const margin = 10;

            const filledStar = new Image();
            filledStar.src = 'https://i.ibb.co/PGfX6hM/favorite-star-17015.png';
            const emptyStar = new Image();
            emptyStar.src = 'https://i.ibb.co/7yX4tFx/star-101305.png';

            for (const question of questions) {
                if (yOffset + lineHeight * 4 > pageHeight - margin) {
                    doc.addPage();
                    // Add background to new page
                    doc.setFillColor(26, 26, 46);
                    doc.rect(0, 0, doc.internal.pageSize.width, doc.internal.pageSize.height, 'F');
                    yOffset = margin;
                }

                // Question box with gradient-like effect
                doc.setFillColor(15, 52, 96);
                doc.roundedRect(5, yOffset - 5, doc.internal.pageSize.width - 10, lineHeight * 6, 3, 3, 'F');

                doc.setFontSize(14);
                doc.setTextColor(233, 69, 96);
                doc.text(`Question ${questions.indexOf(question) + 1}:`, 10, yOffset);
                doc.setTextColor(255, 255, 255);
                doc.text(question.text, 10, yOffset + lineHeight);
                yOffset += lineHeight * 2;

                // Add stars
                const starSize = 8;
                for (let i = 0; i < 10; i++) {
                    const starImage = i < question.feedback ? filledStar : emptyStar;
                    doc.addImage(starImage.src, 'PNG', 10 + i * (starSize + 2), yOffset, starSize, starSize);
                }
                yOffset += starSize + lineHeight;

                doc.setFontSize(12);
                doc.setTextColor(233, 69, 96);
                doc.text(`Strength: ${question.strength}`, 10, yOffset);
                yOffset += lineHeight;
                doc.setTextColor(233, 69, 96)
                doc.text(`Ease of Improvement: ${question.improvement}`, 10, yOffset);
                yOffset += lineHeight * 2;
            }

            // Add overall feedback with styled box
            if (overallFeedback) {
                if (yOffset + lineHeight * 4 > pageHeight - margin) {
                    doc.addPage();
                    doc.setFillColor(26, 26, 46);
                    doc.rect(0, 0, doc.internal.pageSize.width, doc.internal.pageSize.height, 'F');
                    yOffset = margin;
                }

                doc.setFillColor(15, 52, 96);
                doc.roundedRect(5, yOffset - 5, doc.internal.pageSize.width - 10, lineHeight * 3, 3, 3, 'F');

                doc.setFontSize(16);
                doc.setTextColor(233, 69, 96);
                doc.text('Overall Feedback:', 10, yOffset);
                doc.setTextColor(255, 255, 255);
                doc.text(overallFeedback, 10, yOffset + lineHeight);
            }

            doc.save('interview_feedback.pdf');
            console.log("PDF generated successfully!");
            toast.success('PDF generated successfully!');

        } catch (error) {
            console.error('Error generating PDF:', error);
            toast.error('Failed to generate PDF');
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <button
            onClick={generatePDF}
            disabled={isLoading}
            className={`group px-5 py-2.5 bg-gradient-to-r from-[#E94560] to-[#533483] hover:from-[#533483] hover:to-[#E94560] text-white rounded-lg flex items-center space-x-2 transition-allduration-300 shadow-lg hover:shadow-[#E94560]/50 disabled:opacity-50 disabled:cursor-not-allowed`}
        >
            {isLoading ? (
                <>
                    <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    <span>Generating PDF...</span>
                </>
            ) : (
                <>
                    <span className="font-medium">Generate PDF</span>
                    <span className="transform group-hover:translate-x-1 transition-transform">→</span>
                </>
            )}
        </button>
    );
};

export default GeneratePDF;