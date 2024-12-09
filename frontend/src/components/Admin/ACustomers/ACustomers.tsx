import { ChangeEvent, MouseEvent, useState } from "react"
import { Link } from "react-router-dom"

import { ThreeDotsOptionsBtn } from "../../Common/ThreeDotsOptionsBtn/ThreeDotsOptionsBtn"
import { IBlockableUser } from "../../../types/user"
import useCustomers from "../../../hooks/useCustomers"

import './ACustomers.css'


export default function ACustomers() {
  const {
    customers, searchCustomers, updateCustomer, deleteCustomer, toggleBlockCustomer
  } = useCustomers()
  const [editingItem, setEditingItem] = useState<number[]>([])

  async function submitEdit(e: MouseEvent, customer: IBlockableUser, key: number) {
    const parentElem = e.currentTarget.parentElement?.parentElement

    if (!parentElem)
      return

    const newCustomerName = parentElem.querySelector(".customer-name")?.textContent || customer.name
    const newCustomerEmail = parentElem.querySelector(".customer-email")?.textContent || customer.email

    if ((customer.name !== newCustomerName) || (customer.email !== newCustomerEmail)) {
      let res = await updateCustomer(customer._id, { name: newCustomerName, email: newCustomerEmail })
      console.log(res.status)
    }

    setEditingItem(editingItem.filter(val => val !== key))
  }

  function cancelEdit(e: MouseEvent, customer: IBlockableUser, key: number) {
    const parentElem = e.currentTarget.parentElement?.parentElement

    if (!parentElem)
      return

    setEditingItem(editingItem.filter(val => val !== key))

    const customerNameElem = parentElem.querySelector(".customer-name")
    if (customerNameElem)
      customerNameElem.textContent = customer.name

    const customerEmailElem = parentElem.querySelector(".customer-email")
    if (customerEmailElem)
      customerEmailElem.textContent = customer.email
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
              <th></th>
              <th></th>
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
                  {!editingItem.includes(key) && <ThreeDotsOptionsBtn>
                    <div title={!customer.blocked ? "Block" : "Unblock"}
                      style={{ color: customer.blocked ? 'green' : 'red' }}
                      onClick={async () => {
                        await toggleBlockCustomer(customer._id)
                        console.log(customer.blocked)
                      }}>
                      {!customer.blocked ? "Block" : "Unblock"}
                    </div>
                    <div title="Edit" onClick={() => setEditingItem([...editingItem, key])}>Edit</div>
                    <div title="Delete Customer" onClick={async () => await deleteCustomer(customer._id)}>Delete</div>
                  </ThreeDotsOptionsBtn>}

                  {editingItem.includes(key) && <>
                    <div title="Confirm" onClick={async (e) => await submitEdit(e, customer, key)}>✅</div>
                    <div title="Cancel" onClick={e => cancelEdit(e, customer, key)}>❌</div>
                  </>}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      }
    </div>
  )
}
