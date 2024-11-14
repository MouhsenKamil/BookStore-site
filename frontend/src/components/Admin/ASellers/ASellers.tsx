import { useEffect, useState } from "react"
import axios from "axios"
import { IUser } from "../../../types/user"


export default function ASellers() {
  const [sellers, setSellers] = useState<IUser[]>([])

  useEffect(() => {
    async function fetchSellers() {
      try {
        const response = await axios.get("/api/admin/sellers", {
          params: {
            fields: ['_id', 'name', 'email', 'blocked']
          }
        })
        if (response.status !== 200)
          throw new Error(response.data.error)
        setSellers(response.data)
      } catch (error) {
        console.error(error)
      }
    }

    fetchSellers()
  }, [])

  async function deleteSeller(sellerId: string) {
    try {
      const response = await axios.delete(`/api/sellers/${sellerId}`)
      if (response.status !== 200)
        throw new Error(response.data.error)
      setSellers(sellers.filter(seller => seller._id !== sellerId))
    } catch (error) {
      console.error(error)
    }
  }

  async function toggleBlockSeller(sellerId: string, currBlock: boolean) {
    try {
      const shouldBlock = currBlock ? 'unblock' : 'block'
      const response = await axios.patch(`/api/sellers/${sellerId}/${shouldBlock}`)
      if (response.status !== 200)
        throw new Error(response.data.error)
    } catch (error) {
      console.error(error)
    }
  }

  return (
    <div className="sellers-list">
      <h1>Seller List</h1>
      {sellers.length === 0 ? (
        <p>No sellers available.</p>
      ) : (
        <ul>
          {sellers.map((seller) => (
            <li key={seller._id} className="seller-item">
              <p>
                <strong>{seller.name}</strong>
                {seller.email}
              </p>
              <button onClick={() => toggleBlockSeller(seller._id, seller.blocked)}>
                {seller.blocked ? "Block" : "Unblock"}
              </button>
              <button onClick={() => deleteSeller(seller._id)}>Delete</button>
            </li>
          ))}
        </ul>
      )}
    </div>
  )
}
