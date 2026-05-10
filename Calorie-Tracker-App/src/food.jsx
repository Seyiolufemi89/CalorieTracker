function Food() {
    const food1 = "banana";
    const food2 = "apple";
    const food3 = "orange";

    return (
        <ul>
            <li>{food1.toUpperCase()}</li>
            <li>{food2.toUpperCase()}</li>
            <li>{food3.toUpperCase()}</li>
        </ul>
    );
}

export default Food;