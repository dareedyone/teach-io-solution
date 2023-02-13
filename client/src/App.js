import { useState, useEffect } from "react";
import "./App.css";
import { getCharges } from "./services";
import { postRefund } from "./services/index";

function App() {
	const [charges, setCharges] = useState([]);
	const [loading, setLoading] = useState(false);

	useEffect(() => {
		(async () => {
			const charges = await getCharges();

			setCharges(charges?.data?.data || []);
		})();
	}, []);
	console.log("charges", charges);
	const handleRefund = async (charge_id) => {
		try {
			setLoading(true);
			const result = await postRefund({ charge_id });
			const updatedCharges = charges.map((charge) =>
				charge.charge_id === charge_id ? result.data.data : charge
			);
			setCharges(updatedCharges);

			setLoading(false);
		} catch (error) {
			setLoading(false);
			console.log("ref error", error);
		}
	};

	return (
		<div className="App">
			<div className="container">
				<div className="row justify-content-center p-5">
					<table className="table w-75">
						<thead>
							<tr>
								<th scope="col">#</th>
								<th scope="col">Customer</th>
								<th scope="col">Amount</th>

								<th scope="col">Currency</th>
								<th scope="col">Date</th>
								<th scope="col">Action</th>
							</tr>
						</thead>
						<tbody>
							{charges.map((charge, index) => (
								<tr key={charge?._id}>
									<td>{index + 1}</td>
									<td>{charge?.customer || "N/A"}</td>
									<td>{charge?.amount}</td>

									<td>{charge?.currency}</td>

									<td>{new Date(charge?.created).toLocaleDateString()}</td>
									<td>
										<button
											onClick={() => handleRefund(charge.charge_id)}
											disabled={charge?.refunded}
											className={`btn ${
												charge?.refunded ? "btn-secondary" : "btn-success"
											}`}
										>
											{charge?.refunded ? "Refunded" : "Refund"}
										</button>
									</td>
								</tr>
							))}
						</tbody>
					</table>
					<div className="text-center">
						{loading && (
							<>
								&nbsp;
								<div className="spinner-border spinner-border-sm" role="status">
									<span className="visually-hidden">Loading...</span>
								</div>
							</>
						)}
					</div>
				</div>
			</div>
		</div>
	);
}

export default App;
