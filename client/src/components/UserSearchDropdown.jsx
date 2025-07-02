import { useState, useEffect, useRef } from "react";
import { Form, ListGroup, Badge, Button } from "react-bootstrap";
import { useSearchUsersQuery } from "../slices/users";
import { FaTimes } from "react-icons/fa";

const UserSearchDropdown = ({
	selectedUsers = [],
	onSelectionChange,
	placeholder = "Search users..."
}) => {
	const [searchQuery, setSearchQuery] = useState("");
	const [showDropdown, setShowDropdown] = useState(false);
	const [isTyping, setIsTyping] = useState(false);
	const searchRef = useRef(null);
	const dropdownRef = useRef(null);

	// Debounce search query
	const [debouncedQuery, setDebouncedQuery] = useState("");

	useEffect(() => {
		const timer = setTimeout(() => {
			setDebouncedQuery(searchQuery);
			setIsTyping(false);
		}, 300);

		setIsTyping(true);
		return () => clearTimeout(timer);
	}, [searchQuery]);

	const { data: searchResults = [], isLoading } = useSearchUsersQuery(
		{ query: debouncedQuery, limit: 10 },
		{ skip: !debouncedQuery.trim() }
	);

	// Filter out already selected users
	const availableUsers = searchResults.filter(
		(user) => !selectedUsers.some((selected) => selected._id === user._id)
	);

	// Handle click outside to close dropdown
	useEffect(() => {
		const handleClickOutside = (event) => {
			if (
				dropdownRef.current &&
				!dropdownRef.current.contains(event.target) &&
				searchRef.current &&
				!searchRef.current.contains(event.target)
			) {
				setShowDropdown(false);
			}
		};

		document.addEventListener("mousedown", handleClickOutside);
		return () => document.removeEventListener("mousedown", handleClickOutside);
	}, []);

	const handleUserSelect = (user) => {
		const updatedUsers = [...selectedUsers, user];
		onSelectionChange(updatedUsers);
		setSearchQuery("");
		setShowDropdown(false);
	};

	const handleUserRemove = (userId) => {
		const updatedUsers = selectedUsers.filter((user) => user._id !== userId);
		onSelectionChange(updatedUsers);
	};

	const handleInputFocus = () => {
		setShowDropdown(true);
	};

	const handleInputChange = (e) => {
		setSearchQuery(e.target.value);
		setShowDropdown(true);
	};

	return (
		<div className="position-relative">
			{/* Selected Users Display */}
			{selectedUsers.length > 0 && (
				<div className="mb-2">
					<small className="text-muted">Selected Users:</small>
					<div className="d-flex flex-wrap gap-2 mt-1">
						{selectedUsers.map((user) => (
							<Badge
								key={user._id}
								bg="primary"
								className="d-flex align-items-center gap-1 p-2">
								<span>
									{user.name} ({user.email})
								</span>
								<Button
									variant="link"
									size="sm"
									className="p-0 text-white"
									onClick={() => handleUserRemove(user._id)}
									style={{ lineHeight: 1 }}>
									<FaTimes size={12} />
								</Button>
							</Badge>
						))}
					</div>
				</div>
			)}

			{/* Search Input */}
			<Form.Control
				ref={searchRef}
				type="text"
				placeholder={placeholder}
				value={searchQuery}
				onChange={handleInputChange}
				onFocus={handleInputFocus}
			/>

			{/* Dropdown Results */}
			{showDropdown && (
				<div
					ref={dropdownRef}
					className="position-absolute w-100 shadow bg-white border rounded"
					style={{
						zIndex: 1000,
						top: "100%",
						maxHeight: "200px",
						overflowY: "auto"
					}}>
					<ListGroup>
						{isLoading || isTyping ? (
							<ListGroup.Item className="text-center text-muted">
								{isTyping ? "Typing..." : "Searching..."}
							</ListGroup.Item>
						) : searchQuery.trim() && availableUsers.length === 0 ? (
							<ListGroup.Item className="text-center text-muted">
								No users found
							</ListGroup.Item>
						) : searchQuery.trim() ? (
							availableUsers.map((user) => (
								<ListGroup.Item
									key={user._id}
									action
									onClick={() => handleUserSelect(user)}
									className="cursor-pointer d-flex justify-content-between align-items-center"
									style={{ cursor: "pointer" }}>
									<div>
										<strong>{user.name}</strong>
										<br />
										<small className="text-muted">{user.email}</small>
									</div>
								</ListGroup.Item>
							))
						) : (
							<ListGroup.Item className="text-center text-muted">
								Start typing to search users...
							</ListGroup.Item>
						)}
					</ListGroup>
				</div>
			)}
		</div>
	);
};

export default UserSearchDropdown;
