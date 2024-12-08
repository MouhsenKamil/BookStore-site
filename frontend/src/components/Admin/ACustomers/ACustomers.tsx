import { ChangeEvent, MouseEvent, useState } from "react"

import { IBlockableUser } from "../../../types/user"
import useCustomers from "../../../hooks/useCustomers"

import './ACustomers.css'
import { Link } from "react-router-dom"


export default function ACustomers() {
  const {
    customers, searchCustomers, updateCustomer, deleteCustomer, toggleBlockCustomer
  } = useCustomers()
  const [editingItem, setEditingItem] = useState<number[]>([])

  async function onEdit(e: MouseEvent<HTMLButtonElement>, customer: IBlockableUser, key: number) {
    if (!editingItem.includes(key)) {
      setEditingItem([...editingItem, key])
      return
    }

    const parentElem = e.currentTarget.parentElement?.parentElement

    if (!parentElem)
      return

    const newCustomerName = parentElem.querySelector(".customer-name")?.textContent || customer.name
    const newCustomerEmail = parentElem.querySelector(".customer-email")?.textContent || customer.email

    if ((customer.name !== newCustomerName) || (customer.email !== newCustomerEmail)) {
      await updateCustomer(customer._id, { name: newCustomerName, email: newCustomerEmail })
    }

    setEditingItem([...editingItem.filter(val => val !== key)])
  }

  return (
    <div className="customers-list-container">
      <h1>Customer List</h1>
      <input type="text" placeholder="Search Customers"
        onChange={async (e: ChangeEvent<HTMLInputElement>) => {
          await searchCustomers({ query: e.target.value })
        }}
      />

      {customers.length === 0
        ? <p>No customers are available.</p>
        : <table className="customers-list">
          <thead>
            <tr className="table-header">
              <th>ID</th>
              <th>Name</th>
              <th>Email</th>
              <th>Orders</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {customers.map((customer, key) => (
              <tr key={key} className="customer-item">
                <td className="customer-id">{customer._id}</td>
                <td className="customer-name" contentEditable={editingItem.includes(key)}>{customer.name}</td>
                <td className="customer-email" contentEditable={editingItem.includes(key)}>{customer.email}</td>
                <td className="customer-orders">
                  <Link to={`/admin/customers/${customer._id}/orders`}>Orders</Link>
                </td>
                <td className="customer-actions">
                  <button
                    type="button"
                    title={!customer.blocked ? "Block" : "Unblock"}
                    style={{ backgroundColor: customer.blocked ? 'green' : 'red' }}
                    onClick={async () => {
                      await toggleBlockCustomer(customer._id)
                    }}>
                    {!customer.blocked ? "Block" : "Unblock"}
                  </button>

                  <button
                    type="button"
                    title={!editingItem.includes(key) ? "Edit": "Confirm"}
                    onClick={async (e) => await onEdit(e, customer, key)}
                  >
                    {!editingItem.includes(key) ? "Edit": "Confirm"}
                  </button>

                  {editingItem.includes(key) &&
                    <button
                      type="button"
                      title="Cancel"
                      onClick={e => {
                        const parentElem = e.currentTarget.parentElement?.parentElement

                        if (!parentElem)
                          return

                        parentElem.querySelector(".customer-name")?.textContent || customer.name
                        parentElem.querySelector(".customer-email")?.textContent || customer.email
                        setEditingItem([...editingItem.filter(val => val !== key)])
                      }}
                    >
                      Cancel
                    </button>
                  }
        
                  <button type="button" title="Delete Customer" onClick={
                    async () => await deleteCustomer(customer._id)
                  }>
                    Delete
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      }
    </div>
  )
}
