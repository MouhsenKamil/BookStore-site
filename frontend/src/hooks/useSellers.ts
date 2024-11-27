import { useEffect, useState } from "react"

import {
  getSellersAPI,
  getSellerByIdAPI,
  // changeUserPasswordAPI,
  updateSellerAPI,
  deleteSellerAPI,
  blockSellerAPI,
  unblockSellerAPI
} from "../services/sellerServices"
// import { ISeller } from "../types/seller"
import { getBlockableUserAPIProps } from "../services/customerServices"
import { ISeller } from "../types/seller"


export default function useSellers() {
  const [sellers, setSellers] = useState<ISeller[]>([])

  useEffect(() => {
    getSellersAPI()
      .then(response => {
        setSellers(response.data.results)
    })
  }, [])

  async function getSellers() {
    return sellers
  }

  async function searchSellers(params: getBlockableUserAPIProps) {
    const keys = Object.keys(params)
    if (keys.length === 0)
      return sellers

    const response = await getSellersAPI(params)
    setSellers(response.data.results)
    return response
  }

  async function searchSellerById(sellerId: string) {
    return await getSellerByIdAPI(sellerId)    
  }

  async function getSellerById(sellerId: string) {
    return sellers.find(seller => seller._id === sellerId)
  }

  // async function changeUserPassword(sellerId: string, oldPassword: string, newPassword: string) {
  //   await changeUserPasswordAPI(sellerId, oldPassword, newPassword)
  // }

  async function updateSellerInLocalList(
    sellerId: string, data: Partial<Omit<ISeller, '_id' | 'type'>>
  ) {
    const idxOfChangedSeller = sellers.findIndex(c => c._id === sellerId)
    if (idxOfChangedSeller === -1)
      throw new Error(`Seller ${sellerId} not found`)

    let newSellersList = [...sellers.filter(c => c._id !== sellerId)]

    newSellersList.splice(idxOfChangedSeller, 0, {
      ...sellers[idxOfChangedSeller],
      ...data
    })
    setSellers(newSellersList)
  }

  async function deleteSeller(sellerId: string) {
    const response = await deleteSellerAPI(sellerId)
    setSellers(sellers.filter(c => c._id !== sellerId))
    return response
  }

  async function updateSeller(
    sellerId: string, data: Omit<ISeller, '_id' | 'type' | 'blocked'>
  ) {
    const response = await updateSellerAPI(sellerId, data)
    updateSellerInLocalList(sellerId, data)
    return response
  }

  async function blockSeller(sellerId: string) {
    const response = await blockSellerAPI(sellerId)
    updateSellerInLocalList(sellerId, { blocked: true })
    return response
  }

  async function unblockSeller(sellerId: string) {
    const response = await unblockSellerAPI(sellerId)
    updateSellerInLocalList(sellerId, { blocked: false })
    return response
  }

  async function toggleBlockSeller(sellerId: string) {
    const seller = sellers.find(c => c._id == sellerId)
    if (!seller)
      throw new Error(`Seller ${sellerId} not found`)

    if (seller.blocked)
      return await unblockSeller(sellerId)
    else
      return await blockSeller(sellerId)
  }

  return {
    sellers,
    getSellers,
    getSellerById,
    searchSellers,
    searchSellerById,
    updateSeller,
    deleteSeller,
    blockSeller,
    unblockSeller,
    toggleBlockSeller
  }
}
