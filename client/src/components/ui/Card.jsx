// import './card.css'

const Card = ({ children }) => {
    return (
    <div className="card w-96 bg-base-100 shadow-sm">
        <div className="card-body">
        {children}
        </div>
    </div>
    );
}

export default Card