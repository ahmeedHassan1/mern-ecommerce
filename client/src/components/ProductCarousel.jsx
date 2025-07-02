import { Link } from "react-router-dom";
import { Carousel, Image } from "react-bootstrap";
import { useGetTopProductsQuery } from "../slices/products";
import Loader from "./Loader";
import Message from "./Message";

const ProductCarousel = () => {
	const { data: products, isLoading, error } = useGetTopProductsQuery();

	return isLoading ? (
		<Loader />
	) : error ? (
		<Message variant="danger">
			{error?.data?.message ||
				error.message ||
				error.error ||
				"An error occurred"}
		</Message>
	) : (
		<Carousel
			pause="hover"
			className="bg-primary mb-4"
			style={{ maxHeight: "400px", overflow: "hidden" }}>
			{products.map((product) => (
				<Carousel.Item key={product._id} style={{ maxHeight: "400px" }}>
					<Link
						to={`/product/${product._id}`}
						style={{ display: "block", width: "100%" }}>
						<Image
							src={product.image}
							alt={product.name}
							style={{
								width: "100%",
								height: "400px",
								objectFit: "contain"
							}}
						/>
						<Carousel.Caption className="carousel-caption">
							<h2>
								{product.name} (${product.price})
							</h2>
						</Carousel.Caption>
					</Link>
				</Carousel.Item>
			))}
		</Carousel>
	);
};
export default ProductCarousel;
