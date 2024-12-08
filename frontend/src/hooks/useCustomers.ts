import { useEffect, useState } from "react"

import {
  getCustomersAPI,
  getCustomerByIdAPI,
  // changeUserPasswordAPI,
  updateCustomerAPI,
  deleteCustomerAPI,
  blockCustomerAPI,
  unblockCustomerAPI,
} from "../services/customerServices"
// import { ICustomer } from "../types/customer"
import { IBlockableUser } from "../types/user"
import { GetSearchResultsProps } from "../types/commonTypes"


export default function useCustomers() {
  const [customers, setCustomers] = useState<IBlockableUser[]>([])

  useEffect(() => {
    getCustomersAPI()
      .then(response => {
        setCustomers(response.data.results)
    })
  }, [])

  async function getCustomers() {
    return customers
  }

  async function searchCustomers(params: GetSearchResultsProps<IBlockableUser>) {
    const keys = Object.keys(params)
    if (keys.length === 0)
      return customers

    const response = await getCustomersAPI(params)
    setCustomers(response.data.results)
    return response
  }

  async function searchCustomerById(customerId: string) {
    return await getCustomerByIdAPI(customerId)    
  }

  async function getCustomerById(customerId: string) {
    return customers.find(customer => customer._id === customerId)
  }

  // async function changeUserPassword(customerId: string, oldPassword: string, newPassword: string) {
  //   await changeUserPasswordAPI(customerId, oldPassword, newPassword)
  // }

  async function updateCustomerInLocalList(
    customerId: string, data: Partial<Omit<IBlockableUser, '_id' | 'type'>>
  ) {
    const idxOfChangedCustomer = customers.findIndex(c => c._id === customerId)
    if (idxOfChangedCustomer === -1)
      throw new Error(`Customer ${customerId} not found`)

    const newCustomersList = [...customers.filter(c => c._id !== customerId)]

    newCustomersList.splice(idxOfChangedCustomer, 0, {
      ...customers[idxOfChangedCustomer], ...data
    })
    setCustomers(newCustomersList)
  }

  async function deleteCustomer(customerId: string) {
    const response = await deleteCustomerAPI(customerId)
    setCustomers(customers.filter(c => c._id !== customerId))
    return response
  }

  async function updateCustomer(
    customerId: string, data: Omit<IBlockableUser, '_id' | 'type' | 'blocked'>
  ) {
    const response = await updateCustomerAPI(customerId, data)
    updateCustomerInLocalList(customerId, data)
    return response
  }

  async function blockCustomer(customerId: string) {
    const response = await blockCustomerAPI(customerId)
    updateCustomerInLocalList(customerId, { blocked: true })
    return response
  }

  async function unblockCustomer(customerId: string) {
    const response = await unblockCustomerAPI(customerId)
    updateCustomerInLocalList(customerId, { blocked: false })
    return response
  }

  async function toggleBlockCustomer(customerId: string) {
    const customer = customers.find(c => c._id == customerId)
    if (!customer)
      throw new Error(`Customer ${customerId} not found`)

    if (customer.blocked)
      return await unblockCustomer(customerId)
    else
      return await blockCustomer(customerId)
  }

  return {
    customers,
    getCustomers,
    getCustomerById,
    searchCustomers,
    searchCustomerById,
    updateCustomer,
    deleteCustomer,
    blockCustomer,
    unblockCustomer,
    toggleBlockCustomer
  }
}
