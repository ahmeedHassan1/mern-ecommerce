import { Row, Col } from "react-bootstrap";
import { Product } from "../components/Product";
import { useGetProductsQuery } from "../slices/products";
import Loader from "../components/Loader";
import Message from "../components/Message";
import { useParams } from "react-router-dom";
import Paginate from "../components/Paginate";

const HomeScreen = () => {
	const { pageNumber } = useParams();

	const { data, isLoading, error } = useGetProductsQuery({ pageNumber });

	return (
		<>
			{isLoading && <Loader />}
			{error && (
				<Message variant="danger">
					{error?.data?.message || error.error}
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
					<Paginate pages={data.pages} page={data.page} isAdmin={false} />
				</>
			)}
		</>
	);
};
export default HomeScreen;
