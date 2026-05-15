function Food({foodItems, onAddFood, onRemoveFood, onUpdateFood,}) {
    

    return (
        <div className="food-container">
            <h2>Food</h2>

            <div>
                
                <h3>Add your food</h3>
                <div className="food-search-container">
                    <input type="text" id="food-search" placeholder="Search for food..." />
                    <button id="food-search-button">Search</button>
                </div>

            </div>

           
        </div>  
    );
}

export default Food;