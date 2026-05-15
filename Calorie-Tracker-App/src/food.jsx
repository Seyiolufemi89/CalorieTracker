import { useEffect, useRef, useState } from 'react';
import { BrowserMultiFormatReader, NotFoundException } from '@zxing/browser';

const foodData = [
  { id: 1, name: 'Apple', calories: 95 },
  { id: 2, name: 'Banana', calories: 105 },
  { id: 3, name: 'Grilled Chicken', calories: 165 },
  { id: 4, name: 'Brown Rice', calories: 216 },
];

function formatValue(value, suffix = 'g') {
  return value || value === 0 ? `${value}${suffix}` : 'N/A';
}

function Food() {
  const [searchTerm, setSearchTerm] = useState('');
  const [searchResults, setSearchResults] = useState([]);
  const [searchStatus, setSearchStatus] = useState('');
  const [foodIntake, setFoodIntake] = useState([]);
  const [barcodeMode, setBarcodeMode] = useState(false);
  const [cameraMode, setCameraMode] = useState(false);
  const [scanError, setScanError] = useState('');
  const [barcodeResult, setBarcodeResult] = useState('');
  const [nutritionData, setNutritionData] = useState(null);
  const [photoCategory, setPhotoCategory] = useState('mixed');
  const [photoEstimate, setPhotoEstimate] = useState(null);
  const videoRef = useRef(null);
  const codeReader = useRef(null);

  const filteredFood = foodData.filter((food) =>
    food.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const totalCalories = foodIntake.reduce((sum, item) => sum + item.calories, 0);

  const stopCamera = () => {
    if (videoRef.current?.srcObject) {
      const stream = videoRef.current.srcObject;
      const tracks = stream.getTracks();
      tracks.forEach((track) => track.stop());
      videoRef.current.srcObject = null;
    }
  };

  const stopScanner = () => {
    if (codeReader.current) {
      codeReader.current.reset();
      codeReader.current = null;
    }
    stopCamera();
  };

  useEffect(() => {
    return () => {
      stopScanner();
    };
  }, []);

  const setNutritionFromProduct = (product) => {
    if (!product) return;
    const nutriments = product.nutriments || {};
    setNutritionData({
      name: product.product_name || product.generic_name || 'Unknown product',
      barcode: product.code,
      image: product.image_front_small_url,
      calories:
        nutriments['energy-kcal_100g'] || nutriments['energy-kcal_serving'] || nutriments['energy_100g'] || 0,
      protein: nutriments.proteins_100g,
      carbs: nutriments.carbohydrates_100g,
      fat: nutriments.fat_100g,
      sugar: nutriments.sugars_100g,
      fiber: nutriments.fiber_100g,
      servingSize: product.serving_size,
      brands: product.brands,
    });
  };

  const fetchNutritionByBarcode = async (barcode) => {
    setSearchStatus('Looking up product by barcode...');
    setScanError('');
    try {
      const response = await fetch(`https://world.openfoodfacts.org/api/v0/product/${barcode}.json`);
      if (!response.ok) throw new Error('Barcode lookup failed');
      const result = await response.json();
      if (result.status !== 1 || !result.product) {
        setScanError('No product found for that barcode.');
        setNutritionData(null);
        return;
      }
      setBarcodeResult(barcode);
      setNutritionFromProduct(result.product);
      setSearchStatus('Product loaded from OpenFoodFacts.');
    } catch (error) {
      setScanError(error.message || 'Unable to load barcode product.');
      setNutritionData(null);
    }
  };

  const handleSearchClick = async () => {
    const query = searchTerm.trim();
    if (!query) {
      setSearchStatus('Type a food name or brand to search.');
      return;
    }
    stopScanner();
    setBarcodeMode(false);
    setCameraMode(false);
    setSearchStatus('Searching OpenFoodFacts...');
    setScanError('');

    try {
      const response = await fetch(
        `https://world.openfoodfacts.org/cgi/search.pl?search_terms=${encodeURIComponent(
          query,
        )}&search_simple=1&action=process&json=1&page_size=8`,
      );
      if (!response.ok) throw new Error('Search failed');
      const result = await response.json();
      const products = (result.products || []).map((product) => ({
        id: product.id || product.code,
        name: product.product_name || product.generic_name || 'Unknown food',
        barcode: product.code,
        calories:
          product.nutriments?.['energy-kcal_100g'] || product.nutriments?.['energy-kcal_serving'] || 0,
        raw: product,
      }));
      setSearchResults(products);
      setSearchStatus(`${products.length} results found.`);
    } catch (error) {
      setSearchResults([]);
      setSearchStatus('Unable to search foods. Try again.');
    }
  };

  const handleAddFood = (food) => {
    setFoodIntake((prev) => [...prev, food]);
    setSearchTerm('');
  };

  const handleStartBarcodeScan = async () => {
    setSearchResults([]);
    setSearchStatus('Starting barcode scanner...');
    setScanError('');
    setBarcodeMode(true);
    setCameraMode(false);
    stopScanner();

    codeReader.current = new BrowserMultiFormatReader();
    try {
      const videoInputDevices = await BrowserMultiFormatReader.listVideoInputDevices();
      if (!videoInputDevices.length) throw new Error('No camera devices found');
      const selectedDeviceId = videoInputDevices[0].deviceId;
      await codeReader.current.decodeFromVideoDevice(
        selectedDeviceId,
        videoRef.current,
        (result, error) => {
          if (result) {
            stopScanner();
            setBarcodeResult(result.getText());
            fetchNutritionByBarcode(result.getText());
          }
          if (error && !(error instanceof NotFoundException)) {
            setScanError(error.message || 'Scan error');
          }
        },
      );
    } catch (error) {
      setScanError(error.message || 'Unable to open camera for barcode scanning.');
      setBarcodeMode(false);
      stopScanner();
    }
  };

  const handleToggleCameraEstimate = async () => {
    setScanError('');
    setPhotoEstimate(null);
    setCameraMode((current) => {
      const next = !current;
      if (!next) {
        stopScanner();
      }
      return next;
    });
    setBarcodeMode(false);
    setSearchResults([]);
    setSearchStatus('');

    if (!cameraMode) {
      try {
        const stream = await navigator.mediaDevices.getUserMedia({ video: { facingMode: 'environment' } });
        if (videoRef.current) {
          videoRef.current.srcObject = stream;
          videoRef.current.play();
        }
      } catch (error) {
        setScanError('Unable to access camera for visual estimate.');
        setCameraMode(false);
      }
    } else {
      stopScanner();
    }
  };

  const capturePhotoEstimate = () => {
    if (!videoRef.current) return;
    const video = videoRef.current;
    const width = video.videoWidth || 320;
    const height = video.videoHeight || 240;
    const canvas = document.createElement('canvas');
    canvas.width = width;
    canvas.height = height;
    const ctx = canvas.getContext('2d');
    ctx.drawImage(video, 0, 0, width, height);
    const imageData = ctx.getImageData(0, 0, width, height).data;
    const brightness = Array.from(imageData)
      .filter((_, index) => index % 4 !== 3)
      .reduce((sum, value) => sum + value, 0);
    const averageColor = brightness / (imageData.length * 0.75);
    const categoryFactor = {
      salad: 0.7,
      sandwich: 1.0,
      pasta: 1.2,
      dessert: 1.4,
      mixed: 1.0,
    };
    const estimate = Math.round((averageColor / 255) * 420 * categoryFactor[photoCategory] + 120);
    setPhotoEstimate({
      calories: estimate,
      category: photoCategory,
      note: 'Camera-based estimate. Use as a guide, not a medical measurement.',
    });
  };

  return (
    <section className="food-container">
      <div className="food-header-row">
        <div>
          <h2>Food Tracker</h2>
          <p className="food-subtitle">
            Search OpenFoodFacts, scan barcodes, or estimate calories with your camera.
          </p>
        </div>
      </div>

      <div className="food-actions-row">
        <button type="button" onClick={handleSearchClick} className="primary-button">
          Search food database
        </button>
        <button type="button" onClick={handleStartBarcodeScan} className="secondary-button">
          {barcodeMode ? 'Stop barcode scan' : 'Scan barcode'}
        </button>
        <button type="button" onClick={handleToggleCameraEstimate} className="secondary-button">
          {cameraMode ? 'Close camera estimate' : 'Camera calorie estimate'}
        </button>
      </div>

      <div className="food-search-container">
        <input
          id="food-search"
          type="text"
          value={searchTerm}
          onChange={(event) => setSearchTerm(event.target.value)}
          placeholder="Search food by name, brand, or barcode"
          aria-label="Search food"
        />
      </div>

      {scanError && <p className="food-error">{scanError}</p>}
      {searchStatus && <p className="food-status">{searchStatus}</p>}

      <div className="food-scan-panel">
        {(barcodeMode || cameraMode) && (
          <div className="video-panel">
            <video ref={videoRef} className="video-preview" muted playsInline />
          </div>
        )}

        {cameraMode && (
          <div className="camera-controls">
            <label>
              Photo category:
              <select value={photoCategory} onChange={(event) => setPhotoCategory(event.target.value)}>
                <option value="mixed">Mixed food</option>
                <option value="salad">Salad / veggies</option>
                <option value="sandwich">Sandwich / snack</option>
                <option value="pasta">Pasta / grains</option>
                <option value="dessert">Dessert</option>
              </select>
            </label>
            <button type="button" onClick={capturePhotoEstimate} className="primary-button">
              Estimate calories from photo
            </button>
          </div>
        )}
      </div>

      {barcodeResult && (
        <div className="barcode-result">
          <strong>Barcode:</strong> {barcodeResult}
        </div>
      )}

      {photoEstimate && (
        <div className="photo-estimate-card">
          <h3>Estimated calories</h3>
          <p>
            {photoEstimate.calories} kcal — {photoEstimate.category}
          </p>
          <p className="food-note">{photoEstimate.note}</p>
        </div>
      )}

      <div className="food-results-grid">
        <div className="food-results-card">
          <h3>Search results</h3>
          <ul>
            {searchResults.length > 0 ? (
              searchResults.map((food) => (
                <li key={food.id}>
                  <div>
                    <strong>{food.name}</strong>
                    <span>{food.calories || 'N/A'} kcal</span>
                  </div>
                  <button type="button" onClick={() => setNutritionFromProduct(food.raw)}>
                    Details
                  </button>
                </li>
              ))
            ) : (
              <li>No search results yet.</li>
            )}
          </ul>
        </div>

        <div className="food-results-card">
          <h3>Quick suggestions</h3>
          <ul>
            {filteredFood.length > 0 ? (
              filteredFood.map((food) => (
                <li key={food.id}>
                  <span>{food.name}</span>
                  <span>{food.calories} kcal</span>
                  <button type="button" onClick={() => handleAddFood(food)}>
                    Add
                  </button>
                </li>
              ))
            ) : (
              <li>No matches yet.</li>
            )}
          </ul>
        </div>
      </div>

      {nutritionData && (
        <div className="nutrition-details">
          <h3>{nutritionData.name}</h3>
          {nutritionData.image && <img src={nutritionData.image} alt={nutritionData.name} />}
          <div className="nutrition-grid">
            <div className="nutrition-row">
              <span>Calories</span>
              <strong>{formatValue(nutritionData.calories, ' kcal')}</strong>
            </div>
            <div className="nutrition-row">
              <span>Protein</span>
              <strong>{formatValue(nutritionData.protein)}</strong>
            </div>
            <div className="nutrition-row">
              <span>Carbs</span>
              <strong>{formatValue(nutritionData.carbs)}</strong>
            </div>
            <div className="nutrition-row">
              <span>Fat</span>
              <strong>{formatValue(nutritionData.fat)}</strong>
            </div>
            <div className="nutrition-row">
              <span>Sugar</span>
              <strong>{formatValue(nutritionData.sugar)}</strong>
            </div>
            <div className="nutrition-row">
              <span>Fiber</span>
              <strong>{formatValue(nutritionData.fiber)}</strong>
            </div>
            <div className="nutrition-row">
              <span>Serving size</span>
              <strong>{nutritionData.servingSize || 'N/A'}</strong>
            </div>
          </div>
        </div>
      )}

      <div className="food-intake-summary">
        <h3>Today's intake</h3>
        <p>Total calories: {totalCalories}</p>
        <ul>
          {foodIntake.length > 0 ? (
            foodIntake.map((food, index) => (
              <li key={`${food.id}-${index}`}>
                {food.name} — {food.calories} kcal
              </li>
            ))
          ) : (
            <li>No foods added yet.</li>
          )}
        </ul>
      </div>
    </section>
  );
}

export default Food;