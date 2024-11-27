import { MouseEvent, useEffect, useState } from "react"

import {
  blockCustomerAPI, deleteCustomerAPI, getCustomersAPI, unblockCustomerAPI, updateCustomerAPI
} from "../../../services/customerServices"
import { IBlockableUser } from "../../../types/user"

import './ACustomers.css'


export default function ACustomers() {
  const [customers, setCustomers] = useState<IBlockableUser[]>([])
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
      const newData: IBlockableUser = {
        ...customer, name: newCustomerName, email: newCustomerEmail
      }

      await updateCustomerAPI(customer._id, newData)

      const idxOfChangedCustomer = customers.findIndex(c => c._id === customer._id)
      let newCustomersList = [...customers.filter(c => c._id !== customer._id)]
  
      newCustomersList.splice(idxOfChangedCustomer, 0, newData)
    }

    setEditingItem([...editingItem.filter(val => val !== key)])
  }

  async function fetchCustomers() {
    let params = {
      query: '',
      fields: ['_id', 'name', 'email', 'blocked']
    }

    const response = await getCustomersAPI(params)
    setCustomers(response.data.results)
  }

  useEffect(() => {
    fetchCustomers()
  }, [])

  async function deleteCustomer(customerId: string) {
    const response = await deleteCustomerAPI(customerId)
    if (response.status === 200)
      setCustomers(customers.filter(customer => customer._id !== customerId))
  }

  async function toggleBlockCustomer(customerId: string, blocked: boolean) {
    if (blocked)
      await unblockCustomerAPI(customerId)
    else
      await blockCustomerAPI(customerId)

    const idxOfChangedCustomer = customers.findIndex(customer => customer._id === customerId)
    let newCustomersList = [...customers.filter(customer => customer._id !== customerId)]

    newCustomersList.splice(
      idxOfChangedCustomer, 0, {
        ...customers.find(customer => customer._id === customerId),
        blocked: !blocked,
      } as IBlockableUser
    )

    setCustomers(newCustomersList)
  }

  return (
    <div className="customers-list-container">
      <h1>Customer List</h1>
      {customers.length === 0
        ? <p>No customers are available.</p>
        : <table className="customers-list">
          <thead>
            <th>ID</th>
            <th>Name</th>
            <th>Email</th>
            <th>Actions</th>
          </thead>
          <tbody>
            {customers.map((customer, key) => (
              <tr key={key} className="customer-item">
                <td className="customer-id">{customer._id}</td>
                <td className="customer-name" contentEditable={editingItem.includes(key)}>{customer.name}</td>
                <td className="customer-email" contentEditable={editingItem.includes(key)}>{customer.email}</td>
                <td className="customer-actions">
                  <button
                    type="button"
                    title={!customer.blocked ? "Block" : "Unblock"}
                    style={{ backgroundColor: customer.blocked ? 'green' : 'red' }}
                    onClick={async () => {
                      console.log(customer.blocked)
                      await toggleBlockCustomer(customer._id, customer.blocked)
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
        
                  <button type="button" title="Delete Customer" onClick={() => deleteCustomer(customer._id)}>
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
