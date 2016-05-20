import React from 'react'
import { Link, browserHistory } from 'react-router'

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
			<button onClick={() => browserHistory.push('/coupons')}>Go to /coupons</button>
		</div>
		<div>
			{children}
		</div>
	</div>
  )
}
