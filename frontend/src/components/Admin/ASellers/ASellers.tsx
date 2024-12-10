import { ChangeEvent, MouseEvent, useState } from "react"

import useSellers from "../../../hooks/useSellers"
import { ISeller } from "../../../types/seller"

import './ASellers.css'
import { ThreeDotsOptionsBtn } from "../../Common/ThreeDotsOptionsBtn/ThreeDotsOptionsBtn"


export default function ASellers() {
  const {
    sellers, searchSellers, updateSeller, deleteSeller, toggleBlockSeller
  } = useSellers()
  const [editingItem, setEditingItem] = useState<number[]>([])

  async function submitEdit(e: MouseEvent, seller: ISeller, key: number) {
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
    }

    setEditingItem(editingItem.filter(val => val !== key))
  }

  function cancelEdit(e: MouseEvent, seller: ISeller, key: number) {
    const parentElem = e.currentTarget.parentElement?.parentElement

    if (!parentElem)
      return

    setEditingItem(editingItem.filter(val => val !== key))

    const sellerNameElem = parentElem.querySelector(".seller-name")
    if (sellerNameElem)
      sellerNameElem.textContent = seller.name

    const sellerEmailElem = parentElem.querySelector(".seller-email")
    if (sellerEmailElem)
      sellerEmailElem.textContent = seller.email
  }

  return (
    <div className="sellers-list-container">
      <h1>Seller List</h1>
      <input type="text" placeholder="Search Sellers"
        onChange={async (e: ChangeEvent<HTMLInputElement>) => {
          await searchSellers({ query: e.target.value })
        }}
      />

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
              <th></th>
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
                {!editingItem.includes(key) && <ThreeDotsOptionsBtn>
                    <div title={!seller.blocked ? "Block" : "Unblock"}
                      style={{ color: seller.blocked ? 'green' : 'red' }}
                      onClick={async () => await toggleBlockSeller(seller._id)}>
                      {!seller.blocked ? "Block" : "Unblock"}
                    </div>
                    <div title="Edit" onClick={() => setEditingItem([...editingItem, key])}>Edit</div>
                    <div title="Delete Seller" onClick={async () => await deleteSeller(seller._id)}>Delete</div>
                  </ThreeDotsOptionsBtn>}

                  {editingItem.includes(key) && <>
                    <div title="Confirm" onClick={async (e) => await submitEdit(e, seller, key)}>✅</div>
                    <div title="Cancel" onClick={e => cancelEdit(e, seller, key)}>❌</div>
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
