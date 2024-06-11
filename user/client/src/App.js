import React, { useRef, useEffect, useState } from "react";
import { FaXmark, FaFilter } from "react-icons/fa6";
import axios from "axios";
import "./App.css";
import * as posenet from "@tensorflow-models/posenet";
import Webcam from "react-webcam";
import { drawKeypoints, drawSkeleton } from "./utilities";
import { setBackend } from "@tensorflow/tfjs";
// import tshirt from "../src/assets/t-shirt.png";

setBackend("webgl"); // Set the backend to WebGL

function App() {
  const webcamRef = useRef(null);
  const canvasRef = useRef(null);

  const [data, setTShirts] = useState([]);
  const [selectedTShirt, setSelectedTShirt] = useState(null);
  const [isSelectedTShirt, setIsSelecteTShirt] = useState(false);
  const [warning, setWarning] = useState("");
  const [isFilterOpen, setIsFilterOpen] = useState(false);
  const [price, setPrice] = useState('');
  const [color, setColor] = useState('');
  const [style, setStyle] = useState('');
  const [actualHeight, setActualHeight] = useState('');
  const [actualWidth, setActualWidth] = useState('');
  const [tShirtSelectCount, setTShirtSelectCount] = useState(0);

  const tShirtImage = new Image();
  tShirtImage.src = selectedTShirt;

  useEffect(() => {
    fetchFilteredTShirts();
    runPosenet();
  }, [price, color, style, selectedTShirt]);

  const fetchFilteredTShirts = async () => {
    try {
      const response = await axios.get("http://localhost:5000/images", {
        params: { price, color, style }
      });
      setTShirts(response.data);
    } catch (error) {
      console.error("Error fetching T-shirts:", error);
    }
  };

  const handleTShirtSelect = (image_url) => {
    const fullPath = "http://localhost:5001/images/" + image_url;
    setSelectedTShirt(fullPath);
    setIsSelecteTShirt(true);
    setTShirtSelectCount(count => count + 1);
    if (tShirtSelectCount === 1) {
      window.location.reload();
    }
  };

  const handlePriceChange = (event) => {
    setPrice(event.target.value);
    fetchFilteredTShirts();
  };

  const handleColorChange = (event) => {
    setColor(event.target.value);
    fetchFilteredTShirts();
  };

  const handleStyleChange = (event) => {
    setStyle(event.target.value);
    fetchFilteredTShirts();
  };

  const runPosenet = async () => {
    const net = await posenet.load({
      inputResolution: { width: 720, height: 560 },
      scale: 0.5,
    });
    setInterval(() => {
      detect(net);
    }, 100);
  };

  const detect = async (net) => {
    if (
      typeof webcamRef.current !== "undefined" &&
      webcamRef.current !== null &&
      webcamRef.current.video.readyState === 4
    ) {
      const video = webcamRef.current.video;
      const videoWidth = webcamRef.current.video.videoWidth;
      const videoHeight = webcamRef.current.video.videoHeight;

      webcamRef.current.video.width = videoWidth;
      webcamRef.current.video.height = videoHeight;

      const poses = await net.estimateMultiplePoses(video, {
        maxDetections: 1,
      });
      drawCanvas(poses, videoWidth, videoHeight);
    }
  };

  const drawCanvas = (poses, videoWidth, videoHeight) => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext("2d");
    ctx.clearRect(0, 0, videoWidth, videoHeight);

    canvas.width = videoWidth;
    canvas.height = videoHeight;

    poses.forEach((pose) => {
      drawKeypoints(pose.keypoints, 0.5, ctx);
      drawSkeleton(pose.keypoints, 0.5, ctx);

      const leftShoulder = pose.keypoints.find(keypoint => keypoint.part === 'leftShoulder');
      const rightShoulder = pose.keypoints.find(keypoint => keypoint.part === 'rightShoulder');
      const leftHip = pose.keypoints.find(keypoint => keypoint.part === 'leftHip');
      const rightHip = pose.keypoints.find(keypoint => keypoint.part === 'rightHip');
      const nose = pose.keypoints.find(keypoint => keypoint.part === 'nose');

      if (leftShoulder && rightShoulder && leftHip && rightHip && nose) {
        const tShirtWidth = rightShoulder.position.x - leftShoulder.position.x - 70;
        const tShirtHeight = tShirtWidth * (tShirtImage.height / tShirtImage.width);
        const tShirtX = leftShoulder.position.x + 40;
        const tShirtY = leftShoulder.position.y - tShirtHeight - 30;

        const waistSize = Math.abs(leftHip.position.x - rightHip.position.x);
        const height = Math.abs(leftShoulder.position.y - leftHip.position.y);

        const actualHeight = (height / 4.4);
        const actualWidth = (waistSize / 4.4);
        setActualHeight(Math.round(actualHeight));
        setActualWidth(Math.round(actualWidth));

        if (isSelectedTShirt) {
          if ((nose && nose.position.y < 80) || (leftHip && leftHip.position.y > videoHeight - 80)) {
            setWarning("Please maintain a safe distance from the camera.");
          } else {
            if ((nose && nose.position.y > 140) || (leftHip && leftHip.position.y < videoHeight - 140)) {
              setWarning("Please come close to the camera.");
            } else {
              setWarning("");
              ctx.drawImage(tShirtImage, tShirtX, tShirtY, tShirtWidth, tShirtHeight);
            }
          }
        }
      }
    });
  };

  return (
    <div className="App">
      <header className="App-header">
        <img src="https://thirstyforsoulboner.com/cdn/shop/files/Logo_Options_2_eb5ae955-48f3-48f3-a2f5-14d860ec88bd_300x300.png?v=1614321917" alt="Soul Boners" />
      </header>
      <section className="body">
        <div className={`filter-wrapper ${isFilterOpen ? "open" : ""}`}>
          <div className={`filter-container ${isFilterOpen ? "slide-in" : ""}`}>
            <div className="filter-header">
              <button type="button" className="btn-close-filter" onClick={() => setIsFilterOpen(false)}><FaXmark /></button>
            </div>
            <label htmlFor="price">Price</label>
            <select id="price" value={price} onChange={handlePriceChange}>
              <option value="">Any Price</option>
              <option value="1000">Less than 1,000</option>
              <option value="2000">Less than 2,000</option>
              <option value="4000">Less than 4,000</option>
              <option value="8000">Less than 8,000</option>
              <option value="10000">Less than 10,000</option>
            </select>

            <label htmlFor="color">Color</label>
            <select id="color" value={color} onChange={handleColorChange}>
              <option value="">All Colours</option>
              <option value="red">Red</option>
              <option value="blue">Blue</option>
              <option value="green">Green</option>
              <option value="black">Black</option>
              <option value="white">White</option>
            </select>

            <label htmlFor="style">Style</label>
            <select id="style" value={style} onChange={handleStyleChange}>
              <option value="">All Styles</option>
              <option value="casual">Casual</option>
              <option value="formal">Formal</option>
              <option value="distinct">Distinct</option>
            </select>
          </div>
        </div>
        <div className="row">
          <div className="col-3">
            <div className="video-container">
              <Webcam ref={webcamRef} className="webcam" />
              <canvas ref={canvasRef} className="overlay-canvas" />
              {warning && (
                <div className="warning">
                  <p>{warning}</p>
                </div>
              )}
              <div className="btn-container">
                <button type="button" className="btn-filter" onClick={() => setIsFilterOpen(true)}><FaFilter /></button>
                <button type="button">S</button>
                <button type="button">M</button>
                <button type="button">L</button>
                <button type="button">XL</button>
              </div>
            </div>
            <div className="vc-header">
              <p>Height: {actualHeight} cm</p>
              <p>Width: {actualWidth} cm</p>
            </div>
          </div>
          <div className="col-2">
            <div className="wardrobe-container">
              {data.length > 0 && (
                <div className="row">
                  {[...Array(Math.ceil(data.length / 3))].map((_, rowIndex) => (
                    <div key={rowIndex} className="column">
                      {data.slice(rowIndex * 3, rowIndex * 3 + 3).map((item, index) => (
                        <div key={index} className="col-4" onClick={() => handleTShirtSelect(item.image_url)}>
                          {item.image_url && <img src={"http://localhost:5001/images/" + item.image_url} width={100} alt="T-shirt Images were supposed to be displayed" />}
                        </div>
                      ))}
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}

export default App;
