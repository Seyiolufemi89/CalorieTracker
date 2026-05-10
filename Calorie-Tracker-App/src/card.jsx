
import React from 'react';

function Card({
    caloriesGoal = 2000,
    caloriesEaten = 1200,
    caloriesBurned = 300,
    proteinGoal = 150,
    proteinEaten = 85,
    carbsGoal = 200,
    carbsEaten = 110,
    fatsGoal = 65,
    fatsEaten = 35
}) {
    const caloriesLeft = caloriesGoal - caloriesEaten + caloriesBurned;
    const progress = Math.min((caloriesEaten / (caloriesGoal + caloriesBurned)) * 100, 100);

    const macroProgress = (eaten, goal) => Math.min((eaten / goal) * 100, 100);

    // Motivational message based on progress
    let message = "You're doing great!";
    if (progress > 90) message = "Almost at your limit!";
    else if (progress < 20) message = "Time to fuel up! 🍎";
    else if (progress > 50) message = "Halfway there! Keep it up! 💪";

    return (
        <div className="card dashboard-card slide-up-fade">
            <div className="dashboard-header">
                <div>
                    <h3 className="dashboard-title">Today's Summary</h3>
                    <p className="dashboard-subtitle">{message}</p>
                </div>
                <button className="add-action-btn pulse-glow" title="Log Food">
                    <svg viewBox="0 0 24 24" width="24" height="24" stroke="currentColor" strokeWidth="2" fill="none" strokeLinecap="round" strokeLinejoin="round">
                        <line x1="12" y1="5" x2="12" y2="19"></line>
                        <line x1="5" y1="12" x2="19" y2="12"></line>
                    </svg>
                </button>
            </div>
            
            <div className="dashboard-main">
                {/* Calories Ring */}
                <div className="calorie-ring-container hover-scale">
                    <svg viewBox="0 0 36 36" className="circular-chart">
                        {/* Glow filter */}
                        <defs>
                            <filter id="glow" x="-20%" y="-20%" width="140%" height="140%">
                                <feGaussianBlur stdDeviation="2" result="blur" />
                                <feComposite in="SourceGraphic" in2="blur" operator="over" />
                            </filter>
                        </defs>
                        <path className="circle-bg"
                            d="M18 2.0845
                            a 15.9155 15.9155 0 0 1 0 31.831
                            a 15.9155 15.9155 0 0 1 0 -31.831"
                        />
                        <path className="circle"
                            strokeDasharray={`${progress}, 100`}
                            d="M18 2.0845
                            a 15.9155 15.9155 0 0 1 0 31.831
                            a 15.9155 15.9155 0 0 1 0 -31.831"
                            filter="url(#glow)"
                        />
                    </svg>
                    <div className="calorie-info">
                        <span className="calorie-number gradient-text">{caloriesLeft}</span>
                        <span className="calorie-label">kcal left</span>
                    </div>
                </div>

                {/* Side Stats (Eaten vs Burned) */}
                <div className="side-stats">
                    <div className="stat-item eaten hover-scale">
                        <span className="stat-icon">🍴</span>
                        <div className="stat-details">
                            <span className="stat-value">{caloriesEaten}</span>
                            <span className="stat-label">Eaten</span>
                        </div>
                    </div>
                    <div className="stat-item burned hover-scale">
                        <span className="stat-icon">🔥</span>
                        <div className="stat-details">
                            <span className="stat-value">{caloriesBurned}</span>
                            <span className="stat-label">Burned</span>
                        </div>
                    </div>
                </div>
            </div>

            {/* Macros */}
            <div className="macros-container">
                <div className="macro-item hover-scale">
                    <div className="macro-header">
                        <span className="macro-name">🍗 Protein</span>
                        <span className="macro-numbers">{proteinEaten} / {proteinGoal}g</span>
                    </div>
                    <div className="progress-bar-bg">
                        <div className="progress-bar protein" style={{ width: `${macroProgress(proteinEaten, proteinGoal)}%` }}></div>
                    </div>
                </div>

                <div className="macro-item hover-scale">
                    <div className="macro-header">
                        <span className="macro-name">🌾 Carbs</span>
                        <span className="macro-numbers">{carbsEaten} / {carbsGoal}g</span>
                    </div>
                    <div className="progress-bar-bg">
                        <div className="progress-bar carbs" style={{ width: `${macroProgress(carbsEaten, carbsGoal)}%` }}></div>
                    </div>
                </div>

                <div className="macro-item hover-scale">
                    <div className="macro-header">
                        <span className="macro-name">🥑 Fats</span>
                        <span className="macro-numbers">{fatsEaten} / {fatsGoal}g</span>
                    </div>
                    <div className="progress-bar-bg">
                        <div className="progress-bar fats" style={{ width: `${macroProgress(fatsEaten, fatsGoal)}%` }}></div>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default Card;