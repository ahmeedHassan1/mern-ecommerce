import { useEffect, useRef, useState } from "react";
import { Link, useParams } from "react-router-dom";
import {
	Row,
	Col,
	ListGroup,
	Image,
	Card,
	Button,
	Form
} from "react-bootstrap";
import { PayPalButtons, usePayPalScriptReducer } from "@paypal/react-paypal-js";
import { toast } from "react-toastify";
import Message from "../components/Message";
import Loader from "../components/Loader";
import {
	useGetOrderDetailsQuery,
	usePayOrderMutation,
	useGetPaypalClientIdQuery,
	useDeliverOrderMutation
} from "../slices/orders";
import { useSelector } from "react-redux";
import {
	useCheckPromoCodeMutation,
	useUsePromoCodeMutation
} from "../slices/promos";

const OrderScreen = () => {
	const { id: orderId } = useParams();

	const [promoCode, setPromoCode] = useState("");
	const [discount, setDiscount] = useState(0);
	const [totalAfterDiscount, setTotalAfterDiscount] = useState(0);
	const totalAfterDiscountRef = useRef(totalAfterDiscount);
	const promoCodeRef = useRef(promoCode);

	const {
		data: order,
		refetch,
		isLoading,
		error
	} = useGetOrderDetailsQuery(orderId);

	const [payOrder, { isLoading: loadingPay }] = usePayOrderMutation();

	const [deliverOrder, { isLoading: loadingDeliver }] =
		useDeliverOrderMutation();

	const [checkPromo, { isLoading: loadingCheck }] = useCheckPromoCodeMutation();

	const [usePromo] = useUsePromoCodeMutation();

	const [{ isPending }, paypalDispatch] = usePayPalScriptReducer();

	const {
		data: paypal,
		isLoading: loadingPayPal,
		error: errorPayPal
	} = useGetPaypalClientIdQuery();

	const { userInfo } = useSelector((state) => state.auth);

	useEffect(() => {
		if (!errorPayPal && !loadingPayPal && paypal.clientId) {
			const loadPaypalScript = async () => {
				paypalDispatch({
					type: "resetOptions",
					value: {
						"client-id": paypal.clientId,
						currency: "USD"
					}
				});
				paypalDispatch({ type: "setLoadingStatus", value: "pending" });
			};
			if (order && !order.isPaid) {
				if (!window.paypal) {
					loadPaypalScript();
				}
			}
		}
	}, [errorPayPal, loadingPayPal, order, paypal, paypalDispatch]);

	function onApprove(data, actions) {
		return actions.order.get().then(async function (details) {
			console.log("details", details);
			try {
				promoCodeRef.current && (await usePromo(promoCodeRef.current).unwrap());
				await payOrder({ orderId, details });
				refetch();
				toast.success("Order is paid");
			} catch (err) {
				toast.error(
					`${
						err?.data?.message || err.error
					} (If amount was deducted, please contact support)`
				);
			}
		});
	}

	// async function onApproveTest() {
	// 	await payOrder({ orderId, details: { payer: {} } });
	// 	refetch();

	// 	toast.success("Order is paid");
	// }

	function onError(err) {
		toast.error(err.message);
	}

	useEffect(() => {
		totalAfterDiscountRef.current = totalAfterDiscount;
		promoCodeRef.current = promoCode;
	}, [totalAfterDiscount, promoCode]);

	async function promoCodeSubmitHandler(e) {
		e.preventDefault();
		try {
			const res = await checkPromo(promoCode).unwrap();
			toast.success(res.message);
			setDiscount(res.discount);
			const newTotal =
				order.totalPrice - (order.totalPrice * res.discount) / 100;
			setTotalAfterDiscount(newTotal);
		} catch (error) {
			toast.error(error?.data?.message || error.error);
		}
	}

	async function createOrder(data, actions) {
		const total = totalAfterDiscountRef.current || order.totalPrice;
		if (promoCodeRef.current) {
			try {
				await checkPromo(promoCodeRef.current).unwrap();
			} catch (error) {
				return Promise.reject(
					new Error(
						`Order cannot be created due to: ${
							error?.data?.message || error.error
						}`
					)
				);
			}
		}
		return actions.order
			.create({
				purchase_units: [
					{
						amount: { value: total.toFixed(2) }
					}
				]
			})
			.then((orderID) => {
				return orderID;
			});
	}

	async function deliverOrderHandler() {
		try {
			await deliverOrder(orderId);
			refetch();
			toast.success("Order delivered");
		} catch (error) {
			toast.error(error?.data?.message || error.message);
		}
	}

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
		<>
			<h1>Order {order._id}</h1>
			<Row>
				<Col md={8}>
					<ListGroup variant="flush">
						<ListGroup.Item>
							<h2>Shipping</h2>
							<p>
								<strong>Name: </strong> {order.user.name}
							</p>
							<p>
								<strong>Email: </strong>{" "}
								<a href={`mailto:${order.user.email}`}>{order.user.email}</a>
							</p>
							<p>
								<strong>Address:</strong>
								{order.shippingAddress.address}, {order.shippingAddress.city}{" "}
								{order.shippingAddress.postalCode},{" "}
								{order.shippingAddress.country}
							</p>
							{order.isDelivered ? (
								<Message variant="success">
									Delivered on {order.deliveredAt}
								</Message>
							) : (
								<Message variant="danger">Not Delivered</Message>
							)}
						</ListGroup.Item>

						<ListGroup.Item>
							<h2>Payment Method</h2>
							<p>
								<strong>Method: </strong>
								{order.paymentMethod}
							</p>
							{order.isPaid ? (
								<Message variant="success">Paid on {order.paidAt}</Message>
							) : (
								<Message variant="danger">Not Paid</Message>
							)}
						</ListGroup.Item>

						<ListGroup.Item>
							<h2>Order Items</h2>
							{order.orderItems.length === 0 ? (
								<Message>Order is empty</Message>
							) : (
								<ListGroup variant="flush">
									{order.orderItems.map((item, index) => (
										<ListGroup.Item key={item._id}>
											<Row>
												<Col md={1}>
													<Image
														src={item.image}
														alt={item.name}
														fluid
														rounded
													/>
												</Col>
												<Col>
													<Link to={`/product/${item.product}`}>
														{item.name}
													</Link>
												</Col>
												<Col md={4}>
													{item.qty} x ${item.price} = ${item.qty * item.price}
												</Col>
											</Row>
										</ListGroup.Item>
									))}
								</ListGroup>
							)}
						</ListGroup.Item>
					</ListGroup>
				</Col>
				<Col md={4}>
					<Card>
						<ListGroup variant="flush">
							<ListGroup.Item>
								<h2>Order Summary</h2>
							</ListGroup.Item>
							<ListGroup.Item>
								<Row>
									<Col>Items</Col>
									<Col>${order.itemsPrice}</Col>
								</Row>
							</ListGroup.Item>
							<ListGroup.Item>
								<Row>
									<Col>Shipping</Col>
									<Col>${order.shippingPrice}</Col>
								</Row>
							</ListGroup.Item>
							<ListGroup.Item>
								<Row>
									<Col>Tax</Col>
									<Col>${order.taxPrice}</Col>
								</Row>
							</ListGroup.Item>
							<ListGroup.Item>
								<Row>
									<Col>Total</Col>
									<Col>${order.totalPrice}</Col>
								</Row>
							</ListGroup.Item>

							{discount > 0 && (
								<>
									<ListGroup.Item>
										<Row>
											<Col>Discount</Col>
											<Col>{discount}%</Col>
										</Row>
									</ListGroup.Item>

									<ListGroup.Item>
										<Row>
											<Col>Total After Discount</Col>
											<Col>${totalAfterDiscount}</Col>
										</Row>
									</ListGroup.Item>
								</>
							)}

							{!order.isPaid && (
								<ListGroup.Item>
									<Form onSubmit={promoCodeSubmitHandler}>
										<Form.Group controlId="promoCode">
											<Form.Label>Promo Code</Form.Label>
											<Form.Control
												type="text"
												required
												placeholder="Enter promo code"
												value={promoCode}
												onChange={(e) =>
													setPromoCode(e.target.value)
												}></Form.Control>
										</Form.Group>
										<Button type="submit" className="btn btn-block my-2">
											Apply Promo
										</Button>
									</Form>

									{loadingCheck && <Loader />}
								</ListGroup.Item>
							)}

							{!order.isPaid && (
								<ListGroup.Item>
									{loadingPay && <Loader />}

									{isPending ? (
										<Loader />
									) : (
										<div>
											{/* <Button
												style={{ marginBottom: "10px" }}
												onClick={onApproveTest}>
												Test Pay Order
											</Button> */}

											<div>
												<PayPalButtons
													createOrder={createOrder}
													onApprove={onApprove}
													onError={onError}></PayPalButtons>
											</div>
										</div>
									)}
								</ListGroup.Item>
							)}

							{loadingDeliver && <Loader />}

							{userInfo?.isAdmin && order.isPaid && !order.isDelivered && (
								<ListGroup.Item>
									<Button
										type="button"
										className="btn btn-block"
										onClick={deliverOrderHandler}>
										Mark As Delivered
									</Button>
								</ListGroup.Item>
							)}
						</ListGroup>
					</Card>
				</Col>
			</Row>
		</>
	);
};

export default OrderScreen;
