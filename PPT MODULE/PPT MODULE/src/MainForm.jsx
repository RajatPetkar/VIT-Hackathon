import React, { useState } from "react";
import PptxGenJS from "pptxgenjs";
import { GoogleGenerativeAI } from "@google/generative-ai";
import { motion, AnimatePresence } from "framer-motion";
import "bootstrap/dist/css/bootstrap.min.css";

const GEMINI_API_KEY = "AIzaSyDg8uBCCAn-FnBP1G0-rwzSkxTqhPar-CE"; // Replace with your valid Gemini API key
const PEXELS_API_KEY = "boULf8QGmnXoERiI4p2LYf4o0qFHRH5U73Pr0vvYsq40NtK2T4ZlkS5O"; // Replace with your valid Pexels API key
const genAI = new GoogleGenerativeAI(GEMINI_API_KEY);

const PptGenerator = () => {
  const [topic, setTopic] = useState("");
  const [slides, setSlides] = useState(5);
  const [context, setContext] = useState("");
  const [generatedSlides, setGeneratedSlides] = useState([]);
  const [loading, setLoading] = useState(false);
  const [currentSlide, setCurrentSlide] = useState(0);

  // Convert image URL to Base64 (for pptxgenjs)
  const fetchImageAsBase64 = async (imageUrl) => {
    try {
      const response = await fetch(imageUrl);
      const blob = await response.blob();
      return new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.readAsDataURL(blob);
        reader.onloadend = () => resolve(reader.result);
        reader.onerror = reject;
      });
    } catch (error) {
      console.error("Error converting image:", error);
      return "";
    }
  };

  // Fetch image from Pexels API
  const fetchImage = async (query) => {
    try {
      const response = await fetch(
        `https://api.pexels.com/v1/search?query=${encodeURIComponent(query)}&per_page=1`,
        { headers: { Authorization: PEXELS_API_KEY } }
      );
      const data = await response.json();
      if (!data.photos?.length) return "";
      const imgUrl = data.photos[0].src.large;
      return await fetchImageAsBase64(imgUrl);
    } catch (error) {
      console.error("Error fetching image:", error);
      return "";
    }
  };

  // Generate slides via Gemini AI
  const generateSlides = async () => {
    setLoading(true);
    try {
      const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });
      const prompt = `Create ${slides} slides on ${topic}. Each slide should have:
- A short title (max 5 words) followed by "| image: [search term]"
- 2-3 concise bullet points (max 15 words each)
Format example:
Slide 1 Title | image: searchterm
• Point 1
• Point 2
Context: ${context}`;
      const response = await model.generateContent({
        contents: [{ parts: [{ text: prompt }] }],
      });
      const text =
        response.response.candidates[0]?.content?.parts[0]?.text || "";
      const slideArray = text.split("\n\n").map((slideText) => {
        const lines = slideText.split("\n").filter((line) => line.trim() !== "");
        const titleLine = lines[0].split("| image:");
        return {
          title: titleLine[0].replace(/Slide\s*\d+\s*/i, "").trim(),
          imageQuery: titleLine[1]?.trim() || topic,
          points: lines.slice(1)
        };
      });
      const slidesWithImages = await Promise.all(
        slideArray.map(async (slide) => ({
          ...slide,
          image: await fetchImage(slide.imageQuery)
        }))
      );
      setGeneratedSlides(slidesWithImages);
      setCurrentSlide(0);
    } catch (error) {
      console.error("Error generating slides:", error);
    }
    setLoading(false);
  };

  // Download PPT with improved formatting
  const downloadPPT = () => {
    if (!generatedSlides.length) {
      alert("No slides available. Please generate slides first!");
      return;
    }
    const pptx = new PptxGenJS();
    pptx.author = "AI Generator";
    pptx.theme = { 
      headFontFace: "Arial",
      bodyFontFace: "Calibri",
      chartColors: ["007BFF", "FF6B6B", "6B48FF"]
    };
    generatedSlides.forEach((slide, index) => {
      const pptSlide = pptx.addSlide();
      pptSlide.addText(slide.title, {
        x: 0.5,
        y: 0.3,
        w: 9,
        h: 0.8,
        fontSize: 28,
        bold: true,
        color: "007BFF",
        margin: 0.2,
      });
      pptSlide.addShape(pptx.ShapeType.line, {
        x: 0.5,
        y: 1.1,
        w: 9,
        h: 0,
        line: { color: "007BFF", width: 2 }
      });
      if (slide.points.length > 0) {
        pptSlide.addText(
          slide.points.map((point) => `• ${point}`).join("\n"),
          {
            x: 0.5,
            y: 1.5,
            w: 4.5,
            h: 4,
            fontSize: 18,
            bullet: true,
            margin: 0.3,
            lineSpacing: 24,
            color: "333333",
          }
        );
      }
      if (slide.image) {
        pptSlide.addImage({
          data: slide.image,
          x: 5.5,
          y: 1.5,
          w: 4,
          h: 4,
          sizing: { type: "cover", w: 4, h: 4 }
        });
      }
      pptSlide.addText(`Slide ${index + 1}`, {
        x: 0.5,
        y: 6.8,
        w: 9,
        h: 0.5,
        fontSize: 12,
        color: "666666",
        align: "right"
      });
    });
    pptx.writeFile({ fileName: `${topic.replace(/ /g, "_")}_presentation.pptx` });
  };

  return (
    <div
      className="container-fluid d-flex flex-column"
      style={{ height: "90vh", width:"80vw", marginLeft:"0px",paddingLeft:"0px", background: "transparent" }}
    >
      {/* Main Row: Side by Side */}
      <div className="row flex-grow-1">
        {/* Left: Input Form */}
        <div className="col-md-6 d-flex flex-column justify-content-center align-items-center">
          <div className="card w-100 m-3" style={{ backgroundColor: "rgba(255,255,255,0.9)" }}>
            <div className="card-body">
              <h2 className="card-title text-primary text-center">Input Details</h2>
              <div className="form-group my-3">
                <input
                  type="text"
                  className="form-control"
                  placeholder="Presentation Topic"
                  value={topic}
                  onChange={(e) => setTopic(e.target.value)}
                />
              </div>
              <div className="form-row my-3">
                <div className="col mb-3">
                  <input
                    type="number"
                    min="3"
                    max="20"
                    className="form-control"
                    placeholder="Number of Slides"
                    value={slides}
                    onChange={(e) => setSlides(e.target.value)}
                  />
                </div>
                <div className="col">
                  <textarea
                    className="form-control"
                    placeholder="Additional context (optional)"
                    rows="1"
                    value={context}
                    onChange={(e) => setContext(e.target.value)}
                  ></textarea>
                </div>
              </div>
              <button
                onClick={generateSlides}
                disabled={loading}
                className="btn btn-primary btn-block"
              >
                {loading ? "Generating..." : "Generate Slides"}
              </button>
            </div>
          </div>
        </div>

        {/* Right: Preview Slider */}
        <div className="col-md-6 d-flex flex-column justify-content-center align-items-center">
          {generatedSlides.length > 0 && (
            <div className="card w-100 m-3">
              <div className="card-header d-flex justify-content-between align-items-center">
                <h3 className="mb-0">Slide Preview</h3>
                <button onClick={downloadPPT} className="btn btn-success">
                  Download PPT
                </button>
              </div>
              <div className="card-body">
                <AnimatePresence exitBeforeEnter>
                  <motion.div
                    key={currentSlide}
                    // initial={{ opacity: 0, x: 50 }}
                    // animate={{ opacity: 1, x: 0 }}
                    // exit={{ opacity: 0, x: -50 }}
                    // transition={{ duration: 0.5 }}
                  >
                    <div className="card">
                      <div className="card-header bg-info text-white">
                        <h4 className="mb-0">{generatedSlides[currentSlide].title}</h4>
                      </div>
                      <div className="card-body">
                        <div className="row">
                          <div className="col-md-6">
                            <ul className="list-group list-group-flush">
                              {generatedSlides[currentSlide].points.map((point, i) => (
                                <li key={i} className="list-group-item">
                                  • {point}
                                </li>
                              ))}
                            </ul>
                          </div>
                          <div className="col-md-6">
                            {generatedSlides[currentSlide].image && (
                              <img
                                src={generatedSlides[currentSlide].image}
                                alt="Slide visual"
                                className="img-fluid rounded"
                                style={{ height: "250px", objectFit: "cover" }}
                              />
                            )}
                          </div>
                        </div>
                      </div>
                    </div>
                  </motion.div>
                </AnimatePresence>
                <div className="d-flex justify-content-center mt-3">
                  <button
                    onClick={() =>
                      setCurrentSlide((prev) =>
                        prev === 0 ? generatedSlides.length - 1 : prev - 1
                      )
                    }
                    className="btn btn-secondary me-2"
                  >
                    &#8592;
                  </button>
                  <button
                    onClick={() =>
                      setCurrentSlide((prev) =>
                        prev === generatedSlides.length - 1 ? 0 : prev + 1
                      )
                    }
                    className="btn btn-secondary"
                  >
                    &#8594;
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
      {/* Bottom: Full-width Download Button */}
      <div className="row">
        <div className="col-12 text-center mt-2">
          {generatedSlides.length > 0 && (
            <button onClick={downloadPPT} className="btn btn-success btn-lg w-100">
              Download PPT
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

export default PptGenerator;

