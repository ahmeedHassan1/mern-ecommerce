import { FaStar, FaStarHalfAlt, FaRegStar } from "react-icons/fa";

const Rating = ({ value, text }) => {
	function getStarIcon(value, index) {
		let icon;
		if (value >= index) {
			icon = <FaStar />;
		} else if (value >= index - 0.5) {
			icon = <FaStarHalfAlt />;
		} else {
			icon = <FaRegStar />;
		}
		return icon;
	}

	return (
		<div className="rating">
			<span>{getStarIcon(value, 1)}</span>
			<span>{getStarIcon(value, 2)}</span>
			<span>{getStarIcon(value, 3)}</span>
			<span>{getStarIcon(value, 4)}</span>
			<span>{getStarIcon(value, 5)}</span>
			<span className="rating-text">{text ?? text}</span>
		</div>
	);
};
export default Rating;
