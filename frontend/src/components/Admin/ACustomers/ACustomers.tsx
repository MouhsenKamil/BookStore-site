import { useEffect, useState } from "react"
import axios from "axios"
import { IUser } from "../../../types/user"


export default function ACustomers() {
  const [customers, setCustomers] = useState<IUser[]>([])

  useEffect(() => {
    async function fetchCustomers() {
      try {
        const response = await axios.get("/api/admin/customers", {
          params: {
            query: '',
            fields: ['_id', 'name', 'email', 'blocked']
          }
        })
        if (response.status !== 200)
          throw new Error(response.data.error)
        setCustomers(response.data)
      } catch (error) {
        console.error(error)
      }
    }

    fetchCustomers()
  }, [])

  async function deleteCustomer(customerId: string) {
    try {
      const response = await axios.delete(`/api/customer/${customerId}`)
      if (response.status !== 200)
        throw new Error(response.data.error)
      setCustomers(customers.filter(customer => customer._id !== customerId))
    } catch (error) {
      console.error(error)
    }
  }

  async function toggleBlockCustomer(customerId: string, currBlock: boolean) {
    try {
      const shouldBlock = currBlock ? 'unblock': 'block'
      const response = await axios.patch(`/api/customer/${customerId}/${shouldBlock}`)
      if (response.status !== 200)
        throw new Error(response.data.error)
    } catch (error) {
      console.error(error)
    }
  }

  return (
    <div className="customers-list">
      <h1>Customer List</h1>
      {!customers.length ? (
        <p>No customers available.</p>
      ) : (
        <ul>
          {customers.map((customer) => (
            <li key={customer._id} className="customer-item">
              <p>
                <strong>{customer.name}</strong>
                {customer.email}
              </p>
              <button onClick={() => toggleBlockCustomer(customer._id, customer.blocked)}>
                {customer.blocked ? "Block": "Unblock"}
              </button>
              <button onClick={() => deleteCustomer(customer._id)}>Delete</button>
            </li>
          ))}
        </ul>
      )}
    </div>
  )
}
