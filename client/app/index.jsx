import React from 'react'
import { Link } from 'react-router'

export default function App( { children } ) {
  return (
	<div>
		<header>
			Links:
			{' '}
			<Link to="/">Home</Link>
			{' '}
			<Link to="/coupons">Coupons</Link>
			{' '}
			<Link to="/taxes">Taxes</Link>
		</header>
		<div>
			{children}
		</div>
	</div>
  )
}
