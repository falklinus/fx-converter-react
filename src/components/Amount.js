const Amount = ({ amount, setAmount }) => {
  return (
    <div className='amount'>
      <p className='placeholder'>{amount && 'Amount in SEK'}</p>
      <input
        className='amount__input'
        type='number'
        value={amount}
        onChange={({ target }) => setAmount(target.value)}
        placeholder='Enter amount in SEK...'
      />
    </div>
  )
}

export default Amount
