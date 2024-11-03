import { LinkContainer } from "react-router-bootstrap";
import { Table, Button, Row, Col } from "react-bootstrap";
import { FaEdit, FaTrash } from "react-icons/fa";
import Message from "../../components/Message";
import Loader from "../../components/Loader";
import {
	useCreatePromoMutation,
	useDeletePromoMutation,
	useGetPromosQuery
} from "../../slices/promos";
import { toast } from "react-toastify";

const PromoListScreen = () => {
	const { data: promos, isLoading, error, refetch } = useGetPromosQuery();

	const [deletePromo, { isLoading: loadingDelete }] = useDeletePromoMutation();

	const [createPromo, { isLoading: loadingCreate }] = useCreatePromoMutation();

	const deleteHandler = async (id) => {
		if (window.confirm("Are you sure you want to delete this promo?")) {
			try {
				await deletePromo(id);
				toast.success("Promo deleted successfully");
				refetch();
			} catch (error) {
				toast.error(error?.data?.message || error.error);
			}
		}
	};

	const createPromoHandler = async () => {
		if (window.confirm("Are you sure you want to create a new promo?")) {
			try {
				await createPromo();
				refetch();
			} catch (error) {
				toast.error(error?.data?.message || error.error);
			}
		}
	};

	return (
		<>
			<Row className="align-items-center">
				<Col>
					<h1>Promos</h1>
				</Col>
				<Col className="text-end">
					<Button className="btn-sm m-3" onClick={createPromoHandler}>
						<FaEdit /> Create Promo
					</Button>
				</Col>
			</Row>

			{loadingCreate && <Loader />}
			{loadingDelete && <Loader />}

			{isLoading ? (
				<Loader />
			) : error ? (
				<Message variant="danger">
					{error?.data?.message ||
						error.message ||
						error.error ||
						"An error occurred"}
				</Message>
			) : (
				<Table striped hover responsive className="table-sm">
					<thead>
						<tr>
							<th>ID</th>
							<th>CODE</th>
							<th>DISCOUNT</th>
							<th>MAX-USES</th>
							<th>USES</th>
							<th>EXPIRES</th>
							<th>USERS</th>
							<th></th>
						</tr>
					</thead>
					<tbody>
						{promos.map((promo) => (
							<tr key={promo._id}>
								<td>{promo._id}</td>
								<td>{promo.code}</td>
								<td>{promo.discount}%</td>
								<td>{promo.maxUses}</td>
								<td>{promo.uses}</td>
								<td>
									{new Date(promo.expiresAt).toLocaleDateString("en-US", {
										year: "numeric",
										month: "long",
										day: "numeric"
									})}
								</td>
								<td>
									{promo.users.length
										? `${promo.users.length} user${
												promo.users.length > 1 ? "s" : ""
										  }`
										: "0"}
								</td>
								<td>
									<LinkContainer to={`/admin/promo/${promo._id}/edit`}>
										<Button className="btn-sm mx-2" variant="light">
											<FaEdit />
										</Button>
									</LinkContainer>
									<Button
										className="btn-sm"
										variant="danger"
										onClick={() => deleteHandler(promo._id)}>
										<FaTrash style={{ color: "white" }} />
									</Button>
								</td>
							</tr>
						))}
					</tbody>
				</Table>
			)}
		</>
	);
};
export default PromoListScreen;
