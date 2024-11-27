import { ChangeEvent, MouseEvent, useState } from "react"

import useSellers from "../../../hooks/useSellers"
import { ISeller } from "../../../types/seller"

import './ASellers.css'


export default function ASellers() {
  const {
    sellers, searchSellers, updateSeller, deleteSeller, toggleBlockSeller
  } = useSellers()
  const [editingItem, setEditingItem] = useState<number[]>([])

  async function onEdit(e: MouseEvent<HTMLButtonElement>, seller: ISeller, key: number) {
    if (!editingItem.includes(key)) {
      setEditingItem([...editingItem, key])
      return
    }

    const parentElem = e.currentTarget.parentElement?.parentElement

    if (!parentElem)
      return

    const newSellerName = parentElem.querySelector(".seller-name")?.textContent || seller.name
    const newSellerEmail = parentElem.querySelector(".seller-email")?.textContent || seller.email
    const newSellerPassportNo = parentElem.querySelector(".seller-passport-num")?.textContent || seller.passportNo
    const newSellerPhoneNo = parentElem.querySelector(".seller-email")?.textContent || seller.phoneNo

    if (
      (seller.name !== newSellerName)
      || (seller.email !== newSellerEmail)
      || (seller.passportNo !== newSellerPassportNo)
      || (seller.phoneNo !== newSellerPhoneNo)
    ) {
      await updateSeller(seller._id, {
        name: newSellerName,
        email: newSellerEmail,
        passportNo: newSellerPassportNo,
        phoneNo: newSellerPhoneNo
      })

      // const idxOfChangedSeller = sellers.findIndex(c => c._id === seller._id)
      // let newSellersList = [...sellers.filter(c => c._id !== seller._id)]
  
      // newSellersList.splice(idxOfChangedSeller, 0, newData)
    }

    setEditingItem([...editingItem.filter(val => val !== key)])
  }

  // async function fetchSellers(query: string = '') {
  //   let params = {
  //     query, fields: ['_id', 'name', 'email', 'blocked']
  //   }

  //   const response = await getSellersAPI(params)
  //   setSellers(response.data.results)
  // }

  // useEffect(() => {
  //   fetchSellers()
  // }, [])

  // async function deleteSeller(sellerId: string) {
  //   const response = await deleteSellerAPI(sellerId)
  //   if (response.status === 200)
  //     setSellers(sellers.filter(seller => seller._id !== sellerId))
  // }

  // async function toggleBlockSeller(sellerId: string, blocked: boolean) {
  //   if (blocked)
  //     await unblockSellerAPI(sellerId)
  //   else
  //     await blockSellerAPI(sellerId)

  //   const idxOfChangedSeller = sellers.findIndex(seller => seller._id === sellerId)
  //   let newSellersList = [...sellers.filter(seller => seller._id !== sellerId)]

  //   newSellersList.splice(
  //     idxOfChangedSeller, 0, {
  //       ...sellers.find(seller => seller._id === sellerId),
  //       blocked: !blocked,
  //     } as ISeller
  //   )

  //   setSellers(newSellersList)
  // }

  return (
    <div className="sellers-list-container">
      <h1>Seller List</h1>
      <input type="text" onChange={async (e: ChangeEvent<HTMLInputElement>) => {
        await searchSellers({ query: e.target.value })
      }} />
      {sellers.length === 0
        ? <p>No sellers are available.</p>
        : <table className="sellers-list">
          <thead>
            <tr className="table-header">
              <th>ID</th>
              <th>Name</th>
              <th>Email</th>
              <th>Passport number</th>
              <th>Phone number</th>
              <th>Actions</th>
            </tr>
          </thead>

          <tbody>
            {sellers.map((seller, key) => (
              <tr key={key} className="seller-item">
                <td className="seller-id">{seller._id}</td>

                <td className="seller-name" contentEditable={editingItem.includes(key)}>
                  {seller.name}
                </td>

                <td className="seller-email" contentEditable={editingItem.includes(key)}>
                  {seller.email}
                </td>

                <td className="seller-passport-num" contentEditable={editingItem.includes(key)}>
                  {seller.passportNo}
                </td>

                <td className="seller-phone-num" contentEditable={editingItem.includes(key)}>
                  {seller.phoneNo}
                </td>

                <td className="seller-actions">
                  <button
                    type="button"
                    title={!seller.blocked ? "Block" : "Unblock"}
                    style={{ backgroundColor: seller.blocked ? 'green' : 'red' }}
                    onClick={async () => {
                      await toggleBlockSeller(seller._id)
                    }}>
                    {!seller.blocked ? "Block" : "Unblock"}
                  </button>
        
                  <button
                    type="button"
                    title={!editingItem.includes(key) ? "Edit": "Confirm"}
                    onClick={async (e) => await onEdit(e, seller, key)}
                  >
                    {!editingItem.includes(key) ? "Edit": "Confirm"}
                  </button>
        
                  <button type="button" title="Delete Seller" onClick={
                    async () => await deleteSeller(seller._id)
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
