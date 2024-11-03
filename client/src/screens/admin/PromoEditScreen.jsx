import { useEffect, useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import { Form, Button } from "react-bootstrap";
import Message from "../../components/Message";
import Loader from "../../components/Loader";
import FormContainer from "../../components/FormContainer";
import { toast } from "react-toastify";
import {
	useGetPromoDetailsQuery,
	useUpdatePromoMutation
} from "../../slices/promos";

const PromoEditScreen = () => {
	const { id: promoId } = useParams();

	const [code, setCode] = useState("");
	const [discount, setDiscount] = useState(0);
	const [maxUses, setMaxUses] = useState(0);
	const [expiresAt, setExpiresAt] = useState("");
	const [users, setUsers] = useState([]);

	const {
		data: promo,
		isLoading,
		refetch,
		error
	} = useGetPromoDetailsQuery(promoId);

	const [updatePromo, { isLoading: loadingUpdate }] = useUpdatePromoMutation();

	const navigate = useNavigate();

	useEffect(() => {
		if (promo) {
			setCode(promo.code);
			setDiscount(promo.discount);
			setMaxUses(promo.maxUses);
			setExpiresAt(new Date(promo.expiresAt).toISOString().split("T")[0]);
			setUsers(promo.users);
		}
	}, [promo]);

	const submitHandler = async (e) => {
		e.preventDefault();
		try {
			const updatedPromo = {
				promoId,
				code,
				discount,
				maxUses,
				expiresAt,
				users
			};
			await updatePromo(updatedPromo).unwrap();
			toast.success("Promo updated");
			refetch();
			navigate("/admin/promolist");
		} catch (error) {
			toast.error(error?.data?.message || error.error);
		}
	};

	return (
		<>
			<Link to="/admin/promolist" className="btn btn-light my-3">
				Go Back
			</Link>
			<FormContainer>
				<h1>Edit Product</h1>
				{loadingUpdate && <Loader />}

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
					<Form onSubmit={submitHandler}>
						<Form.Group controlId="code" className="my-2">
							<Form.Label>Code</Form.Label>
							<Form.Control
								type="text"
								placeholder="Enter name"
								value={code}
								onChange={(e) => setCode(e.target.value)}></Form.Control>
						</Form.Group>

						<Form.Group controlId="discount" className="my-2">
							<Form.Label>Discount (%)</Form.Label>
							<Form.Control
								type="number"
								placeholder="Enter discount"
								value={discount}
								onChange={(e) => setDiscount(e.target.value)}></Form.Control>
						</Form.Group>

						<Form.Group controlId="maxUses" className="my-2">
							<Form.Label>Max Uses</Form.Label>
							<Form.Control
								type="number"
								placeholder="Enter max uses"
								value={maxUses}
								onChange={(e) => setMaxUses(e.target.value)}></Form.Control>
						</Form.Group>

						<Form.Group controlId="expiresAt" className="my-2">
							<Form.Label>Expires At</Form.Label>
							<Form.Control
								type="date"
								placeholder="Enter expiry date"
								value={expiresAt}
								onChange={(e) => setExpiresAt(e.target.value)}></Form.Control>
						</Form.Group>

						<Form.Group controlId="users" className="my-2">
							<Form.Label>Users</Form.Label>
							<Form.Control
								type="text"
								placeholder="Enter users IDs separated by commas"
								value={users}
								onChange={(e) =>
									setUsers(e.target.value ? e.target.value.split(",") : [])
								}></Form.Control>
						</Form.Group>

						<Button type="submit" variant="primary" className="my-2">
							Update
						</Button>
					</Form>
				)}
			</FormContainer>
		</>
	);
};
export default PromoEditScreen;
