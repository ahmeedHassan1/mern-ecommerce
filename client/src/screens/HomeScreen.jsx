import { Row, Col } from "react-bootstrap";
import { Product } from "../components/Product";
import { useGetProductsQuery } from "../slices/products";
import Loader from "../components/Loader";
import Message from "../components/Message";
import { Link, useParams } from "react-router-dom";
import Paginate from "../components/Paginate";
import ProductCarousel from "../components/ProductCarousel";

const HomeScreen = () => {
	const { pageNumber, keyword } = useParams();

	const { data, isLoading, error } = useGetProductsQuery({
		pageNumber,
		keyword
	});

	return (
		<>
			{!keyword ? (
				<ProductCarousel />
			) : (
				<Link to="/" className="btn btn-light mb-4">
					Go Back
				</Link>
			)}
			{isLoading && <Loader />}
			{error && (
				<Message variant="danger">
					{error?.data?.message ||
						error.message ||
						error.error ||
						"An error occurred"}
				</Message>
			)}
			{!isLoading && !error && (
				<>
					<h1>Latest Products</h1>
					<Row>
						{data.products.map((product) => (
							<Col key={product._id} sm={12} md={6} lg={4} xl={3}>
								<Product product={product}></Product>
							</Col>
						))}
					</Row>
					<Paginate
						pages={data.pages}
						page={data.page}
						isAdmin={false}
						keyword={keyword || ""}
					/>
				</>
			)}
		</>
	);
};
export default HomeScreen;
