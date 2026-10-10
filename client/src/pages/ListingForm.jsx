import { useEffect, useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { api } from '../api'

// TODO: build the Sell an Item page — see README.md "Your task".
// This page is already routed at /listings/new (sell) and /listings/:id (edit),
// and both routes are wrapped in <ProtectedRoute>.

const defaults = { title: '', description: '', price: 0, category: 'other', condition: 'used', status: 'active' }

export default function ListingForm() {
  const nav = useNavigate()
  const { id } = useParams()
  const [form, setForm] = useState(defaults)
  const [error, setError] = useState('')

  // TODO (edit mode): when there is an `id`, load the listing and fill the form.
  useEffect(() => {
    if (!id) return
    api.get(`/listings/${id}`)
      .then(res => {
        const l = res.data.listing ?? res.data
        setForm({
          title: l.title ?? '',
          price: l.price ?? 0,
          category: l.category ?? 'other',
          condition: l.condition ?? 'used',
          status: l.status ?? 'active',
          description: l.description ?? '',
        })
      })
      .catch(err => setError(err?.response?.data?.message || 'Could not load listing'))
  }, [id])

  // TODO: update `form` when an input changes (price should be a number).
  function onChange(e) {
    const { name, value, type } = e.target
    setForm(prev => ({
     ...prev,
     [name]: type === 'number' ? Number(value) : value,
    }))
  }

  // TODO: POST a new listing, or PATCH the existing one when editing,
  // then go back to /listings. Show the server's error message on failure.
  async function onSubmit(e) {
    e.preventDefault()
    setError('')
    try {
      if (id) {
        await api.patch(`/listings/${id}`, form)    
      } else {
        await api.post('/listings', form)   
      }
      nav('/listings')
    } catch (err) {
      setError(err?.response?.data?.message || 'Something went wrong')
    }
  }

  return (
    <div className="max-w-lg mx-auto card">
      <h1 className="text-xl font-semibold mb-4">{id ? 'Edit' : 'New'} Listing</h1>
      <form onSubmit={onSubmit} className="space-y-3">
        <label className="block text-sm">
          Title
          <input name="title" value={form.title} onChange={onChange} required />
        </label>

        <label className="block text-sm">
          Price
          <input name="price" type="number" min="0" step="0.01" value={form.price} onChange={onChange} required />
        </label>

        <label className="block text-sm">
          Category
          <select name="category" value={form.category} onChange={onChange}>
            <option value="textbooks">textbooks</option>
            <option value="electronics">electronics</option>
            <option value="furniture">furniture</option>
            <option value="clothing">clothing</option>
            <option value="other">other</option>
          </select>
        </label>

        <label className="block text-sm">
          Condition
          <select name="condition" value={form.condition} onChange={onChange}>
            <option value="new">new</option>
            <option value="like-new">like-new</option>
            <option value="used">used</option>
            <option value="worn">worn</option>
          </select>
        </label>

{id && (
  <label className="block text-sm">
    Status
    <select name="status" value={form.status} onChange={onChange}>
      <option value="active">active</option>
      <option value="sold">sold</option>
    </select>
  </label>
)}

<label className="block text-sm">
  Description
  <textarea name="description" value={form.description} onChange={onChange} />
</label>
        {error && <div className="text-red-600 text-sm">{error}</div>}
        <button className="btn" type="submit">Save</button>
      </form>
    </div>
  )
}
