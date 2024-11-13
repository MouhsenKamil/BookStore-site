import { useForm } from "react-hook-form"


export enum PaymentMethod {
  CASH = "cash",
  CARD = "card",
}

interface CheckoutFormInputs {
  homeNo: string
  street: string
  pinCode: number
  city: string
  state: string
  country: string
  phoneNo: number
  paymentMethod: PaymentMethod
  cardNumber?: number
  cardHolderName?: string
  expiryDate?: string
  cvv?: number
}


export default function Checkout() {
  const { register, handleSubmit, watch, formState: { errors }} = useForm<CheckoutFormInputs>()

  const paymentMethod = watch("paymentMethod")

  const onSubmit = (data: CheckoutFormInputs) => {
    console.log("Form Data:", data)
    alert("Checkout Successful!")
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      <h2>Checkout Form</h2>
      <div>
        <input
          id="homeNo"
          {...register("homeNo", { required: "Home No is required" })}
          placeholder="Home No."
        />
        {errors.homeNo && <p className='red-text'>{errors.homeNo.message}</p>}
      </div>

      <div>
        <input
          id="street"
          {...register("street", { required: "Street is required" })}
          placeholder="Street"
        />
        {errors.street && <p className='red-text'>{errors.street.message}</p>}
      </div>

      <div>
        <input
          id="pinCode"
          type="number"
          {...register("pinCode", {
            required: "Pin Code is required",
            min: { value: 100000, message: "Invalid Pin Code" },
          })}
          placeholder="Pin Code"
        />
        {errors.pinCode && <p className='red-text'>{errors.pinCode.message}</p>}
      </div>

      <div>
        <input
          id="city"
          {...register("city", { required: "City is required" })}
          placeholder="City"
        />
        {errors.city && <p className='red-text'>{errors.city.message}</p>}
      </div>

      <div>
        <input
          id="state"
          {...register("state", { required: "State is required" })}
          placeholder="State"
        />
        {errors.state && <p className='red-text'>{errors.state.message}</p>}
      </div>

      <div>
        <input
          id="country"
          {...register("country", { required: "Country is required" })}
          placeholder="Country"
        />
        {errors.country && <p className='red-text'>{errors.country.message}</p>}
      </div>

      <div>
        <input
          id="phoneNo"
          type="number"
          {...register("phoneNo", {
            required: "Phone Number is required",
            minLength: { value: 10, message: "Invalid Phone Number" },
          })}
          placeholder="Phone Number"
        />
        {errors.phoneNo && <p className='red-text'>{errors.phoneNo.message}</p>}
      </div>

      <div>
        <label>Payment Method</label>
        <div>
          <label>
            <input
              type="radio"
              value={PaymentMethod.CASH}
              {...register("paymentMethod", { required: "Select a payment method" })}
            />
            Cash on Delivery
          </label>
          <label>
            <input
              type="radio"
              value={PaymentMethod.CARD}
              {...register("paymentMethod")}
            />
            Card
          </label>
        </div>
        {errors.paymentMethod && (
          <p className='red-text'>{errors.paymentMethod.message}</p>
        )}
      </div>

      {paymentMethod === PaymentMethod.CARD && (
        <>
          <div>
            <label htmlFor="cardNumber">Card Number</label>
            <input
              id="cardNumber"
              type="number"
              {...register("cardNumber", { required: "Card number is required" })}
            />
            {errors.cardNumber && (
              <p className='red-text'>{errors.cardNumber.message}</p>
            )}
          </div>

          <div>
            <label htmlFor="cardHolderName">Cardholder Name</label>
            <input
              id="cardHolderName"
              {...register("cardHolderName", { required: "Cardholder name is required" })}
            />
            {errors.cardHolderName && (
              <p className='red-text'>{errors.cardHolderName.message}</p>
            )}
          </div>

          <div>
            <label htmlFor="expiryDate">Expiry Date</label>
            <input
              id="expiryDate"
              type="month"
              {...register("expiryDate", { required: "Expiry date is required" })}
            />
            {errors.expiryDate && (
              <p className='red-text'>{errors.expiryDate.message}</p>
            )}
          </div>

          <div>
            <label htmlFor="cvv">CVV</label>
            <input
              id="cvv"
              type="number"
              {...register("cvv", {
                required: "CVV is required",
                min: { value: 100, message: "Invalid CVV" },
                max: { value: 999, message: "Invalid CVV" },
              })}
            />
            {errors.cvv && <p className='red-text'>{errors.cvv.message}</p>}
          </div>
        </>
      )}

      <button type="submit">Submit</button>
    </form>
  )
}