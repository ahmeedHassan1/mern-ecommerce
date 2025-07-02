import { useEffect, useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import { Form, Button } from "react-bootstrap";
import Message from "../../components/Message";
import Loader from "../../components/Loader";
import FormContainer from "../../components/FormContainer";
import UserSearchDropdown from "../../components/UserSearchDropdown";
import { toast } from "react-toastify";
import {
	useGetPromoDetailsQuery,
	useUpdatePromoMutation
} from "../../slices/promos";
import { useGetUsersByIdsMutation } from "../../slices/users";

const PromoEditScreen = () => {
	const { id: promoId } = useParams();

	const [code, setCode] = useState("");
	const [discount, setDiscount] = useState(0);
	const [maxUses, setMaxUses] = useState(0);
	const [expiresAt, setExpiresAt] = useState("");
	const [selectedUsers, setSelectedUsers] = useState([]);

	const {
		data: promo,
		isLoading,
		refetch,
		error
	} = useGetPromoDetailsQuery(promoId);

	const [updatePromo, { isLoading: loadingUpdate }] = useUpdatePromoMutation();
	const [getUsersByIds] = useGetUsersByIdsMutation();

	const navigate = useNavigate();

	useEffect(() => {
		const loadPromoData = async () => {
			if (promo) {
				setCode(promo.code);
				setDiscount(promo.discount);
				setMaxUses(promo.maxUses);
				setExpiresAt(new Date(promo.expiresAt).toISOString().split("T")[0]);

				// Load user details if there are user IDs
				if (promo.users && promo.users.length > 0) {
					try {
						const userDetails = await getUsersByIds(promo.users).unwrap();
						setSelectedUsers(userDetails);
					} catch (error) {
						console.error("Failed to load user details:", error);
						// Fallback: create placeholder user objects
						const userObjects = promo.users.map((userId) => ({
							_id: userId,
							name: `User ${userId}`,
							email: "Unknown"
						}));
						setSelectedUsers(userObjects);
					}
				} else {
					setSelectedUsers([]);
				}
			}
		};

		loadPromoData();
	}, [promo, getUsersByIds]);

	const submitHandler = async (e) => {
		e.preventDefault();
		try {
			const updatedPromo = {
				promoId,
				code,
				discount,
				maxUses,
				expiresAt,
				users: selectedUsers.map((user) => user._id) // Convert back to array of IDs
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
				<h1>Edit Promo Code</h1>
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
							<Form.Label>Eligible Users</Form.Label>
							<UserSearchDropdown
								selectedUsers={selectedUsers}
								onSelectionChange={setSelectedUsers}
								placeholder="Search users by name or email..."
							/>
							<Form.Text className="text-muted">
								Leave empty to make promo code available to all users
							</Form.Text>
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
