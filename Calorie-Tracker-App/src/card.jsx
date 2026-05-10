import ProfilePicture from './assets/hero.png';


function Card() {
    return (
        <div className="card">
            <img className="card-img" src={ProfilePicture} alt="Profile picture" />
            <h3>Card Title</h3>
            <p>This is a card component.</p>
        </div>
    );

}

export default Card;